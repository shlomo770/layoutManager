'use strict';

var jsxRuntime = require('react/jsx-runtime');

// src/grid.ts
var DEFAULT_DIRECTION = {
  top: "row",
  bottom: "row",
  left: "column",
  right: "column",
  center: "column"
};
var DEFAULT_CHROME = {
  top: true,
  bottom: true,
  left: true,
  right: true,
  center: false
};
var PLACEMENT = {
  top: { gridColumn: "1 / 4", gridRow: "1 / 2" },
  left: { gridColumn: "1 / 2", gridRow: "2 / 3" },
  center: { gridColumn: "2 / 3", gridRow: "2 / 3" },
  right: { gridColumn: "3 / 4", gridRow: "2 / 3" },
  bottom: { gridColumn: "1 / 4", gridRow: "3 / 4" }
};
function regionPlacement(region) {
  return PLACEMENT[region];
}
function resolveDirection(region, override) {
  return override ?? DEFAULT_DIRECTION[region];
}
function computeGridTemplate(regions) {
  const track = (id) => {
    const region = regions[id];
    if (!region) return "0px";
    return region.size?.trim() || "auto";
  };
  return {
    gridTemplateColumns: `${track("left")} minmax(0, 1fr) ${track("right")}`,
    gridTemplateRows: `${track("top")} minmax(0, 1fr) ${track("bottom")}`
  };
}
function toFlexValue(value) {
  if (!value) return void 0;
  if (value === "start") return "flex-start";
  if (value === "end") return "flex-end";
  return value;
}
function toCssVar(token) {
  return `--c2-${token.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
}
function buildThemeVars(theme) {
  const vars = {};
  if (theme) {
    for (const [key, value] of Object.entries(theme)) {
      if (value != null) vars[toCssVar(key)] = String(value);
    }
  }
  return vars;
}
function RegionSlot({ region, config, registry }) {
  const direction = resolveDirection(region, config.direction);
  const chrome = config.chrome ?? DEFAULT_CHROME[region];
  const Component = registry[config.component];
  if (!Component) {
    if (typeof console !== "undefined") {
      console.warn(
        `[c2-layout-engine] No component registered for "${config.component}" (region "${region}"). Available: ${Object.keys(registry).join(", ") || "(none)"}.`
      );
    }
    return null;
  }
  const regionStyle = {
    alignItems: toFlexValue(config.align),
    justifyContent: toFlexValue(config.justify),
    padding: config.padding,
    borderRadius: config.radius,
    ...config.style
  };
  const regionClassName = [
    "c2-region",
    `c2-region--${region}`,
    `c2-region--${direction}`,
    chrome ? "c2-region--chrome" : "c2-region--bare",
    config.className
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxRuntime.jsx("section", { className: regionClassName, style: regionStyle, "data-region": region, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "c2-slot", "data-region": region, children: /* @__PURE__ */ jsxRuntime.jsx(
    Component,
    {
      ...config.props ?? {},
      currentRegion: region,
      regionDirection: direction
    }
  ) }) });
}
var REGION_ORDER = ["top", "left", "center", "right", "bottom"];
function C2AppShell({ config, registry, className, style }) {
  const { regions } = config;
  const displayMode = config.displayMode ?? "split";
  const template = computeGridTemplate(regions);
  const themeVars = buildThemeVars(config.theme);
  const rootClassName = [
    "c2-appshell",
    `c2-variant-${displayMode}`,
    config.className,
    className
  ].filter(Boolean).join(" ");
  const rootStyle = {
    ...themeVars,
    gridTemplateColumns: template.gridTemplateColumns,
    gridTemplateRows: template.gridTemplateRows,
    ...style
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: rootClassName, style: rootStyle, "data-display-mode": displayMode, children: REGION_ORDER.map((region) => {
    const regionConfig = regions[region];
    if (!regionConfig) return null;
    return /* @__PURE__ */ jsxRuntime.jsx(
      RegionSlot,
      {
        region,
        config: regionConfig,
        registry
      },
      region
    );
  }) });
}

// src/index.ts
function defineLayoutConfig(config) {
  return config;
}

exports.C2AppShell = C2AppShell;
exports.DEFAULT_CHROME = DEFAULT_CHROME;
exports.DEFAULT_DIRECTION = DEFAULT_DIRECTION;
exports.RegionSlot = RegionSlot;
exports.buildThemeVars = buildThemeVars;
exports.computeGridTemplate = computeGridTemplate;
exports.defineLayoutConfig = defineLayoutConfig;
exports.regionPlacement = regionPlacement;
exports.resolveDirection = resolveDirection;
exports.toFlexValue = toFlexValue;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map