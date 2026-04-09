import React, { useState } from "react";
import { PageShell, card } from "./PageShell";
import { Clock, Filter, AlertOctagon, Shield, Zap, Target, Activity, User, Database } from "lucide-react";

const EVENTS = [
  { time:"14:22:08", date:"Apr 8", type:"hunt",     sev:"critical", icon:Target,       title:"Threat Hunt HTN-0041 Complete",                desc:"AI Agent completed full threat hunt. 4 findings identified, 1 critical Kerberoasting attack confirmed.", actor:"AI Agent" },
  { time:"14:18:44", date:"Apr 8", type:"finding",  sev:"critical", icon:AlertOctagon, title:"Kerberoasting Detected — DC01",                  desc:"TGS tickets requested for 14 service accounts in 90 seconds. Consistent with Kerberoasting attack.", actor:"AI Agent" },
  { time:"14:16:22", date:"Apr 8", type:"finding",  sev:"high",     icon:AlertOctagon, title:"Privilege Escalation Attempt",                   desc:"Token duplication via SeDebugPrivilege on WORKSTATION-07 detected.", actor:"AI Agent" },
  { time:"14:15:01", date:"Apr 8", type:"hunt",     sev:"info",     icon:Zap,          title:"Active Threat Hunt Started",                     desc:"Hunt HTN-0041 initiated. Coverage: 5 log sources, 7 SPL playbooks queued.", actor:"AI Agent" },
  { time:"13:55:30", date:"Apr 8", type:"auth",     sev:"high",     icon:User,         title:"Admin Login from Unusual Location",               desc:"User a.rivera@corp.local authenticated from VPN endpoint 203.0.113.44 (Germany).", actor:"System" },
  { time:"11:30:12", date:"Apr 8", type:"config",   sev:"medium",   icon:Shield,       title:"Firewall Rule Modified",                         desc:"Outbound port 8443 added to DMZ allow-list by c.morgan@corp.local.", actor:"c.morgan" },
  { time:"09:14:55", date:"Apr 8", type:"hunt",     sev:"critical", icon:Target,       title:"Hunt HTN-0040 — Lateral Movement Detected",       desc:"AI Agent identified SMB-based lateral movement across 3 hosts. Hunt concluded in 5m 02s.", actor:"AI Agent" },
  { time:"17:20:40", date:"Apr 7", type:"finding",  sev:"high",     icon:AlertOctagon, title:"Privilege Escalation — WORKSTATION-07",           desc:"Unexpected SYSTEM token obtained via local exploit. Escalation chain reconstructed.", actor:"AI Agent" },
  { time:"12:01:15", date:"Apr 7", type:"auth",     sev:"medium",   icon:User,         title:"Service Account Password Reset",                 desc:"Password for svc_backup reset by m.lee@corp.local outside change window.", actor:"m.lee" },
  { time:"09:00:00", date:"Apr 7", type:"hunt",     sev:"info",     icon:Target,       title:"Scheduled Weekly Hunt Started",                   desc:"Automated weekly threat hunt triggered. 9 playbooks queued.", actor:"Scheduler" },
  { time:"16:40:22", date:"Apr 6", type:"finding",  sev:"medium",   icon:Activity,     title:"Abnormal DNS Query Volume",                       desc:"Host WORKSTATION-12 made 2,400 DNS queries in 5 minutes. Possible beacon.", actor:"AI Agent" },
  { time:"10:20:05", date:"Apr 6", type:"config",   sev:"low",      icon:Database,     title:"Splunk Index Rotation",                           desc:"wineventlog index hot buckets rolled over. No data loss detected.", actor:"System" },
];

const SEV_COLOR: Record<string,string> = { critical:"#dc2626", high:"#ea580c", medium:"#d97706", low:"#16a34a", info:"#2563eb" };
const SEV_BG:    Record<string,string> = { critical:"#fef2f2", high:"#fff7ed", medium:"#fffbeb", low:"#f0fdf4", info:"#eff6ff" };
const SEV_BORDER:Record<string,string> = { critical:"#fecaca", high:"#fed7aa", medium:"#fde68a", low:"#bbf7d0", info:"#bfdbfe" };

type TypeFilter = "all" | "hunt" | "finding" | "auth" | "config";

