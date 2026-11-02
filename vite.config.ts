// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // The default nitro target is Cloudflare, whose bundle cannot run under plain Node.
  // Every deployment path here runs the site with `node .output/server/index.mjs`,
  // so build for the node-server preset.
  nitro: { preset: "node-server" },
  vite: {
    server: {
      // Allow public dev tunnels (cloudflared / ngrok) to reach the dev server.
      allowedHosts: [".trycloudflare.com", ".ngrok-free.app", ".ngrok.app", "localhost"],
    },
  },
});
