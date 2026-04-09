import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { Zap, Lock, Eye, AlertTriangle, ChevronRight, Network, Target, Shield, Cpu, FileSearch, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";

const inputStyle: React.CSSProperties = {
  width: "100%", height: 38, padding: "0 12px", fontSize: 13,
  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, color: "#0f172a",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.15s",
};
const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none", WebkitAppearance: "none", cursor: "pointer",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: 32,
};
const label: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5 };

const SIEM = [
  { value: "splunk",    label: "Splunk Enterprise" },
  { value: "sentinel",  label: "Microsoft Sentinel" },
  { value: "qradar",    label: "IBM QRadar" },
  { value: "elastic",   label: "Elastic Security" },
  { value: "chronicle", label: "Google Chronicle" },
];
const RANGES = [
  { value: "30",  label: "Last 30 days"  },
  { value: "90",  label: "Last 90 days"  },
  { value: "180", label: "Last 180 days" },
  { value: "365", label: "Last 365 days" },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [siem,      setSiem]      = useState("splunk");
  const [baseUrl,   setBaseUrl]   = useState("https://demo-siem.internal/services/mcp");
  const [apiToken,  setApiToken]  = useState("demo-token-artifexai");
  const [timeRange, setTimeRange] = useState("180");
  const [scope,     setScope]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  // If a hunt is already in progress, go straight back to it
  const inProgressId = localStorage.getItem("inProgressAuditId");
  React.useEffect(() => {
    if (inProgressId) navigate("/audit/in-progress", { state: { auditId: inProgressId }, replace: true });
  }, []);

  const launch = async () => {
    setLoading(true); setError(null);
    // Clear all previous hunt state before starting a new one
    localStorage.removeItem("artifex_hunt_state");
    localStorage.removeItem("inProgressAuditId");
    localStorage.removeItem("artifex_last_results");
    localStorage.removeItem("lastAuditId");
    try {
      const r = await api.audit.start({
        command: "npx", args: ["-y","mcp-remote", baseUrl, "--header", `Authorization: Bearer ${apiToken}`],
        env: { NODE_TLS_REJECT_UNAUTHORIZED: "0" }, timeRange, scope: scope || undefined,
      });
      if (r.ok) {
        localStorage.setItem("inProgressAuditId", r.auditId);
        navigate("/audit/in-progress", { state: { auditId: r.auditId } });
      } else setError(r.error?.message || "Failed to start audit");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to connect");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f4f8" }}>
      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Page header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>Platform / Threat Hunt</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>New Threat Hunt</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "5px 12px", borderRadius: 99, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            AI Agent Ready
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: "28px 32px", display: "flex", gap: 24 }}>

          {/* LEFT — Form */}
          <div style={{ flex: "0 0 520px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* SIEM Connection */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
                <Network style={{ width: 15, height: 15, color: "#2563eb" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>SIEM Connection</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>Read-only access</span>
              </div>
              <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={label}>SIEM Type</label>
                  <select value={siem} onChange={e => setSiem(e.target.value)} style={selectStyle}
                    onFocus={e => (e.target.style.borderColor = "#2563eb")}
                    onBlur={e  => (e.target.style.borderColor = "#e2e8f0")}>
                    {SIEM.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={label}>Endpoint URL</label>
                  <input type="url" value={baseUrl} onChange={e => setBaseUrl(e.target.value)}
                    placeholder="https://your-siem.example.com" style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }}
                    onFocus={e => (e.target.style.borderColor = "#2563eb")}
                    onBlur={e  => (e.target.style.borderColor = "#e2e8f0")} />
                </div>
                <div>
                  <label style={label}>API Token</label>
                  <div style={{ position: "relative" }}>
                    <input type="password" value={apiToken} onChange={e => setApiToken(e.target.value)}
                      placeholder="Enter read-only API token" style={{ ...inputStyle, paddingRight: 36, fontFamily: "monospace", fontSize: 12 }}
                      onFocus={e => (e.target.style.borderColor = "#2563eb")}
                      onBlur={e  => (e.target.style.borderColor = "#e2e8f0")} />
                    <Lock style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#cbd5e1" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Hunt Parameters */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
                <Target style={{ width: 15, height: 15, color: "#2563eb" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Hunt Parameters</span>
              </div>
              <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={label}>Time Range</label>
                  <select value={timeRange} onChange={e => setTimeRange(e.target.value)} style={selectStyle}
                    onFocus={e => (e.target.style.borderColor = "#2563eb")}
                    onBlur={e  => (e.target.style.borderColor = "#e2e8f0")}>
                    {RANGES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={label}>Scope Filter <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
                  <textarea value={scope} onChange={e => setScope(e.target.value)} rows={3}
                    placeholder="e.g., Domain Controllers only, 10.0.0.0/8, Production servers..."
                    style={{ ...inputStyle, height: "auto", padding: "8px 12px", resize: "none", lineHeight: 1.6, fontFamily: "monospace", fontSize: 12 }}
                    onFocus={e => (e.target.style.borderColor = "#2563eb")}
                    onBlur={e  => (e.target.style.borderColor = "#e2e8f0")} />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: "flex", gap: 9, padding: "11px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#dc2626", fontSize: 13 }}>
                <AlertTriangle style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />
                {error}
              </div>
            )}

            {/* CTA */}
            <button onClick={launch} disabled={loading}
              style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 8, border: "none", background: loading ? "#93c5fd" : "#2563eb", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 2px 8px rgba(37,99,235,0.35)", transition: "all 0.15s" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1d4ed8"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#2563eb"; }}
            >
              {loading
                ? <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Initializing...</>
                : <><Zap style={{ width: 16, height: 16 }} />Initialize Threat Hunt<ChevronRight style={{ width: 15, height: 15 }} /></>
              }
            </button>

            <div style={{ display: "flex", gap: 7, padding: "9px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 7, fontSize: 12, color: "#3b82f6" }}>
              <Eye style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1 }} />
              Read-only mode — no data will be modified. All queries are logged in the final audit report.
            </div>
          </div>

          {/* RIGHT — Info */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* About this hunt */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
                <Cpu style={{ width: 15, height: 15, color: "#2563eb" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>How It Works</span>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { n: "1", title: "Connect to SIEM", desc: "ArtifexAI establishes a read-only MCP connection to your security data." },
                  { n: "2", title: "Load Hunt Playbooks", desc: "Curated threat hunting playbooks aligned to MITRE ATT&CK are loaded automatically." },
                  { n: "3", title: "AI Agent Executes", desc: "Claude AI Agent runs SPL queries, analyzes results, and identifies suspicious activity." },
                  { n: "4", title: "Generate Report", desc: "Every finding is backed by raw log evidence and includes actionable remediation steps." },
                ].map(s => (
                  <div key={s.n} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>{s.n}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 2 }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active playbooks */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
                <FileSearch style={{ width: 15, height: 15, color: "#2563eb" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Active Hunt Playbooks</span>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: 99, border: "1px solid #bfdbfe" }}>5</span>
              </div>
              <div>
                {[
                  { name: "PowerShell LOLBins Detection",   tag: "T1059.001", sev: "high"     },
                  { name: "Credential Dumping Indicators",  tag: "T1003",     sev: "critical" },
                  { name: "Lateral Movement Patterns",      tag: "T1021",     sev: "high"     },
                  { name: "Scheduled Task Persistence",     tag: "T1053",     sev: "medium"   },
                  { name: "Data Exfiltration Signals",      tag: "T1041",     sev: "critical" },
                ].map((p, i, arr) => {
                  const dotColor = p.sev === "critical" ? "#dc2626" : p.sev === "high" ? "#ea580c" : "#d97706";
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 20px", borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none", gap: 10 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, color: "#374151" }}>{p.name}</span>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "2px 7px", borderRadius: 4 }}>{p.tag}</span>
                      <CheckCircle2 style={{ width: 13, height: 13, color: "#22c55e" }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Capabilities badges */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Read-Only Access","MITRE ATT&CK Aligned","Evidence-Backed","AI Agent Powered","Audit Trail"].map(c => (
                <span key={c} style={{ fontSize: 11, fontWeight: 600, color: "#475569", background: "#fff", border: "1px solid #e2e8f0", padding: "5px 11px", borderRadius: 99, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
