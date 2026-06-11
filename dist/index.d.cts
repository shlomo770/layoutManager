import * as react from 'react';
import { CSSProperties, ComponentType } from 'react';

/**
 * The five classic regions of the app shell.
 *
 *  ┌──────────────────── top ───────────────────┐
 *  │ left │            center             │ right│
 *  └─────────────────── bottom ──────────────────┘
 *
 * - `top` / `bottom` lay their items out horizontally (`row`) by default.
 * - `left` / `right` lay their items out vertically (`column`) by default.
 * - `center` is the generic core application slot (map, table, video, …).
 */
type RegionId = "top" | "bottom" | "left" | "right" | "center";
/** Item flow direction inside a region. */
type RegionFlow = "row" | "column";
/** Flexbox alignment tokens exposed to config authors. */
type RegionAlign = "start" | "center" | "end" | "stretch" | "space-between" | "space-around";
/**
 * Declarative configuration for one region. A region hosts exactly one
 * component (resolved from the registry by its string key) — this keeps the
 * static shell lean and predictable.
 */
interface RegionConfig<TProps extends Record<string, unknown> = Record<string, unknown>> {
    /**
     * The registry key of the component to mount in this region.
     * `center` is generic and renders whatever component you point it at.
     */
    component: string;
    /**
     * Track size fed straight into the CSS Grid template.
     * For `left`/`right` this is the column width (e.g. `"400px"`, `"22vw"`).
     * For `top`/`bottom` it is the row height. Ignored for `center` (elastic).
     * Omit to size the track to its content.
     */
    size?: string;
    /** Props forwarded to the resolved component. */
    props?: TProps;
    /** Override the region's default item flow direction. */
    direction?: RegionFlow;
    /** Cross-axis alignment of the slot. */
    align?: RegionAlign;
    /** Main-axis alignment of the slot. */
    justify?: RegionAlign;
    /** Inner padding override (defaults to the global `--c2-panel-padding`). */
    padding?: string;
    /**
     * Corner rounding for this region's box, e.g. `"16px"` or `"0"`. Useful for
     * the otherwise-square `center` slot in split mode (the region clips its
     * content to the radius). Defaults to the theme `--c2-panel-radius` for
     * chrome regions and to square for bare regions.
     */
    radius?: string;
    /** Render the frosted-glass panel chrome. Defaults to `true` for the four
     *  edge regions and `false` for `center` (so the core slot stays clean). */
    chrome?: boolean;
    /** Extra class hook on the region element. */
    className?: string;
    /** Inline style escape hatch on the region element. */
    style?: CSSProperties;
}
/** Map of region id → its configuration. Any region may be omitted. */
type RegionMap = Partial<Record<RegionId, RegionConfig>>;
/**
 * Design-system tokens. Each maps to a `--c2-*` CSS custom property and may be
 * overridden via the `theme` block. Anything omitted falls back to the
 * built-in tactical defaults.
 */
interface ThemeTokens {
    /** Primary neon accent. → `--c2-accent` */
    accent: string;
    /** Soft accent used for borders/glow. → `--c2-accent-soft` */
    accentSoft: string;
    /** Canvas gap between the grid tracks. → `--c2-gap` */
    gap: string;
    /** Default inner padding for panels. → `--c2-panel-padding` */
    panelPadding: string;
    /** Glass panel background. → `--c2-panel-bg` */
    panelBg: string;
    /** Backdrop blur radius. → `--c2-panel-blur` */
    panelBlur: string;
    /** Panel border shorthand. → `--c2-panel-border` */
    panelBorder: string;
    /** Panel corner radius. → `--c2-panel-radius` */
    panelRadius: string;
    /** Panel drop shadow. → `--c2-panel-shadow` */
    panelShadow: string;
    /** App canvas background (behind everything). → `--c2-canvas-bg` */
    canvasBg: string;
    /** Primary text color. → `--c2-text` */
    text: string;
    /** Muted text color. → `--c2-text-dim` */
    textDim: string;
    /** Monospace font stack. → `--c2-font-mono` */
    fontMono: string;
    /** Sans font stack. → `--c2-font-sans` */
    fontSans: string;
}
/**
 * Global layout strategy for the shell.
 *
 * - `"split"` (default) — a classic dashboard: every region occupies its own
 *   CSS-Grid track and the `center` slot takes the remaining space. Panels
 *   push the content; nothing overlaps.
 * - `"fullscreen"` — a map / C2 layout: the `center` slot fills the entire
 *   viewport edge-to-edge (ideal for a GIS/3D map base layer) and the edge
 *   regions float above it as glass overlays, sized by their `size` tracks.
 */
type DisplayMode = "split" | "fullscreen";
/**
 * The strict, static layout contract. Read once at boot to scaffold the shell.
 * There is no `activeMode`, no transitions, and no runtime mutation surface —
 * this object fully describes the layout.
 */
