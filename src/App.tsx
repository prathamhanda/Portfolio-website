import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CommandPalette from "@/components/CommandPalette";
import MobileFAB from "@/components/MobileFAB";
import { preloadImages, getProjectThumbnails } from "@/lib/imagePreloader";

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
      <CommandPalette />
      <MobileFAB />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => {
  useEffect(() => {
    // Preload project thumbnail images on app initialization
    const thumbnails = getProjectThumbnails();
    preloadImages(thumbnails);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
        <Analytics />
        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
};
    

export default App;