import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

/** Demo dev server. Aliases the package name to live source for hot reload. */
export default defineConfig({
  root: resolve(__dirname),
  plugins: [react()],
  resolve: {
    alias: {
      "@c2/layout-engine/styles.css": resolve(__dirname, "../src/styles.css"),
      "@c2/layout-engine": resolve(__dirname, "../src/index.ts"),
    },
  },
  server: { port: 5180, open: true },
});
