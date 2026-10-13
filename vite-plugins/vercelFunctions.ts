import type { Plugin, ViteDevServer } from "vite";
import { loadEnv } from "vite";
import fs from "node:fs";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

type Route = {
  /** Vite module id, e.g. "/api/github-contribs/[user].js" */
  id: string;
  /** Compiled matcher, e.g. /^\/api\/github-contribs\/([^/]+)$/ */
  pattern: RegExp;
  paramNames: string[];
};

function listApiRoutes(root: string): Route[] {
  const apiDir = path.join(root, "api");
  const routes: Route[] = [];

  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".js")) continue;

      const rel = path.relative(apiDir, full).replace(/\\/g, "/");
      // Routes are rooted at /api, mirroring Vercel: api/chat.js -> /api/chat.
      const segments = ["api", ...rel.replace(/\.js$/, "").split("/")];
      const paramNames: string[] = [];
      const patternSegments = segments.map((seg) => {
        const m = seg.match(/^\[(.+?)\]$/);
        if (m) {
          paramNames.push(m[1]);
          return "([^/]+)";
        }
        return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      });

      const id = "/" + segments.join("/") + ".js";
      routes.push({
        id,
        pattern: new RegExp("^/" + patternSegments.join("/") + "/?$"),
        paramNames,
      });
    }
  };

  walk(apiDir);
  return routes;
}

/**
 * Runs the real Vercel-style serverless functions from the api/ directory
 * during `vite dev`, so local behaviour matches production.
 *
 * Why this exists:
 * Vercel only executes the api/ directory when deployed. Under `vite dev`
 * those routes do not exist, so a POST to /api/chat falls through to the SPA
 * fallback and returns index.html with a 404, which made the AI command
 * palette look broken even with a valid key.
 *
 * Route matching mirrors Vercel's own convention: api/chat.js serves
 * /api/chat, and api/github-contribs/[user].js serves
 * /api/github-contribs/<anything>. Anything after /api that does not match a
 * function is passed through untouched, so a 404 stays a 404 rather than
 * being masked.
 *
 * Dev-only: `apply: "serve"`, never included in the production bundle.
 */
export function vercelFunctions(): Plugin {
  return {
    name: "vercel-functions-dev",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      const root = server.config.root;

      // Vite exposes VITE_* vars on import.meta.env, but the handlers read
      // process.env. Copy server-only vars across. Anything VITE_* prefixed is
      // public by definition and must never reach a handler through this path.
      const env = loadEnv(server.config.mode, root, "");
      for (const [key, value] of Object.entries(env)) {
        if (key.startsWith("VITE_")) continue;
        if (process.env[key] === undefined) process.env[key] = value;
      }

      const routes = listApiRoutes(root);
      if (routes.length) {
        server.config.logger.info(
          `  ➜  api routes: ${routes.map((r) => r.id.replace(/^\//, "")).join(", ")}`
        );
      }

      const readBody = async (req: IncomingMessage) => {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const raw = Buffer.concat(chunks).toString("utf8");
        try {
          return raw ? JSON.parse(raw) : {};
        } catch {
          return {};
        }
      };

      // Mount at the root so we can decide, per request, whether this is an
      // api route or a normal SPA asset request.
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "/";
        const pathname = url.split("?")[0];
        if (!pathname.startsWith("/api/")) return next();

        const route = routes.find((r) => r.pattern.test(pathname));

        if (!route) {
          // No matching function, exactly like Vercel would behave.
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/plain");
          res.end(`No API route matches ${pathname}`);
          return;
        }

        const match = pathname.match(route.pattern)!;
        route.paramNames.forEach((name, i) => {
          // Expose dynamic segments the way Vercel does (req.query).
          (req as any).query = { ...((req as any).query || {}), [name]: match[i + 1] };
        });

        (req as IncomingMessage & { body?: unknown }).body = await readBody(req);

        try {
          const mod = await server.ssrLoadModule(route.id);
          const handler = mod.default ?? mod;
          await handler(req, res as ServerResponse);
        } catch (err) {
          console.error(`[api] handler for ${route.id} threw:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String((err as Error)?.message || err) }));
          }
        }
      });
    },
  };
}