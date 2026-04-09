import React, { useState } from "react";
import { PageShell, card } from "./PageShell";
import { AlertOctagon, Filter, ChevronRight, Clock, User } from "lucide-react";

const INCIDENTS = [
  { id:"INC-1041", title:"Kerberoasting Detected — DC01",       sev:"critical", status:"investigating", owner:"SOC Tier 2", created:"Apr 8, 14:02", updated:"2m ago",  hunt:"HTN-0041" },
  { id:"INC-1040", title:"Suspicious Admin Login from VPN",      sev:"high",     status:"investigating", owner:"SOC Tier 1", created:"Apr 8, 11:30", updated:"22m ago", hunt:"HTN-0040" },
  { id:"INC-1039", title:"Privilege Escalation — WORKSTATION-7", sev:"high",     status:"open",          owner:"Unassigned",  created:"Apr 7, 17:20", updated:"1hr ago", hunt:"HTN-0040" },
  { id:"INC-1038", title:"Lateral Movement via SMB",             sev:"medium",   status:"closed",        owner:"SOC Tier 2", created:"Apr 6, 09:10", updated:"Apr 7",   hunt:"HTN-0039" },
  { id:"INC-1037", title:"DNS Tunneling Exfiltration Attempt",   sev:"high",     status:"closed",        owner:"SOC Tier 3", created:"Apr 5, 16:40", updated:"Apr 6",   hunt:"HTN-0038" },
  { id:"INC-1036", title:"PowerShell Download Cradle",           sev:"medium",   status:"closed",        owner:"SOC Tier 1", created:"Apr 5, 08:55", updated:"Apr 5",   hunt:"HTN-0038" },
];

const SEV_COLOR: Record<string, string> = { critical:"#dc2626", high:"#ea580c", medium:"#d97706", low:"#16a34a" };
const SEV_BG:    Record<string, string> = { critical:"#fef2f2", high:"#fff7ed", medium:"#fffbeb", low:"#f0fdf4" };
const STA_COLOR: Record<string, string> = { investigating:"#7c3aed", open:"#dc2626", closed:"#16a34a" };
const STA_BG:    Record<string, string> = { investigating:"#faf5ff", open:"#fef2f2", closed:"#f0fdf4" };

export function IncidentsPage() {
  const [filter, setFilter] = useState<"all"|"open"|"investigating"|"closed">("all");
  const filtered = filter === "all" ? INCIDENTS : INCIDENTS.filter(i => i.status === filter);

  const counts = {
    all: INCIDENTS.length,
    open: INCIDENTS.filter(i => i.status === "open").length,
    investigating: INCIDENTS.filter(i => i.status === "investigating").length,
    closed: INCIDENTS.filter(i => i.status === "closed").length,
  };

  return (
    <PageShell title="Incidents" subtitle="Platform / Incidents"
      actions={
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:12, color:"#6b7280" }}>
            <span style={{ fontWeight:700, color:"#dc2626" }}>{counts.open + counts.investigating}</span> active
          </span>
          <button style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", background:"#fff", border:"1px solid #e4e6eb", borderRadius:7, fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}>
            <Filter style={{ width:12, height:12 }} />Filter
          </button>
        </div>
      }
    >
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:4, background:"#f8fafc", border:"1px solid #e4e6eb", borderRadius:8, padding:4, width:"fit-content" }}>
          {(["all","open","investigating","closed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"5px 14px", borderRadius:6, border:"none", background: filter===f ? "#fff" : "transparent", boxShadow: filter===f ? "0 1px 3px rgba(0,0,0,0.1)" : "none", fontSize:12, fontWeight: filter===f ? 600 : 400, color: filter===f ? "#111827" : "#6b7280", cursor:"pointer", textTransform:"capitalize" }}>
              {f} <span style={{ color:"#9ca3af", marginLeft:2 }}>({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ ...card(), overflow:"hidden" }}>
          <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:7 }}>
            <AlertOctagon style={{ width:14, height:14, color:"#dc2626" }} />
            <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>INCIDENT QUEUE</span>
          </div>

          <div style={{ display:"flex", padding:"8px 18px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
            {["ID","TITLE","SEVERITY","STATUS","OWNER","UPDATED",""].map((h, i) => (
              <span key={i} style={{ flex: i===1?"1": i===6?"0 0 30px":"0 0 110px", fontSize:11, fontWeight:700, color:"#94a3b8" }}>{h}</span>
            ))}
          </div>

          {filtered.map((inc, i) => (
            <div key={inc.id} style={{ display:"flex", alignItems:"center", padding:"11px 18px", borderBottom: i < filtered.length-1 ? "1px solid #f8fafc" : "none", cursor:"pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background="#fafafa")}
              onMouseLeave={e => (e.currentTarget.style.background="transparent")}
            >
              <span style={{ flex:"0 0 110px", fontSize:12, fontFamily:"monospace", color:"#2563eb", fontWeight:600 }}>{inc.id}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"#1e293b" }}>{inc.title}</div>
                <div style={{ fontSize:11, color:"#94a3b8", marginTop:1 }}>Hunt: {inc.hunt}</div>
              </div>
              <span style={{ flex:"0 0 110px" }}>
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, color: SEV_COLOR[inc.sev], background: SEV_BG[inc.sev] }}>{inc.sev}</span>
              </span>
              <span style={{ flex:"0 0 110px" }}>
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, color: STA_COLOR[inc.status], background: STA_BG[inc.status], textTransform:"capitalize" }}>{inc.status}</span>
              </span>
              <span style={{ flex:"0 0 110px", fontSize:12, color:"#475569", display:"flex", alignItems:"center", gap:4 }}>
                <User style={{ width:11, height:11 }} />{inc.owner}
              </span>
              <span style={{ flex:"0 0 110px", fontSize:11, color:"#94a3b8", display:"flex", alignItems:"center", gap:4 }}>
                <Clock style={{ width:11, height:11 }} />{inc.updated}
              </span>
              <ChevronRight style={{ flex:"0 0 30px", width:14, height:14, color:"#cbd5e1" }} />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
