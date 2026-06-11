import type { CSSProperties } from "react";
import type { RegionInjectedProps } from "@c2/layout-engine";

type RegionProps = Partial<RegionInjectedProps>;

const STATUS_COLOR = {
  critical: "var(--c2-status-critical, #e11d48)",
  warning: "var(--c2-status-warning, #d97706)",
  nominal: "var(--c2-status-nominal, #0d9488)",
} as const;

type Severity = keyof typeof STATUS_COLOR;

function Pill({ label, severity }: { label: string; severity: Severity }) {
  const color = STATUS_COLOR[severity];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        fontFamily: "var(--c2-font-mono)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 40%, transparent)`,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

const eyebrow: CSSProperties = {
  fontFamily: "var(--c2-font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--c2-accent)",
  opacity: 0.9,
};

/** TOP — SOC navigation bar: brand, global posture pills, live clock. */
export function TopNavbar({ currentRegion }: RegionProps) {
  return (
    <div
      className="c2-fluid"
      style={{ alignItems: "center", justifyContent: "space-between", width: "100%" }}
    >
      <span
        style={{
          fontFamily: "var(--c2-font-mono)",
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: "var(--c2-accent)",
        }}
      >
        ◢ SOC · INCIDENT CONSOLE
      </span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Pill label="2 CRITICAL" severity="critical" />
        <Pill label="5 WARNING" severity="warning" />
        <Pill label="SIEM ONLINE" severity="nominal" />
        <span className="c2-hide-narrow" style={{ fontFamily: "var(--c2-font-mono)", fontSize: 12, color: "var(--c2-text-dim)" }}>
          09:42:17Z · {currentRegion}
        </span>
      </div>
    </div>
  );
}

const THREAT_GROUPS: { group: string; items: { name: string; count: number; severity: Severity }[] }[] = [
  {
    group: "Network",
    items: [
      { name: "Port Scan", count: 14, severity: "warning" },
      { name: "C2 Beacon", count: 2, severity: "critical" },
    ],
  },
  {
    group: "Endpoint",
    items: [
      { name: "Malware", count: 3, severity: "critical" },
      { name: "Persistence", count: 1, severity: "warning" },
    ],
  },
  {
    group: "Identity",
    items: [
      { name: "Brute Force", count: 6, severity: "warning" },
      { name: "Impossible Travel", count: 0, severity: "nominal" },
    ],
  },
];

/** LEFT — threat taxonomy tree grouped by domain. */
export function ThreatTree({ currentRegion }: RegionProps) {
  return (
    <div className="c2-fluid-list" style={{ width: "100%" }}>
      <span style={eyebrow}>Threat Tree · {currentRegion}</span>
      {THREAT_GROUPS.map((g) => (
        <div key={g.group} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--c2-text)", opacity: 0.7 }}>
            {g.group}
          </span>
          {g.items.map((it) => (
            <div
              key={it.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "7px 10px",
                borderRadius: 8,
                background: "color-mix(in srgb, var(--c2-text) 4%, transparent)",
                border: "1px solid color-mix(in srgb, var(--c2-text) 8%, transparent)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--c2-text)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLOR[it.severity] }} />
                {it.name}
              </span>
              <span style={{ fontFamily: "var(--c2-font-mono)", fontSize: 12, color: "var(--c2-text-dim)" }}>
                {it.count}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const INCIDENTS: { id: string; title: string; asset: string; severity: Severity; age: string }[] = [
  { id: "INC-4471", title: "Cobalt Strike beacon detected", asset: "WIN-DC-01", severity: "critical", age: "2m" },
  { id: "INC-4470", title: "Ransomware file canary tripped", asset: "FS-PROD-09", severity: "critical", age: "11m" },
  { id: "INC-4468", title: "Brute-force on VPN gateway", asset: "VPN-EDGE-2", severity: "warning", age: "26m" },
  { id: "INC-4465", title: "Suspicious PowerShell spawn", asset: "HR-LT-218", severity: "warning", age: "41m" },
  { id: "INC-4462", title: "Outbound to known TOR exit", asset: "MKT-LT-77", severity: "warning", age: "1h" },
  { id: "INC-4459", title: "Login from new geography", asset: "okta:j.doe", severity: "nominal", age: "2h" },
];

/** CENTER — the primary incident queue table (the generic core slot). */
export function MainIncidentTable({ currentRegion }: RegionProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--c2-panel-radius)",
        border: "var(--c2-panel-border)",
        background: "var(--c2-panel-bg)",
        backdropFilter: "blur(var(--c2-panel-blur))",
        WebkitBackdropFilter: "blur(var(--c2-panel-blur))",
        boxShadow: "var(--c2-panel-shadow)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid color-mix(in srgb, var(--c2-text) 10%, transparent)" }}>
        <span style={eyebrow}>Active Incidents · {currentRegion}</span>
        <span style={{ fontFamily: "var(--c2-font-mono)", fontSize: 12, color: "var(--c2-text-dim)" }}>
          {INCIDENTS.length} open
        </span>
      </div>
      <div style={{ overflow: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--c2-text-dim)", fontFamily: "var(--c2-font-mono)", fontSize: 11, letterSpacing: "0.08em" }}>
              <th style={{ padding: "10px 16px", fontWeight: 600 }}>SEV</th>
              <th style={{ padding: "10px 8px", fontWeight: 600 }}>ID</th>
              <th style={{ padding: "10px 8px", fontWeight: 600 }}>INCIDENT</th>
              <th style={{ padding: "10px 8px", fontWeight: 600 }}>ASSET</th>
              <th style={{ padding: "10px 16px", fontWeight: 600, textAlign: "right" }}>AGE</th>
            </tr>
          </thead>
          <tbody>
            {INCIDENTS.map((inc) => (
              <tr
                key={inc.id}
                style={{ borderTop: "1px solid color-mix(in srgb, var(--c2-text) 7%, transparent)", color: "var(--c2-text)" }}
              >
                <td style={{ padding: "10px 16px" }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", display: "inline-block", background: STATUS_COLOR[inc.severity] }} />
                </td>
                <td style={{ padding: "10px 8px", fontFamily: "var(--c2-font-mono)", color: "var(--c2-accent)" }}>{inc.id}</td>
                <td style={{ padding: "10px 8px" }}>{inc.title}</td>
                <td style={{ padding: "10px 8px", fontFamily: "var(--c2-font-mono)", color: "var(--c2-text-dim)" }}>{inc.asset}</td>
                <td style={{ padding: "10px 16px", textAlign: "right", fontFamily: "var(--c2-font-mono)", color: "var(--c2-text-dim)" }}>{inc.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** RIGHT — details panel for the selected (lead) incident. */
export function IncidentDetails({ currentRegion }: RegionProps) {
  const rows = [
    ["Incident", "INC-4471"],
    ["Severity", "CRITICAL"],
    ["Asset", "WIN-DC-01"],
    ["Tactic", "Command & Control"],
    ["Technique", "T1071.001"],
    ["Source IP", "185.220.101.4"],
    ["Analyst", "unassigned"],
    ["SLA", "08:54 remaining"],
  ];
  return (
    <div className="c2-fluid-list" style={{ width: "100%" }}>
      <span style={eyebrow}>Incident Details · {currentRegion}</span>
      <div style={{ display: "flex", gap: 8 }}>
        <Pill label="CRITICAL" severity="critical" />
        <Pill label="OPEN" severity="warning" />
      </div>
      {rows.map(([k, v]) => (
        <div
          key={k}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            padding: "8px 10px",
            borderRadius: 8,
            background: "color-mix(in srgb, var(--c2-text) 4%, transparent)",
          }}
        >
          <span style={{ fontFamily: "var(--c2-font-mono)", fontSize: 11, color: "var(--c2-text-dim)" }}>{k}</span>
          <span style={{ fontFamily: "var(--c2-font-mono)", fontSize: 12, color: "var(--c2-text)", textAlign: "right" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

/** BOTTOM — system status ticker / footer. */
export function SystemStatusTicker({ regionDirection }: RegionProps) {
  const items: { label: string; severity: Severity }[] = [
    { label: "INGEST 1.2M EPS", severity: "nominal" },
    { label: "ENRICH PIPELINE OK", severity: "nominal" },
    { label: "EDR LAG 4s", severity: "warning" },
    { label: "THREAT INTEL SYNCED", severity: "nominal" },
  ];
  return (
    <div className="c2-fluid" style={{ width: "100%", alignItems: "center" }}>
      <span style={{ ...eyebrow, opacity: 1 }}>System</span>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        {items.map((it) => (
          <span key={it.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--c2-font-mono)", fontSize: 12, color: "var(--c2-text-dim)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLOR[it.severity] }} />
            {it.label}
          </span>
        ))}
      </div>
      <span style={{ marginLeft: "auto", fontFamily: "var(--c2-font-mono)", fontSize: 11, color: "var(--c2-text-dim)" }}>
        flow: {regionDirection}
      </span>
    </div>
  );
}
