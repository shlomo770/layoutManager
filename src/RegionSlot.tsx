import type { CSSProperties } from "react";
import type { ComponentMap, RegionConfig, RegionId } from "./types";
import { DEFAULT_CHROME, resolveDirection, toFlexValue } from "./grid";

export interface RegionSlotProps {
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
export function RegionSlot({ region, config, registry }: RegionSlotProps) {
  const direction = resolveDirection(region, config.direction);
  const chrome = config.chrome ?? DEFAULT_CHROME[region];

  const Component = registry[config.component];
  if (!Component) {
    if (typeof console !== "undefined") {
      console.warn(
        `[c2-layout-engine] No component registered for "${config.component}" ` +
          `(region "${region}"). Available: ${Object.keys(registry).join(", ") || "(none)"}.`,
      );
    }
    return null;
  }

  const regionStyle: CSSProperties = {
    alignItems: toFlexValue(config.align),
    justifyContent: toFlexValue(config.justify),
    padding: config.padding,
    borderRadius: config.radius,
    ...config.style,
  };

  const regionClassName = [
    "c2-region",
    `c2-region--${region}`,
    `c2-region--${direction}`,
    chrome ? "c2-region--chrome" : "c2-region--bare",
    config.className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={regionClassName} style={regionStyle} data-region={region}>
      <div className="c2-slot" data-region={region}>
        <Component
          {...(config.props ?? {})}
          currentRegion={region}
          regionDirection={direction}
        />
      </div>
    </section>
  );
}
