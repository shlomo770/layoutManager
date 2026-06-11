import type { CSSProperties } from "react";
import type { RegionFlow, RegionId, RegionMap } from "./types";

/**
 * Default item-flow direction per region. `top`/`bottom` run horizontally;
 * `left`/`right` (and `center`) run vertically. A config `direction` wins.
 */
export const DEFAULT_DIRECTION: Record<RegionId, RegionFlow> = {
  top: "row",
  bottom: "row",
  left: "column",
  right: "column",
  center: "column",
};

/** Regions that get glass chrome by default (`center` stays bare). */
export const DEFAULT_CHROME: Record<RegionId, boolean> = {
  top: true,
  bottom: true,
  left: true,
  right: true,
  center: false,
};

/**
 * Fixed placement inside the 3×3 grid:
 *   rows    → [ top | center | bottom ]
 *   columns → [ left | center | right ]
 * `top`/`bottom` span the full width; `left`/`right`/`center` occupy the
 * elastic middle row.
 */
const PLACEMENT: Record<RegionId, Pick<CSSProperties, "gridColumn" | "gridRow">> = {
  top: { gridColumn: "1 / 4", gridRow: "1 / 2" },
  left: { gridColumn: "1 / 2", gridRow: "2 / 3" },
  center: { gridColumn: "2 / 3", gridRow: "2 / 3" },
  right: { gridColumn: "3 / 4", gridRow: "2 / 3" },
  bottom: { gridColumn: "1 / 4", gridRow: "3 / 4" },
};

export function regionPlacement(region: RegionId): CSSProperties {
  return PLACEMENT[region];
}

export function resolveDirection(region: RegionId, override?: RegionFlow): RegionFlow {
  return override ?? DEFAULT_DIRECTION[region];
}

/**
 * Derive the grid track templates straight from the config sizes.
 *
 * A side region that is **omitted** resolves to `0px`, so its track collapses
 * natively and `center` (the `1fr` track) reclaims the space. A region that is
 * present but has no `size` sizes to its content (`auto`).
 */
export function computeGridTemplate(regions: RegionMap): {
  gridTemplateColumns: string;
  gridTemplateRows: string;
} {
  const track = (id: RegionId): string => {
    const region = regions[id];
    if (!region) return "0px"; // omitted → collapse natively
    return region.size?.trim() || "auto";
  };
  return {
    gridTemplateColumns: `${track("left")} minmax(0, 1fr) ${track("right")}`,
    gridTemplateRows: `${track("top")} minmax(0, 1fr) ${track("bottom")}`,
  };
}

/** Map friendly alignment tokens onto valid CSS flex values. */
export function toFlexValue(value?: string): string | undefined {
  if (!value) return undefined;
  if (value === "start") return "flex-start";
  if (value === "end") return "flex-end";
  return value;
}

/** camelCase → kebab-case CSS custom property in the `--c2-` namespace. */
function toCssVar(token: string): string {
  return `--c2-${token.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
}

/** Build the inline CSS-variable block from a partial theme. */
export function buildThemeVars(theme?: Record<string, string | undefined>): CSSProperties {
  const vars: Record<string, string> = {};
  if (theme) {
    for (const [key, value] of Object.entries(theme)) {
      if (value != null) vars[toCssVar(key)] = String(value);
    }
  }
  return vars as CSSProperties;
}
