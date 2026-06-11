# @c2/layout-engine

A lean, **enterprise-grade, metadata-driven** static 5-region app shell for command-and-control style dashboards. Scaffold a full viewport layout from a single configuration object (a **manifest**) read once at boot — no modes, no transitions, no runtime state, **zero runtime dependencies**.

- **5 classic regions** — `top` (header/status), `bottom` (footer/alerts), `left` (sidebar/nav), `right` (control panel), and `center` (the generic core slot: map, table, video, dashboard, …).
- **Static CSS-Grid shell** — a single `100vw × 100vh` grid. Track sizes come straight from the manifest.
- **Native track collapse** — omit `left` or `right` and its grid track resolves to `0px`, so `center` (the `1fr` track) automatically claims the space.
- **Default flows** — `top`/`bottom` lay out `row`, `left`/`right`/`center` lay out `column` (each overridable).
- **Self-aware components** — every region's component is wrapped in a `container-type: inline-size` slot (`container-name: c2-region`) and receives a static `currentRegion` (+ `regionDirection`) prop, so it can self-adjust via `@container` queries.
- **Tactical glassmorphism design system** — overridable `--c2-*` tokens out of the box.
- **Zero runtime overhead** — the grid template and theme variables are computed inline during one boot render. No `useState`, no `useEffect`, no listeners.

---

## Install

```bash
npm install @c2/layout-engine react react-dom
```

```ts
import { C2AppShell } from "@c2/layout-engine";
import "@c2/layout-engine/styles.css";
```

> React 18+ is a peer dependency.

---

## Offline / Secure Environment Installation (Air-Gapped)

This package is **fully self-contained**: it has **zero runtime dependencies**, and everything except React is inlined into `dist/` at build time. It installs on machines with **no internet access** without triggering a single external registry fetch.

**1. On an online build machine**, produce a single deployable archive:

```bash
npm run build:pack
# ↳ runs `npm run build` then `npm pack`
# ↳ emits: c2-layout-engine-1.0.0.tgz   (alias: npm run package:local)
```

**2. Transfer** the `c2-layout-engine-1.0.0.tgz` file to the air-gapped machine (USB, internal artifact store, etc.).

**3. On the offline machine**, install it from the local file:

```bash
npm install ./c2-layout-engine-1.0.0.tgz
```

npm copies the prebuilt `dist/` straight in — no compilation, no post-install scripts, no network. React/React-DOM resolve from the host project's existing `node_modules` (they're peer dependencies).

> **Guarantees:** `dependencies` is empty; `react` / `react-dom` are `peerDependencies`; the bundler marks React as the *only* external and force-inlines everything else. The shipped tarball contains only `dist/`, `package.json`, and `README.md`.

---

## Quick start

```tsx
import { C2AppShell, defineLayoutConfig, type ComponentMap } from "@c2/layout-engine";
import "@c2/layout-engine/styles.css";

import { StatusHeader, NavRail, ControlPanel, AlertTicker, MapView } from "./widgets";

const registry: ComponentMap = {
  StatusHeader, NavRail, ControlPanel, AlertTicker,
  MapView, // the generic center component
};

const config = defineLayoutConfig({
  theme: { accent: "#00f2fe", gap: "16px", panelPadding: "16px" },
  regions: {
    top:    { size: "64px",  component: "StatusHeader" },
    left:   { size: "220px", component: "NavRail" },
    center: {                component: "MapView" },     // generic core slot
    right:  { size: "320px", component: "ControlPanel" },
    bottom: { size: "56px",  component: "AlertTicker" },
    // Omit `left`/`right` entirely → that track collapses to 0px.
  },
});

export const App = () => <C2AppShell config={config} registry={registry} />;
```

---

## The `C2LayoutConfig` contract

A single, serializable object fully describes the layout.

```ts
interface C2LayoutConfig {
  id?: string;
  displayMode?: "split" | "fullscreen";            // defaults to "split"
  regions: Partial<Record<RegionId, RegionConfig>>; // top | bottom | left | right | center
  theme?: Partial<ThemeTokens>;
  className?: string;
}

interface RegionConfig {
  component: string;      // registry key (the `center` slot is fully generic)
  size?: string;          // left/right → column width; top/bottom → row height
  props?: Record<string, unknown>;
  direction?: "row" | "column";   // override the default flow
  align?: RegionAlign;
  justify?: RegionAlign;
  padding?: string;
  radius?: string;        // corner rounding for this region, e.g. "16px" | "0"
  chrome?: boolean;       // glass panel chrome (default: true for edges, false for center)
  className?: string;
  style?: CSSProperties;
}
```

| Region   | Grid placement       | Default flow | Default chrome |
| -------- | -------------------- | ------------ | -------------- |
| `top`    | full width, row 1    | `row`        | yes            |
| `bottom` | full width, row 3    | `row`        | yes            |
| `left`   | column 1, middle row | `column`     | yes            |
| `right`  | column 3, middle row | `column`     | yes            |
| `center` | center cell          | `column`     | no (frameless) |

`size` is read straight into the grid template. An **omitted** side region collapses to `0px`; a region present without `size` sizes to its content (`auto`).

### Corner rounding