interface C2LayoutConfig {
    /** Optional identifier (telemetry / persistence). */
    id?: string;
    /**
     * Global layout strategy. `"split"` tiles regions into grid tracks (classic
     * dashboard); `"fullscreen"` makes `center` a full-bleed base layer with the
     * edge regions floating above it. Defaults to `"split"`.
     */
    displayMode?: DisplayMode;
    /** The region allocation. */
    regions: RegionMap;
    /** Theme token overrides applied to the shell root. */
    theme?: Partial<ThemeTokens>;
    /** Class hook applied to the shell root. */
    className?: string;
}
/** Props the shell injects into every resolved component instance. */
interface RegionInjectedProps {
    /** The region this component is mounted in — its contextual awareness. */
    currentRegion: RegionId;
    /** The region's flow direction (`row` | `column`). */
    regionDirection: RegionFlow;
}
/**
 * A component eligible for registration. Injected props are optional so plain
 * presentational components work without ceremony.
 */
type C2Component<TProps extends Record<string, unknown> = Record<string, unknown>> = ComponentType<TProps & Partial<RegionInjectedProps>>;
/** Map of registry key → component. */
type ComponentMap = Record<string, C2Component<any>>;

interface C2AppShellProps {
    /** The static layout contract, read once to scaffold the shell. */
    config: C2LayoutConfig;
    /** Registry resolving each region's `component` key to a React component. */
    registry: ComponentMap;
    /** Extra class hook on the shell root. */
    className?: string;
    /** Inline style escape hatch on the shell root. */
    style?: CSSProperties;
}
/**
 * **C2AppShell** — a static, zero-runtime 5-region layout scaffold.
 *
 * Builds a unified `100vw × 100vh` CSS-Grid shell with `top`, `bottom`,
 * `left`, `right` and a generic `center` slot. Track sizes are read directly
 * from `config.regions[*].size`; omitted side regions collapse to `0px` so the
 * `center` slot claims the remaining space.
 *
 * The component is intentionally lean: it computes the grid template and theme
 * variables inline during the single boot render — there is no internal state,
 * no effects, and no event listeners, because the layout is initialized once
 * and never mutates on the fly.
 */
declare function C2AppShell({ config, registry, className, style }: C2AppShellProps): react.JSX.Element;

interface RegionSlotProps {
    region: RegionId;
    config: RegionConfig;
    registry: ComponentMap;
}
/**
 * Renders one region of the shell:
 *  1. tags the region for its 3×3 grid placement + flow via CSS classes
 *     (placement lives in CSS so display-mode overrides can take over),
 *  2. applies optional frosted-glass chrome,
 *  3. wraps the component in a `container-type: inline-size` slot so it can
 *     self-adjust via `@container` queries based on its region's width,
 *  4. resolves the single component from the registry and injects the static
 *     `currentRegion` (+ `regionDirection`) awareness props.
 *
 * Pure render — no state, no effects, no listeners. Inline styles carry only
 * config-driven cosmetics (align/justify/padding/style); structural placement
 * and flow are class-based so they never out-specify the stylesheet.
 */
declare function RegionSlot({ region, config, registry }: RegionSlotProps): react.JSX.Element | null;

/**
 * Default item-flow direction per region. `top`/`bottom` run horizontally;
 * `left`/`right` (and `center`) run vertically. A config `direction` wins.
 */
declare const DEFAULT_DIRECTION: Record<RegionId, RegionFlow>;
/** Regions that get glass chrome by default (`center` stays bare). */
declare const DEFAULT_CHROME: Record<RegionId, boolean>;
declare function regionPlacement(region: RegionId): CSSProperties;
declare function resolveDirection(region: RegionId, override?: RegionFlow): RegionFlow;
/**
 * Derive the grid track templates straight from the config sizes.
 *
 * A side region that is **omitted** resolves to `0px`, so its track collapses
 * natively and `center` (the `1fr` track) reclaims the space. A region that is
 * present but has no `size` sizes to its content (`auto`).
 */
declare function computeGridTemplate(regions: RegionMap): {
    gridTemplateColumns: string;
    gridTemplateRows: string;
};
/** Map friendly alignment tokens onto valid CSS flex values. */
declare function toFlexValue(value?: string): string | undefined;
/** Build the inline CSS-variable block from a partial theme. */
declare function buildThemeVars(theme?: Record<string, string | undefined>): CSSProperties;

/** Identity helper for authoring a strongly-typed, autocompleted config. */
declare function defineLayoutConfig<const T extends C2LayoutConfig>(config: T): T;

export { C2AppShell, type C2AppShellProps, type C2Component, type C2LayoutConfig, type ComponentMap, DEFAULT_CHROME, DEFAULT_DIRECTION, type DisplayMode, type RegionAlign, type RegionConfig, type RegionFlow, type RegionId, type RegionInjectedProps, type RegionMap, RegionSlot, type RegionSlotProps, type ThemeTokens, buildThemeVars, computeGridTemplate, defineLayoutConfig, regionPlacement, resolveDirection, toFlexValue };
