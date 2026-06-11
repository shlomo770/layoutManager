import type { RegionInjectedProps } from "@c2/layout-engine";

type RegionProps = Partial<RegionInjectedProps>;

const badge = (label: string, color: string) => (
  <span
    key={label}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 999,
      fontFamily: "var(--c2-font-mono)",
      fontSize: 11,
      letterSpacing: "0.06em",
      color,
      background: `color-mix(in srgb, ${color} 14%, transparent)`,
      border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
    }}
  >
    <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
    {label}
  </span>
);

/** TOP — status header. Lays out as a row; uses a fluid cluster of badges. */
export function StatusHeader({ currentRegion }: RegionProps) {
  return (
    <div
      className="c2-fluid"
      style={{ alignItems: "center", justifyContent: "space-between", width: "100%" }}
    >
      <span
        style={{
          fontFamily: "var(--c2-font-mono)",
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "var(--c2-accent)",
        }}
      >
        ◢ SENTINEL · APP SHELL
      </span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {badge("LINK ONLINE", "#16d39a")}
        {badge("3 THREATS", "#ff3b5c")}
        {badge("1 DEGRADED", "#ffb020")}
        <span className="c2-hide-narrow" style={{ fontSize: 11, color: "var(--c2-text-dim)" }}>
          @{currentRegion}
        </span>
      </div>
    </div>
  );
}

/** LEFT — vertical navigation rail. */
export function NavRail({ currentRegion }: RegionProps) {
  const items = ["Overview", "Tracks", "Sensors", "Comms", "Mission", "Logs"];
  return (
    <nav className="c2-fluid-list" style={{ width: "100%" }}>
      <span
        style={{
          fontFamily: "var(--c2-font-mono)",
          fontSize: 10,
          letterSpacing: "0.18em",
          color: "var(--c2-accent)",
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        NAV · {currentRegion}
      </span>
      {items.map((item, i) => (
        <a
          key={item}
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: "block",
            padding: "10px 12px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 13,
            color: i === 0 ? "var(--c2-accent)" : "var(--c2-text-dim)",
            background: i === 0 ? "var(--c2-accent-soft)" : "transparent",
            border: "1px solid",
            borderColor: i === 0 ? "var(--c2-accent-soft)" : "transparent",
          }}
        >
          {item}
        </a>
      ))}
    </nav>
  );
}

/** RIGHT — control panel with telemetry readouts. */
export function ControlPanel({ currentRegion }: RegionProps) {
  const rows = [
    ["ALT", "32,000 ft"],
    ["SPD", "480 kts"],
    ["HDG", "045°"],
    ["FUEL", "78%"],
    ["EW", "PASSIVE"],
    ["ROE", "WEAPONS HOLD"],
  ];
  return (
    <div className="c2-fluid-list" style={{ width: "100%" }}>
      <span
        style={{
          fontFamily: "var(--c2-font-mono)",
          fontSize: 10,
          letterSpacing: "0.18em",
          color: "var(--c2-accent)",
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        CONTROL · {currentRegion}
      </span>
      {rows.map(([k, v]) => (
        <div
          key={k}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            padding: "8px 10px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            minWidth: 130,
          }}
        >
          <span style={{ fontFamily: "var(--c2-font-mono)", fontSize: 11, color: "var(--c2-text-dim)" }}>
            {k}
          </span>
          <span style={{ fontFamily: "var(--c2-font-mono)", fontSize: 12, color: "var(--c2-text)" }}>
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

/** BOTTOM — footer / alert ticker. */
export function AlertTicker({ regionDirection }: RegionProps) {
  const events = ["09:42 LAUNCH DETECTED", "09:44 TRACK CORRELATED", "09:46 CAP VECTORED"];
  return (
    <div className="c2-fluid" style={{ width: "100%", alignItems: "center" }}>
      <span
        style={{
          fontFamily: "var(--c2-font-mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
          color: "var(--c2-accent)",
        }}
      >
        ALERTS
      </span>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {events.map((e) => (
          <span key={e} style={{ fontFamily: "var(--c2-font-mono)", fontSize: 12, color: "var(--c2-text-dim)" }}>
            {e}
          </span>
        ))}
      </div>
      <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--c2-text-dim)" }}>
        flow: {regionDirection}
      </span>
    </div>
  );
}
