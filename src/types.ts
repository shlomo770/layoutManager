import type { CSSProperties, ComponentType } from "react";

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
export type RegionId = "top" | "bottom" | "left" | "right" | "center";

/** Item flow direction inside a region. */
export type RegionFlow = "row" | "column";

/** Flexbox alignment tokens exposed to config authors. */
export type RegionAlign =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "space-between"
  | "space-around";

/**
 * Declarative configuration for one region. A region hosts exactly one
 * component (resolved from the registry by its string key) — this keeps the
 * static shell lean and predictable.
 */
export interface RegionConfig<TProps extends Record<string, unknown> = Record<string, unknown>> {
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
  /** Render the frosted-glass panel chrome. Defaults to `true` for the four
   *  edge regions and `false` for `center` (so the core slot stays clean). */
  chrome?: boolean;
  /** Extra class hook on the region element. */
  className?: string;
  /** Inline style escape hatch on the region element. */
  style?: CSSProperties;
}

/** Map of region id → its configuration. Any region may be omitted. */
export type RegionMap = Partial<Record<RegionId, RegionConfig>>;

/**
 * Design-system tokens. Each maps to a `--c2-*` CSS custom property and may be
 * overridden via the `theme` block. Anything omitted falls back to the
 * built-in tactical defaults.
 */
export interface ThemeTokens {
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
 * The strict, static layout contract. Read once at boot to scaffold the shell.
 * There is no `activeMode`, no transitions, and no runtime mutation surface —
 * this object fully describes the layout.
 */
export interface C2LayoutConfig {
  /** Optional identifier (telemetry / persistence). */
  id?: string;
  /** The region allocation. */
  regions: RegionMap;
  /** Theme token overrides applied to the shell root. */
  theme?: Partial<ThemeTokens>;
  /** Class hook applied to the shell root. */
  className?: string;
}

/** Props the shell injects into every resolved component instance. */
export interface RegionInjectedProps {
  /** The region this component is mounted in — its contextual awareness. */
  currentRegion: RegionId;
  /** The region's flow direction (`row` | `column`). */
  regionDirection: RegionFlow;
}

/**
 * A component eligible for registration. Injected props are optional so plain
 * presentational components work without ceremony.
 */
export type C2Component<TProps extends Record<string, unknown> = Record<string, unknown>> =
  ComponentType<TProps & Partial<RegionInjectedProps>>;

/** Map of registry key → component. */
export type ComponentMap = Record<string, C2Component<any>>;
