import React, { useState } from "react";
import { PageShell, card } from "./PageShell";
import { Server, Filter, ChevronUp, ChevronDown } from "lucide-react";

const ASSETS = [
  { hostname:"DC01.corp.local",        ip:"10.0.0.10",  os:"Windows Server 2022", type:"Domain Controller", dept:"IT",       risk:"critical", findings:3, lastSeen:"1m ago"  },
  { hostname:"WORKSTATION-07.corp",    ip:"10.0.1.47",  os:"Windows 11 Pro",      type:"Workstation",       dept:"Finance",  risk:"high",     findings:2, lastSeen:"3m ago"  },
  { hostname:"FILESERVER-01.corp",     ip:"10.0.0.22",  os:"Windows Server 2019", type:"File Server",       dept:"IT",       risk:"high",     findings:1, lastSeen:"5m ago"  },
  { hostname:"WEBSERVER-01.dmz",       ip:"10.0.2.5",   os:"Ubuntu 22.04 LTS",    type:"Web Server",        dept:"DevOps",   risk:"medium",   findings:1, lastSeen:"2m ago"  },
  { hostname:"LAPTOP-CFO.corp",        ip:"10.0.1.88",  os:"Windows 11 Pro",      type:"Workstation",       dept:"Executive",risk:"medium",   findings:0, lastSeen:"8m ago"  },
  { hostname:"DEVBOX-03.corp",         ip:"10.0.1.103", os:"macOS Sonoma",         type:"Workstation",       dept:"Engineering",risk:"low",   findings:0, lastSeen:"11m ago" },
  { hostname:"SQLSERVER-01.corp",      ip:"10.0.0.31",  os:"Windows Server 2022", type:"Database Server",   dept:"IT",       risk:"medium",   findings:0, lastSeen:"4m ago"  },
  { hostname:"JUMPHOST-01.mgmt",       ip:"10.0.3.10",  os:"Ubuntu 22.04 LTS",    type:"Jump Host",         dept:"IT",       risk:"low",      findings:0, lastSeen:"1m ago"  },
  { hostname:"WORKSTATION-12.corp",    ip:"10.0.1.62",  os:"Windows 10 Pro",      type:"Workstation",       dept:"HR",       risk:"low",      findings:0, lastSeen:"19m ago" },
  { hostname:"BACKUP-SRV-01.corp",     ip:"10.0.0.44",  os:"Windows Server 2019", type:"Backup Server",     dept:"IT",       risk:"low",      findings:0, lastSeen:"7m ago"  },
];

const RISK_COLOR: Record<string, string> = { critical:"#dc2626", high:"#ea580c", medium:"#d97706", low:"#16a34a" };
const RISK_BG:    Record<string, string> = { critical:"#fef2f2", high:"#fff7ed", medium:"#fffbeb", low:"#f0fdf4" };

export function AssetInventoryPage() {
  const [sortField, setSortField] = useState<string>("risk");
  const [sortDir,   setSortDir]   = useState<"asc"|"desc">("desc");

  const riskOrder = { critical:4, high:3, medium:2, low:1 };
  const sorted = [...ASSETS].sort((a, b) => {
    let va: any = a[sortField as keyof typeof a];
    let vb: any = b[sortField as keyof typeof b];
    if (sortField === "risk") { va = riskOrder[a.risk as keyof typeof riskOrder]; vb = riskOrder[b.risk as keyof typeof riskOrder]; }
    if (sortField === "findings") { va = a.findings; vb = b.findings; }
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const sort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: string }) => sortField !== field ? null :
    sortDir === "asc" ? <ChevronUp style={{ width:11, height:11 }} /> : <ChevronDown style={{ width:11, height:11 }} />;

  const counts = { critical:0, high:0, medium:0, low:0 };
  ASSETS.forEach(a => counts[a.risk as keyof typeof counts]++);

  return (
    <PageShell title="Asset Inventory" subtitle="Manage / Asset Inventory"
      actions={
        <div style={{ display:"flex", gap:8 }}>
          <button style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", background:"#fff", border:"1px solid #e4e6eb", borderRadius:7, fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}>
            <Filter style={{ width:12, height:12 }} />Filter
          </button>
        </div>
      }
    >
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

        {/* Stats */}
        <div style={{ display:"flex", gap:12 }}>
          {[
            { label:"Total Assets",    value:ASSETS.length,      color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
            { label:"Critical Risk",   value:counts.critical,    color:"#dc2626", bg:"#fef2f2", border:"#fecaca" },
            { label:"High Risk",       value:counts.high,        color:"#ea580c", bg:"#fff7ed", border:"#fed7aa" },
            { label:"With Findings",   value:ASSETS.filter(a=>a.findings>0).length, color:"#7c3aed", bg:"#faf5ff", border:"#e9d5ff" },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} style={{ ...card(), flex:1, padding:"14px 18px", background:bg, borderColor:border }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.07em", marginBottom:6 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize:28, fontWeight:800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ ...card(), overflow:"hidden" }}>
          <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:7 }}>
            <Server style={{ width:14, height:14, color:"#2563eb" }} />
            <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>ENDPOINTS ({ASSETS.length})</span>
          </div>

          {/* Header */}
          <div style={{ display:"flex", padding:"8px 18px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
            {[
              { label:"HOSTNAME",  field:"hostname", flex:"1"         },
              { label:"IP",        field:"ip",       flex:"0 0 110px" },
              { label:"OS",        field:"os",       flex:"0 0 180px" },
              { label:"DEPT",      field:"dept",     flex:"0 0 100px" },
              { label:"RISK",      field:"risk",     flex:"0 0 90px"  },
              { label:"FINDINGS",  field:"findings", flex:"0 0 80px"  },
              { label:"LAST SEEN", field:"lastSeen", flex:"0 0 90px"  },
            ].map(col => (
              <span key={col.field} onClick={() => sort(col.field)} style={{ flex:col.flex, fontSize:11, fontWeight:700, color:"#94a3b8", cursor:"pointer", display:"flex", alignItems:"center", gap:3, userSelect:"none" }}>
                {col.label} <SortIcon field={col.field} />
              </span>
            ))}
          </div>

          {sorted.map((a, i) => (
            <div key={a.hostname} style={{ display:"flex", alignItems:"center", padding:"10px 18px", borderBottom: i < sorted.length-1 ? "1px solid #f8fafc" : "none", cursor:"pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background="#fafafa")}
              onMouseLeave={e => (e.currentTarget.style.background="transparent")}
            >
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#1e293b", fontFamily:"monospace" }}>{a.hostname}</div>
                <div style={{ fontSize:11, color:"#94a3b8", marginTop:1 }}>{a.type}</div>
              </div>
              <span style={{ flex:"0 0 110px", fontSize:12, color:"#475569", fontFamily:"monospace" }}>{a.ip}</span>
              <span style={{ flex:"0 0 180px", fontSize:12, color:"#475569" }}>{a.os}</span>
              <span style={{ flex:"0 0 100px", fontSize:12, color:"#475569" }}>{a.dept}</span>
              <span style={{ flex:"0 0 90px" }}>
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, color: RISK_COLOR[a.risk], background: RISK_BG[a.risk] }}>{a.risk}</span>
              </span>
              <span style={{ flex:"0 0 80px", fontSize:13, fontWeight:700, color: a.findings > 0 ? "#dc2626" : "#94a3b8" }}>{a.findings}</span>
              <span style={{ flex:"0 0 90px", fontSize:11, color:"#94a3b8" }}>{a.lastSeen}</span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