export function TimelinePage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const filtered = typeFilter === "all" ? EVENTS : EVENTS.filter(e => e.type === typeFilter);

  let lastDate = "";

  return (
    <PageShell title="Audit Timeline" subtitle="Manage / Audit Timeline"
      actions={
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", background:"#fff", border:"1px solid #e4e6eb", borderRadius:7, fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}>
          <Filter style={{ width:12, height:12 }} />Filter
        </button>
      }
    >
      <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>

        {/* Timeline */}
        <div style={{ flex:1 }}>

          {/* Filter row */}
          <div style={{ display:"flex", gap:4, marginBottom:20, background:"#f8fafc", border:"1px solid #e4e6eb", borderRadius:8, padding:4, width:"fit-content" }}>
            {(["all","hunt","finding","auth","config"] as TypeFilter[]).map(f => (
              <button key={f} onClick={() => setTypeFilter(f)} style={{ padding:"5px 13px", borderRadius:6, border:"none", background: typeFilter===f?"#fff":"transparent", boxShadow: typeFilter===f?"0 1px 3px rgba(0,0,0,0.1)":"none", fontSize:12, fontWeight: typeFilter===f?600:400, color: typeFilter===f?"#111827":"#6b7280", cursor:"pointer", textTransform:"capitalize" }}>
                {f}
              </button>
            ))}
          </div>

          {filtered.map((ev, i) => {
            const EventIcon = ev.icon;
            const showDate = ev.date !== lastDate;
            lastDate = ev.date;
            return (
              <div key={i}>
                {showDate && (
                  <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 0 12px", paddingLeft:20 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.08em" }}>{ev.date.toUpperCase()}</span>
                    <div style={{ flex:1, height:1, background:"#f1f5f9" }} />
                  </div>
                )}
                <div style={{ display:"flex", gap:0, position:"relative" }}>
                  {/* Connector line */}
                  {i < filtered.length - 1 && (
                    <div style={{ position:"absolute", left:19, top:32, bottom:-8, width:1, background:"#f1f5f9", zIndex:0 }} />
                  )}
                  {/* Icon */}
                  <div style={{ width:38, flexShrink:0, display:"flex", justifyContent:"center", paddingTop:2, zIndex:1 }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background: SEV_BG[ev.sev], border:`1.5px solid ${SEV_BORDER[ev.sev]}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <EventIcon style={{ width:10, height:10, color: SEV_COLOR[ev.sev] }} />
                    </div>
                  </div>
                  {/* Content */}
                  <div style={{ flex:1, paddingBottom:12, paddingLeft:8 }}>
                    <div style={{ ...card(), padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:4 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                          <span style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{ev.title}</span>
                          <span style={{ fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:99, color: SEV_COLOR[ev.sev], background: SEV_BG[ev.sev] }}>{ev.sev}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                          <span style={{ fontSize:11, color:"#94a3b8", fontFamily:"monospace" }}>{ev.time}</span>
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:"#64748b", lineHeight:1.6 }}>{ev.desc}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>
                        <User style={{ width:10, height:10, color:"#94a3b8" }} />
                        <span style={{ fontSize:11, color:"#94a3b8" }}>{ev.actor}</span>
                        <span style={{ fontSize:11, color:"#cbd5e1", marginLeft:4 }}>·</span>
                        <span style={{ fontSize:10, fontWeight:600, padding:"1px 6px", borderRadius:99, background:"#f8fafc", border:"1px solid #e4e6eb", color:"#64748b", textTransform:"capitalize" }}>{ev.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right summary */}
        <div style={{ width:220, flexShrink:0, display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ ...card(), padding:"16px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
              <Clock style={{ width:14, height:14, color:"#2563eb" }} />
              <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>SUMMARY</span>
            </div>
            {[
              ["Total Events", EVENTS.length],
              ["Hunts",        EVENTS.filter(e=>e.type==="hunt").length],
              ["Findings",     EVENTS.filter(e=>e.type==="finding").length],
              ["Auth Events",  EVENTS.filter(e=>e.type==="auth").length],
              ["Config Changes",EVENTS.filter(e=>e.type==="config").length],
            ].map(([k,v]) => (
              <div key={String(k)} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", fontSize:12, borderBottom:"1px solid #f9fafb" }}>
                <span style={{ color:"#9ca3af" }}>{k}</span>
                <span style={{ color:"#374151", fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
