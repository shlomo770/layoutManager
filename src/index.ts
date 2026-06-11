/* =============================================================================
 * @c2/layout-engine — Static 5-Region App Shell
 * A lean, zero-runtime layout scaffold driven by a single static manifest.
 * The grid template and theme variables are computed inline during one boot
 * render; there is no state, no effects, and no runtime listeners.
 * ========================================================================== */

import type { C2LayoutConfig } from "./types";

// --- Core component ---
export { C2AppShell } from "./AppShell";
export type { C2AppShellProps } from "./AppShell";

export { RegionSlot } from "./RegionSlot";
export type { RegionSlotProps } from "./RegionSlot";

// --- Low-level utilities (advanced / custom scaffolds) ---
export {
  computeGridTemplate,
  regionPlacement,
  resolveDirection,
  buildThemeVars,
  toFlexValue,
  DEFAULT_DIRECTION,
  DEFAULT_CHROME,
} from "./grid";

// --- Types: the static layout contract ---
export type {
  C2LayoutConfig,
  DisplayMode,
  RegionId,
  RegionConfig,
  RegionMap,
  RegionFlow,
  RegionAlign,
  ThemeTokens,
  RegionInjectedProps,
  C2Component,
  ComponentMap,
} from "./types";

/** Identity helper for authoring a strongly-typed, autocompleted config. */
export function defineLayoutConfig<const T extends C2LayoutConfig>(config: T): T {
  return config;
}
