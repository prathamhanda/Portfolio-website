import type { Plugin, ViteDevServer } from "vite";
import { loadEnv } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Local dev support for Vercel-style serverless functions.
 *
 * Vercel only executes the `api/` directory when deployed. Under `vite dev`
 * those routes do not exist, so a POST to /api/chat falls through to the SPA
 * fallback and returns index.html with a 404. That made the AI command palette
 * look "broken" even when the Gemini key was valid.
 *
 * This plugin mounts the real handler from api/chat.js into the Vite dev
 * server so local behaviour matches production. It is dev-only and is not
 * included in the production bundle.
 */
export function vercelFunctions(): Plugin {
  return {
    name: "vercel-functions-dev",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      // Vite only exposes VITE_* vars on import.meta.env, but the serverless
      // handler reads process.env. Copy the server-only vars across so the key
      // resolves locally. We deliberately skip anything VITE_* prefixed: those
      // are public by definition and must never reach the handler via this path.
      const env = loadEnv(server.config.mode, process.cwd(), "");
      for (const [key, value] of Object.entries(env)) {
        if (key.startsWith("VITE_")) continue;
        if (process.env[key] === undefined) process.env[key] = value;
      }

      const loadHandler = async () => {
        const mod = await server.ssrLoadModule("/api/chat.js");
        return mod.default ?? mod;
      };

      server.middlewares.use("/api/chat", async (req, res, next) => {
        if (req.method !== "POST") return next();

        // Collect and parse the JSON body; the handler expects req.body to be
        // an already-parsed object, which is what Vercel provides in production.
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const rawBody = Buffer.concat(chunks).toString("utf8");

        try {
          (req as IncomingMessage & { body?: unknown }).body = rawBody
            ? JSON.parse(rawBody)
            : {};
        } catch {
          (req as IncomingMessage & { body?: unknown }).body = {};
        }

        try {
          const handler = await loadHandler();
          await handler(req, res as ServerResponse);
        } catch (err) {
          console.error("[api/chat] handler threw:", err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String((err as Error)?.message || err) }));
        }
      });
    },
  };
}