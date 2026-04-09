import React from "react";
import { PageShell, card } from "./PageShell";
import { Cpu, CheckCircle2, Activity, Zap, Shield, Database, Brain, BarChart2 } from "lucide-react";

const CAPABILITIES = [
  { name:"Autonomous SPL Generation",       desc:"Generates and executes Splunk queries without human input",     status:"active"   },
  { name:"Multi-step Reasoning",             desc:"Chains observations across hunt stages for correlated findings", status:"active"   },
  { name:"MITRE ATT&CK Mapping",             desc:"Automatically maps findings to ATT&CK techniques and tactics",   status:"active"   },
  { name:"Evidence Extraction",              desc:"Pulls raw log evidence and packages it with each finding",        status:"active"   },
  { name:"Risk Scoring",                     desc:"Confidence-weighted risk assessment per finding",                 status:"active"   },
  { name:"Natural Language Reporting",       desc:"Generates executive summaries from technical hunt results",       status:"active"   },
  { name:"Adversarial Simulation (Red Team)","desc":"Autonomous red team playbook execution (coming soon)",         status:"preview"  },
  { name:"Cross-Environment Correlation",   desc:"Multi-tenant SIEM correlation (coming soon)",                     status:"preview"  },
];

const METRICS = [
  { label:"Queries Executed Today",    value:"84",   Icon: Database  },
  { label:"Avg Reasoning Iterations",  value:"7.2",  Icon: Brain     },
  { label:"Findings Accuracy (30d)",   value:"94.2%",Icon: BarChart2  },
  { label:"Autonomous Hunt Success",   value:"98.8%",Icon: Zap       },
];

export function AIAgentPage() {
  return (
    <PageShell title="AI Agent" subtitle="Intelligence / AI Agent">
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

        {/* Agent identity card */}
        <div style={{ ...card(), padding:"24px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#1d4ed8,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Cpu style={{ width:24, height:24, color:"#fff" }} />
            </div>
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:"#0f172a" }}>ArtifexAI Agent</div>
              <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>Autonomous Threat Intelligence Engine · Claude AI</div>
            </div>
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, padding:"6px 14px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:99 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
              <span style={{ fontSize:12, fontWeight:700, color:"#166534" }}>Online</span>
            </div>
          </div>

          <div style={{ display:"flex", gap:12 }}>
            {METRICS.map(({ label, value, Icon }) => (
              <div key={label} style={{ flex:1, background:"#f8fafc", borderRadius:8, padding:"14px 16px", border:"1px solid #f1f5f9" }}>
                <Icon style={{ width:14, height:14, color:"#2563eb", marginBottom:8 }} />
                <div style={{ fontSize:22, fontWeight:800, color:"#0f172a" }}>{value}</div>
                <div style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>

          {/* Capabilities */}
          <div style={{ ...card(), flex:1, overflow:"hidden" }}>
            <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:7 }}>
              <Zap style={{ width:14, height:14, color:"#2563eb" }} />
              <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>CAPABILITIES</span>
            </div>
            {CAPABILITIES.map((cap, i) => (
              <div key={cap.name} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 18px", borderBottom: i < CAPABILITIES.length-1 ? "1px solid #f8fafc" : "none" }}>
                <CheckCircle2 style={{ width:14, height:14, color: cap.status==="active" ? "#22c55e" : "#d1d5db", flexShrink:0, marginTop:1 }} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{cap.name}</span>
                    {cap.status === "preview" && <span style={{ fontSize:10, fontWeight:700, color:"#7c3aed", background:"#faf5ff", border:"1px solid #e9d5ff", padding:"1px 6px", borderRadius:99 }}>PREVIEW</span>}
                  </div>
                  <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{cap.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Config panel */}
          <div style={{ display:"flex", flexDirection:"column", gap:14, width:280, flexShrink:0 }}>
            <div style={{ ...card(), padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                <Shield style={{ width:14, height:14, color:"#2563eb" }} />
                <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>CONFIGURATION</span>
              </div>
              {[
                ["Model",      "Claude AI"],
                ["Mode",       "Autonomous"],
                ["Access",     "Read-Only SIEM"],
                ["Max Iterations","10"],
                ["Query Timeout","30s"],
                ["Output",     "JSON + Narrative"],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", fontSize:12, borderBottom:"1px solid #f9fafb" }}>
                  <span style={{ color:"#9ca3af" }}>{k}</span>
                  <span style={{ color:"#374151", fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ ...card(), padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                <Activity style={{ width:14, height:14, color:"#2563eb" }} />
                <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>LAST ACTIVITY</span>
              </div>
              {[
                ["2m ago",  "Hunt HTN-0041 complete"],
                ["18m ago", "4 findings packaged"],
                ["22m ago", "SPL iteration 7/7 done"],
                ["31m ago", "Coverage check passed"],
              ].map(([t, msg], i) => (
                <div key={i} style={{ display:"flex", gap:10, padding:"5px 0", fontSize:12, borderBottom:"1px solid #f9fafb", alignItems:"flex-start" }}>
                  <span style={{ color:"#9ca3af", flexShrink:0, width:55 }}>{t}</span>
                  <span style={{ color:"#374151" }}>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
