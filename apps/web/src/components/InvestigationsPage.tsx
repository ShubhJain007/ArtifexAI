import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { PageShell, card } from "./PageShell";
import { Search, Target, ChevronRight, Clock, Shield } from "lucide-react";

const HUNT_HISTORY = [
  { id: "HTN-0041", date: "Apr 8, 2026 · 14:22", title: "Full Threat Hunt — Demo Environment", findings: 4, risk: "High", duration: "3m 48s", status: "complete" },
  { id: "HTN-0040", date: "Apr 7, 2026 · 09:14", title: "Targeted Hunt — Lateral Movement",    findings: 2, risk: "Critical", duration: "5m 02s", status: "complete" },
  { id: "HTN-0039", date: "Apr 6, 2026 · 17:55", title: "Scheduled Hunt — Weekly Sweep",       findings: 1, risk: "Medium",   duration: "4m 11s", status: "complete" },
  { id: "HTN-0038", date: "Apr 5, 2026 · 11:30", title: "Ad-hoc Hunt — DNS Anomaly",           findings: 3, risk: "High",     duration: "2m 59s", status: "complete" },
];

const RISK_COLOR: Record<string, string> = { Critical:"#dc2626", High:"#ea580c", Medium:"#d97706", Low:"#16a34a" };
const RISK_BG:    Record<string, string> = { Critical:"#fef2f2", High:"#fff7ed", Medium:"#fffbeb", Low:"#f0fdf4" };

export function InvestigationsPage() {
  const navigate  = useNavigate();
  const lastId    = localStorage.getItem("lastAuditId");

  return (
    <PageShell
      title="Investigations"
      subtitle="Platform / Investigations"
      actions={
        <button onClick={() => navigate("/")} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 14px", background:"#2563eb", border:"none", borderRadius:7, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          <Target style={{ width:13, height:13 }} />New Hunt
        </button>
      }
    >
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

        {/* Summary strip */}
        <div style={{ display:"flex", gap:12 }}>
          {[["Total Hunts","4"],["Open Findings","6"],["Closed","2"],["Avg Duration","4m 00s"]].map(([k,v]) => (
            <div key={k} style={{ ...card(), flex:1, padding:"14px 16px" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.07em", marginBottom:6 }}>{k.toUpperCase()}</div>
              <div style={{ fontSize:22, fontWeight:800, color:"#0f172a" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Hunts table */}
        <div style={{ ...card(), overflow:"hidden" }}>
          <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:7 }}>
            <Search style={{ width:14, height:14, color:"#2563eb" }} />
            <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>HUNT HISTORY</span>
          </div>

          {/* Table header */}
          <div style={{ display:"flex", padding:"8px 18px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
            <span style={{ flex:"0 0 100px", fontSize:11, fontWeight:700, color:"#94a3b8" }}>ID</span>
            <span style={{ flex:1,           fontSize:11, fontWeight:700, color:"#94a3b8" }}>HUNT NAME</span>
            <span style={{ flex:"0 0 80px",  fontSize:11, fontWeight:700, color:"#94a3b8" }}>FINDINGS</span>
            <span style={{ flex:"0 0 90px",  fontSize:11, fontWeight:700, color:"#94a3b8" }}>RISK</span>
            <span style={{ flex:"0 0 90px",  fontSize:11, fontWeight:700, color:"#94a3b8" }}>DURATION</span>
            <span style={{ flex:"0 0 90px",  fontSize:11, fontWeight:700, color:"#94a3b8" }}>DATE</span>
            <span style={{ flex:"0 0 40px"                                                  }}></span>
          </div>

          {HUNT_HISTORY.map((h, i) => (
            <div key={h.id}
              onClick={() => { if (lastId) navigate("/audit/results", { state: { auditId: lastId } }); }}
              style={{ display:"flex", alignItems:"center", padding:"12px 18px", borderBottom: i < HUNT_HISTORY.length-1 ? "1px solid #f8fafc" : "none", cursor:"pointer", transition:"background 0.1s" }}
              onMouseEnter={e => (e.currentTarget.style.background="#fafafa")}
              onMouseLeave={e => (e.currentTarget.style.background="transparent")}
            >
              <span style={{ flex:"0 0 100px", fontSize:12, fontFamily:"monospace", color:"#2563eb", fontWeight:600 }}>{h.id}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"#1e293b" }}>{h.title}</div>
              </div>
              <span style={{ flex:"0 0 80px", fontSize:13, fontWeight:700, color:"#0f172a" }}>{h.findings}</span>
              <span style={{ flex:"0 0 90px" }}>
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, color: RISK_COLOR[h.risk], background: RISK_BG[h.risk] }}>{h.risk}</span>
              </span>
              <span style={{ flex:"0 0 90px", fontSize:12, color:"#64748b", display:"flex", alignItems:"center", gap:4 }}>
                <Clock style={{ width:11, height:11 }} />{h.duration}
              </span>
              <span style={{ flex:"0 0 90px", fontSize:11, color:"#94a3b8" }}>{h.date.split(" · ")[0]}</span>
              <span style={{ flex:"0 0 40px", display:"flex", justifyContent:"flex-end" }}>
                <ChevronRight style={{ width:14, height:14, color:"#cbd5e1" }} />
              </span>
            </div>
          ))}
        </div>

        {!lastId && (
          <div style={{ ...card(), padding:"32px", textAlign:"center", color:"#94a3b8" }}>
            <Shield style={{ width:32, height:32, margin:"0 auto 10px", color:"#cbd5e1" }} />
            <div style={{ fontSize:14, fontWeight:600, color:"#475569", marginBottom:4 }}>No hunt data loaded yet</div>
            <div style={{ fontSize:12 }}>Run a Threat Hunt to populate investigation results.</div>
            <button onClick={() => navigate("/")} style={{ marginTop:14, padding:"8px 16px", background:"#2563eb", color:"#fff", border:"none", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Start Hunt
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