Rounding is fully config-driven (no hard-coded values):

- **All panels** — set the theme token `panelRadius` (`theme: { panelRadius: "0" }` for square, `"14px"` for rounded).
- **A single region** — set `radius` on that region. This is the way to round the otherwise-square `center` slot in split mode:

```tsx
regions: {
  center: { component: "DataTable", radius: "16px" }, // round just the center
  right:  { size: "320px", component: "Panel", radius: "0" }, // square just this panel
}
```

The region clips its content to the radius (`overflow: hidden`), so maps/tables/videos round cleanly.

### Display modes

`displayMode` switches the global layout strategy:

| Mode                 | Behavior                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| `"split"` *(default)* | Classic dashboard — every region occupies its own grid track; `center` takes the remaining space.          |
| `"fullscreen"`        | Map / C2 layout — `center` fills the entire viewport edge-to-edge (base layer) and the edge regions float above it as glass overlays, sized by their `size` tracks. |

```tsx
const config = defineLayoutConfig({
  displayMode: "fullscreen",      // map base + floating panels
  regions: {
    center: { component: "MapView" },       // full-bleed beneath the overlays
    left:   { size: "300px", component: "Tracks" },
    right:  { size: "360px", component: "Details" },
  },
});
```

How `fullscreen` works (pure CSS layering, zero runtime state):

- **Identical tracks** — the grid template is the same in both modes, so panels keep their exact split-mode size and position; nothing stretches or reflows.
- **Center = full bleed** — the `center` slot spans every row/column and breaks out of the grid padding to reach the screen edges (square corners, since it's edge-to-edge).
- **Floating glass panels** — the edge regions stay in their tracks and layer on top (`z-index`), with their card visuals driven entirely by your theme tokens (`panelBg`, `panelBlur`, `panelBorder`, …) — no hard-coded colors.
- **Pointer pass-through** — clicks/drag/zoom on empty space go straight to the map; only the panel cards (and their widgets) capture input.

---

## Self-aware components & container queries

Every registered component receives injected props and is wrapped in a containment context:

```tsx
import type { RegionInjectedProps } from "@c2/layout-engine";

function ControlPanel({ currentRegion, regionDirection }: Partial<RegionInjectedProps>) {
  // branch on the region you're mounted in
  return <div className="c2-fluid-list">{/* … */}</div>;
}
```

| Prop              | Description                                |
| ----------------- | ------------------------------------------ |
| `currentRegion`   | the region this component is mounted in    |
| `regionDirection` | the region's flow (`row` \| `column`)      |

Each slot exposes `container-name: c2-region`, so components self-adjust to their region width with **no JS**:

```css
@container c2-region (min-width: 480px) { /* wide region → row layout */ }
@container c2-region (max-width: 479px) { /* narrow region → stacked layout */ }
```

Provided utilities: `.c2-fluid` (column → row flip), `.c2-fluid-list` (density), `.c2-hide-narrow`.

---

## Theming

All visuals are `--c2-*` CSS custom properties. Override per-manifest via `theme`, or globally in your CSS.

```ts
theme: {
  accent: "#00f2fe",
  accentSoft: "rgba(0, 242, 254, 0.15)",
  gap: "16px",
  panelPadding: "16px",
  panelBg: "rgba(10, 15, 30, 0.72)",
  panelBlur: "12px",
  panelBorder: "1px solid rgba(255, 255, 255, 0.08)",
  panelRadius: "14px",
  canvasBg: "#05070f",
  text: "#e6f1ff",
  textDim: "#8aa0bd",
}
```

See `ThemeTokens` for the full list (each maps to a `--c2-*` variable).

---

## Public API

| Export               | Kind      | Description                                        |
| -------------------- | --------- | -------------------------------------------------- |
| `C2AppShell`         | component | The 5-region layout shell.                         |
| `RegionSlot`         | component | Single-region renderer (advanced use).             |
| `defineLayoutConfig` | helper    | Identity helper for typed, autocompleted configs.  |
| `computeGridTemplate`, `regionPlacement`, `resolveDirection`, `buildThemeVars`, `toFlexValue`, `DEFAULT_DIRECTION`, `DEFAULT_CHROME` | utilities | Low-level building blocks. |
| `C2LayoutConfig`, `DisplayMode`, `RegionConfig`, `RegionMap`, `RegionId`, `RegionFlow`, `RegionAlign`, `ThemeTokens`, `RegionInjectedProps`, `C2Component`, `ComponentMap` | types | The full contract. |

---

## Run the demo

```bash
npm install
npm run demo
```

A full Sentinel app-shell demo: status header, nav rail, control panel, alert ticker, and an animated map in the generic `center` slot.

## Scripts

| Script                  | Action                                              |
| ----------------------- | --------------------------------------------------- |
| `npm run build`         | Build the library (ESM + CJS + dts + styles.css)    |
| `npm run build:pack`    | Build, then `npm pack` → self-contained `.tgz`      |
| `npm run package:local` | Alias of `build:pack` (offline deployment archive)  |
| `npm run typecheck`     | Type-check everything                               |
| `npm run demo`          | Start the demo dev server                           |
| `npm run demo:build`    | Production-build the demo                           |

## License

MIT
