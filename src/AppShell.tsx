import type { CSSProperties } from "react";
import type { C2LayoutConfig, ComponentMap, RegionId } from "./types";
import { buildThemeVars, computeGridTemplate } from "./grid";
import { RegionSlot } from "./RegionSlot";

/** Deterministic render order (visual placement is fixed in CSS). */
const REGION_ORDER: RegionId[] = ["top", "left", "center", "right", "bottom"];

export interface C2AppShellProps {
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
export function C2AppShell({ config, registry, className, style }: C2AppShellProps) {
  const { regions } = config;
  const template = computeGridTemplate(regions);
  const themeVars = buildThemeVars(config.theme);

  const rootClassName = ["c2-appshell", config.className, className]
    .filter(Boolean)
    .join(" ");

  const rootStyle: CSSProperties = {
    ...themeVars,
    gridTemplateColumns: template.gridTemplateColumns,
    gridTemplateRows: template.gridTemplateRows,
    ...style,
  };

  return (
    <div className={rootClassName} style={rootStyle}>
      {REGION_ORDER.map((region) => {
        const regionConfig = regions[region];
        if (!regionConfig) return null;
        return (
          <RegionSlot
            key={region}
            region={region}
            config={regionConfig}
            registry={registry}
          />
        );
      })}
    </div>
  );
}
