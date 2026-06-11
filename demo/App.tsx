import { C2AppShell, defineLayoutConfig, type ComponentMap } from "@c2/layout-engine";
import "@c2/layout-engine/styles.css";
import { MapCanvas } from "./MapCanvas";
import { StatusHeader, NavRail, ControlPanel, AlertTicker } from "./components";

/** The component registry: maps manifest `component` keys to React components.
 *  The `center` slot is generic — point it at a map, table, video, anything. */
const registry: ComponentMap = {
  StatusHeader,
  NavRail,
  ControlPanel,
  AlertTicker,
  MapView: MapCanvas,
};

/**
 * A single static manifest fully describes the dashboard. Track sizes drive the
 * grid; omit `left` or `right` and that track collapses to 0px so the center
 * map claims the space. There is no mode switching and no runtime mutation.
 */
const config = defineLayoutConfig({
  id: "sentinel-shell",
  theme: {
    accent: "#00f2fe",
    gap: "16px",
    panelPadding: "16px",
  },
  regions: {
    top: { size: "64px", component: "StatusHeader" },
    left: { size: "220px", component: "NavRail" },
    center: { component: "MapView" },
    right: { size: "320px", component: "ControlPanel" },
    bottom: { size: "56px", component: "AlertTicker" },
  },
});

export function App() {
  return <C2AppShell config={config} registry={registry} />;
}
