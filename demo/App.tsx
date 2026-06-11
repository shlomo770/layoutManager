import { C2AppShell, defineLayoutConfig, type ComponentMap } from "@c2/layout-engine";
import "@c2/layout-engine/styles.css";
import { MapCanvas } from "./MapCanvas";
import {
  TopNavbar,
  ThreatTree,
  MainIncidentTable,
  IncidentDetails,
  SystemStatusTicker,
} from "./components";

/** The component registry: maps the manifest `component` keys to React
 *  components. In fullscreen mode the `center` hosts a full-bleed map base
 *  layer and the edge panels float above it. */
const registry: ComponentMap = {
  TopNavbar,
  ThreatTree,
  MainIncidentTable,
  IncidentDetails,
  SystemStatusTicker,
  MapView: MapCanvas,
};

/**
 * A single static manifest fully describes the SOC dashboard. Track sizes drive
 * the grid; omit `left` or `right` and that track collapses to 0px so the
 * center claims the space. There is no mode switching and no runtime mutation.
 */
export const socLightConfig = defineLayoutConfig({
  displayMode: "split",
  theme: {
    // Light-mode palette
    accent: "#0066cc",
    canvasBg: "#e9eef5",
    text: "#ffffff",
    textDim: "#64748b",
    panelBg: "rgba(39, 37, 77, 0.88)",
    panelBlur: "16px",
    panelBorder: "1px solid rgba(0, 0, 0, 0.08)",
    panelShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",

    // Status colors (consumed by the demo components via var(--c2-status-*))
    statusNominal: "#0d9488",
    statusWarning: "#d97706",
    statusCritical: "#e11d48",

    gap: "12px",
    panelPadding: "16px",
  },
  regions: {
    top: { size: "64px", component: "TopNavbar" },
    left: { size: "260px", component: "ThreatTree" },
    center: { component: "MapView" , radius: "16px" }, // full-bleed base layer in fullscreen mode
    right: { size: "380px", component: "IncidentDetails" },
    bottom: { size: "44px", component: "SystemStatusTicker" },
  },
});

export function App() {
  return <C2AppShell config={socLightConfig} registry={registry} />;
}
