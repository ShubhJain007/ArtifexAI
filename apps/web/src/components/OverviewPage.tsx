import React from "react";
import { useNavigate } from "react-router";
import { PageShell, card } from "./PageShell";
import { Shield, Target, AlertOctagon, Activity, TrendingUp, Clock, CheckCircle2, XCircle, Zap, ChevronRight } from "lucide-react";

const STAT_CARDS = [
  { label: "Active Threats",    value: "3",   sub: "2 critical · 1 high",  color: "#dc2626", bg: "#fef2f2", border: "#fecaca", Icon: AlertOctagon },
  { label: "Hunts This Week",   value: "12",  sub: "↑ 4 from last week",   color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", Icon: Target       },
  { label: "Assets Monitored", value: "248", sub: "6 endpoints offline",   color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", Icon: Shield        },
  { label: "Mean Time to Detect","value":"4m 12s", sub: "↓ 38% vs baseline", color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff", Icon: Clock     },
];

const RECENT_HUNTS = [
  { id: "HTN-0041", time: "2 min ago",   title: "Lateral Movement – Kerberoasting",     sev: "critical", status: "open"    },
  { id: "HTN-0040", time: "18 min ago",  title: "Privilege Escalation via Token Abuse",  sev: "high",     status: "open"    },
  { id: "HTN-0039", time: "1 hr ago",    title: "Suspicious PowerShell Execution",       sev: "medium",   status: "closed"  },
  { id: "HTN-0038", time: "3 hrs ago",   title: "Data Exfiltration – DNS Tunneling",     sev: "high",     status: "closed"  },
  { id: "HTN-0037", time: "6 hrs ago",   title: "Persistence via Registry Run Keys",     sev: "medium",   status: "closed"  },
];

const SEV_COLOR: Record<string, string> = { critical: "#dc2626", high: "#ea580c", medium: "#d97706", low: "#16a34a" };
const SEV_BG:    Record<string, string> = { critical: "#fef2f2", high: "#fff7ed", medium: "#fffbeb", low: "#f0fdf4" };

const COVERAGE = [
  { source: "Windows Event Logs", status: "connected", events: "12,480/hr" },
  { source: "Sysmon",             status: "connected", events: "8,920/hr"  },
  { source: "Firewall Logs",      status: "connected", events: "4,210/hr"  },
  { source: "DNS Logs",           status: "degraded",  events: "1,100/hr"  },
  { source: "Active Directory",   status: "connected", events: "640/hr"    },
];

export function OverviewPage() {
  const navigate = useNavigate();
  return (
    <PageShell
      title="Security Overview"
      subtitle="Platform / Overview"
      actions={
        <button onClick={() => navigate("/")} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 14px", background:"#2563eb", border:"none", borderRadius:7, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          <Zap style={{ width:13, height:13 }} />New Threat Hunt
        </button>
      }
    >
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

        {/* Stat cards */}
        <div style={{ display:"flex", gap:14 }}>
          {STAT_CARDS.map(({ label, value, sub, color, bg, border, Icon }) => (
            <div key={label} style={{ ...card(), flex:1, padding:"16px 18px", borderColor: border, background: bg }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.07em" }}>{label.toUpperCase()}</span>
                <div style={{ width:28, height:28, borderRadius:7, background:"#fff", border:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon style={{ width:14, height:14, color }} />
                </div>
              </div>
              <div style={{ fontSize:28, fontWeight:800, color:"#0f172a", lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:11, color:"#94a3b8", marginTop:6 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>

          {/* Recent Hunts */}
          <div style={{ ...card(), flex:1, overflow:"hidden" }}>
            <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <Target style={{ width:14, height:14, color:"#2563eb" }} />
                <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>RECENT HUNTS</span>
              </div>
              <button onClick={() => navigate("/investigations")} style={{ fontSize:11, color:"#2563eb", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:3 }}>
                View all <ChevronRight style={{ width:12, height:12 }} />
              </button>
            </div>
            {RECENT_HUNTS.map((h, i) => (
              <div key={h.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 18px", borderBottom: i < RECENT_HUNTS.length-1 ? "1px solid #f8fafc" : "none", cursor:"pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background="#fafafa")}
                onMouseLeave={e => (e.currentTarget.style.background="transparent")}
                onClick={() => { const id = localStorage.getItem("lastAuditId"); if (id) navigate("/audit/results", { state: { auditId: id }}); }}
              >
                <div style={{ flex:"0 0 70px" }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:"2px 7px", borderRadius:99, color: SEV_COLOR[h.sev], background: SEV_BG[h.sev] }}>{h.sev}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:"#1e293b" }}>{h.title}</div>
                  <div style={{ fontSize:11, color:"#94a3b8", marginTop:1 }}>{h.id} · {h.time}</div>
                </div>
                {h.status === "open"
                  ? <span style={{ fontSize:10, fontWeight:700, color:"#dc2626", background:"#fef2f2", padding:"2px 7px", borderRadius:99 }}>OPEN</span>
                  : <span style={{ fontSize:10, fontWeight:700, color:"#16a34a", background:"#f0fdf4", padding:"2px 7px", borderRadius:99 }}>CLOSED</span>
                }
              </div>
            ))}
          </div>

          {/* Coverage / right column */}
          <div style={{ display:"flex", flexDirection:"column", gap:14, width:280, flexShrink:0 }}>

            {/* Agent status */}
            <div style={{ ...card(), padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                <Activity style={{ width:14, height:14, color:"#2563eb" }} />
                <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>AI AGENT STATUS</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", display:"inline-block", flexShrink:0 }} />
                <span style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>Online — Autonomous Mode</span>
              </div>
              {[["Model","Claude AI Agent"],["Queries Today","84"],["Avg Hunt Time","3m 52s"],["Accuracy","94.2%"]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:12, borderBottom:"1px solid #f9fafb" }}>
                  <span style={{ color:"#9ca3af" }}>{k}</span>
                  <span style={{ color:"#374151", fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* SIEM Coverage */}
            <div style={{ ...card(), overflow:"hidden" }}>
              <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:7 }}>
                <TrendingUp style={{ width:14, height:14, color:"#2563eb" }} />
                <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>LOG COVERAGE</span>
              </div>
              {COVERAGE.map((c, i) => (
                <div key={c.source} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 18px", borderBottom: i < COVERAGE.length-1 ? "1px solid #f8fafc" : "none" }}>
                  {c.status === "connected"
                    ? <CheckCircle2 style={{ width:13, height:13, color:"#22c55e", flexShrink:0 }} />
                    : <XCircle style={{ width:13, height:13, color:"#f59e0b", flexShrink:0 }} />
                  }
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:500, color:"#374151" }}>{c.source}</div>
                  </div>
                  <span style={{ fontSize:11, color:"#94a3b8", fontFamily:"monospace" }}>{c.events}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
