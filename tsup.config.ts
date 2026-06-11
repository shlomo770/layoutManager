import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Library build (fully self-contained / air-gap friendly):
 *  - Single root entry → ESM (.js) + CJS (.cjs) bundles and a rolled-up .d.ts
 *  - React / ReactDOM / the JSX runtime stay external (peer deps) so hosts
 *    dedupe a single copy — they are the ONLY externals.
 *  - EVERYTHING else (any third-party runtime utility) is inlined into dist/,
 *    so the published package has zero runtime dependencies and installs on
 *    offline machines without any external registry fetches. `noExternal`
 *    force-bundles every non-React import even if one is ever added later.
 *  - The unified design-system stylesheet is shipped as a single importable
 *    file (`@c2/layout-engine/styles.css`); the engine never injects styles.
 */
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  // React and its JSX runtime are the only externals (provided as peers).
  external: ["react", "react-dom", "react/jsx-runtime"],
  // Force-inline any other dependency so dist/ is 100% self-contained.
  noExternal: [/^(?!react($|-dom$|\/)).+/],
  target: "es2020",
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
  async onSuccess() {
    mkdirSync(resolve("dist"), { recursive: true });
    copyFileSync(resolve("src/styles.css"), resolve("dist/styles.css"));
  },
});
