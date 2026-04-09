import React, { useState } from "react";
import { PageShell, card } from "./PageShell";
import { BookOpen, Play, Clock, Shield, Tag } from "lucide-react";

const PLAYBOOKS = [
  {
    id:"PB-001", name:"Credential Access – Kerberoasting",
    tactic:"Credential Access", technique:"T1558.003",
    desc:"Detects service principal name (SPN) enumeration and Kerberos TGS ticket requests indicative of Kerberoasting.",
    queries:7, avgTime:"3m 20s", lastRun:"Apr 8, 2026", severity:"critical",
  },
  {
    id:"PB-002", name:"Lateral Movement – Pass the Hash",
    tactic:"Lateral Movement", technique:"T1550.002",
    desc:"Identifies NTLM authentication anomalies and lateral movement patterns consistent with pass-the-hash attacks.",
    queries:5, avgTime:"2m 45s", lastRun:"Apr 7, 2026", severity:"high",
  },
  {
    id:"PB-003", name:"Persistence – Registry Run Keys",
    tactic:"Persistence", technique:"T1547.001",
    desc:"Hunts for suspicious registry run key modifications used by malware for persistence across reboots.",
    queries:4, avgTime:"1m 58s", lastRun:"Apr 6, 2026", severity:"high",
  },
  {
    id:"PB-004", name:"Exfiltration – DNS Tunneling",
    tactic:"Exfiltration", technique:"T1048.003",
    desc:"Detects abnormal DNS query volumes, entropy, and subdomain patterns indicative of DNS-based data exfiltration.",
    queries:6, avgTime:"4m 10s", lastRun:"Apr 5, 2026", severity:"high",
  },
  {
    id:"PB-005", name:"Execution – Malicious PowerShell",
    tactic:"Execution", technique:"T1059.001",
    desc:"Identifies PowerShell download cradles, obfuscated scripts, and living-off-the-land binary execution patterns.",
    queries:8, avgTime:"2m 30s", lastRun:"Apr 5, 2026", severity:"medium",
  },
  {
    id:"PB-006", name:"Discovery – Network Scanning",
    tactic:"Discovery", technique:"T1046",
    desc:"Detects port scanning, host discovery, and service enumeration activity consistent with internal reconnaissance.",
    queries:3, avgTime:"1m 40s", lastRun:"Apr 4, 2026", severity:"medium",
  },
  {
    id:"PB-007", name:"Defense Evasion – Log Tampering",
    tactic:"Defense Evasion", technique:"T1070.001",
    desc:"Hunts for evidence of Windows event log clearing, Sysmon disabling, and audit policy modifications.",
    queries:5, avgTime:"2m 05s", lastRun:"Apr 3, 2026", severity:"high",
  },
  {
    id:"PB-008", name:"Initial Access – Spearphishing",
    tactic:"Initial Access", technique:"T1566.001",
    desc:"Correlates email gateway alerts with endpoint execution events to identify successful phishing campaigns.",
    queries:6, avgTime:"3m 50s", lastRun:"Apr 2, 2026", severity:"medium",
  },
];

const SEV_COLOR: Record<string, string> = { critical:"#dc2626", high:"#ea580c", medium:"#d97706", low:"#16a34a" };
const SEV_BG:    Record<string, string> = { critical:"#fef2f2", high:"#fff7ed", medium:"#fffbeb", low:"#f0fdf4" };

const TACTIC_COLOR: Record<string, string> = {
  "Credential Access":"#7c3aed", "Lateral Movement":"#dc2626",
  "Persistence":"#d97706", "Exfiltration":"#0891b2",
  "Execution":"#ea580c", "Discovery":"#2563eb",
  "Defense Evasion":"#475569", "Initial Access":"#16a34a",
};

export function PlaybooksPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <PageShell title="Threat Playbooks" subtitle="Intelligence / Playbooks"
      actions={
        <span style={{ fontSize:12, color:"#6b7280" }}>
          <strong style={{ color:"#111827" }}>{PLAYBOOKS.length}</strong> MITRE-aligned playbooks
        </span>
      }
    >
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px,1fr))", gap:14 }}>
        {PLAYBOOKS.map(pb => (
          <div key={pb.id}
            onClick={() => setSelected(selected === pb.id ? null : pb.id)}
            style={{ ...card(), padding:"18px", cursor:"pointer", borderColor: selected===pb.id ? "#bfdbfe" : "#e4e6eb", background: selected===pb.id ? "#f8fbff" : "#fff", transition:"all 0.15s" }}
            onMouseEnter={e => { if (selected !== pb.id) e.currentTarget.style.borderColor="#bfdbfe"; }}
            onMouseLeave={e => { if (selected !== pb.id) e.currentTarget.style.borderColor="#e4e6eb"; }}
          >
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:10, fontFamily:"monospace", fontWeight:700, color:"#94a3b8" }}>{pb.id}</span>
              <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, color: SEV_COLOR[pb.severity], background: SEV_BG[pb.severity] }}>{pb.severity}</span>
            </div>

            <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:6, lineHeight:1.3 }}>{pb.name}</div>
            <div style={{ fontSize:12, color:"#64748b", lineHeight:1.6, marginBottom:12 }}>{pb.desc}</div>

            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
              <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:99, color: TACTIC_COLOR[pb.tactic] || "#475569", background:"#f8fafc", border:"1px solid #e4e6eb", display:"flex", alignItems:"center", gap:4 }}>
                <Tag style={{ width:10, height:10 }} />{pb.tactic}
              </span>
              <span style={{ fontSize:11, fontFamily:"monospace", padding:"2px 8px", borderRadius:99, color:"#475569", background:"#f8fafc", border:"1px solid #e4e6eb" }}>
                {pb.technique}
              </span>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:"1px solid #f1f5f9" }}>
              <div style={{ display:"flex", gap:14 }}>
                <span style={{ fontSize:11, color:"#94a3b8", display:"flex", alignItems:"center", gap:3 }}>
                  <BookOpen style={{ width:10, height:10 }} />{pb.queries} queries
                </span>
                <span style={{ fontSize:11, color:"#94a3b8", display:"flex", alignItems:"center", gap:3 }}>
                  <Clock style={{ width:10, height:10 }} />{pb.avgTime}
                </span>
              </div>
              <button style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 11px", background:"#2563eb", border:"none", borderRadius:6, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                <Play style={{ width:10, height:10 }} />Run
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
