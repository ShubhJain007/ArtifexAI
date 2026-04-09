import React from "react";
import { PageShell, card } from "./PageShell";
import { Network, CheckCircle2, XCircle, AlertCircle, RefreshCw, Server } from "lucide-react";

const SOURCES = [
  { name:"Windows Event Logs",  host:"splunk-idx-01.corp",  type:"Splunk HEC",   status:"connected",  eventsHr:"12,480", latencyMs:"42",  lastEvent:"2s ago",   index:"wineventlog" },
  { name:"Sysmon",              host:"splunk-idx-01.corp",  type:"Splunk HEC",   status:"connected",  eventsHr:"8,920",  latencyMs:"38",  lastEvent:"1s ago",   index:"sysmon"      },
  { name:"Firewall Logs",       host:"splunk-idx-02.corp",  type:"Splunk HEC",   status:"connected",  eventsHr:"4,210",  latencyMs:"61",  lastEvent:"4s ago",   index:"network"     },
  { name:"Active Directory",    host:"splunk-idx-01.corp",  type:"WinEventLog",  status:"connected",  eventsHr:"640",    latencyMs:"55",  lastEvent:"8s ago",   index:"ad_events"   },
  { name:"DNS Logs",            host:"splunk-idx-02.corp",  type:"Syslog UDP",   status:"degraded",   eventsHr:"1,100",  latencyMs:"220", lastEvent:"41s ago",  index:"dns"         },
  { name:"Endpoint EDR",        host:"splunk-idx-03.corp",  type:"REST API",     status:"connected",  eventsHr:"2,840",  latencyMs:"78",  lastEvent:"3s ago",   index:"edr"         },
  { name:"Cloud Audit (AWS)",   host:"s3-to-splunk",        type:"S3 Input",     status:"connected",  eventsHr:"380",    latencyMs:"910", lastEvent:"1m ago",   index:"cloudtrail"  },
  { name:"Email Gateway",       host:"proofpoint-relay",    type:"Syslog TCP",   status:"offline",    eventsHr:"0",      latencyMs:"—",   lastEvent:"12m ago",  index:"email"       },
];

const STATUS_ICON  = { connected: CheckCircle2, degraded: AlertCircle, offline: XCircle };
const STATUS_COLOR = { connected:"#22c55e", degraded:"#f59e0b", offline:"#dc2626" };
const STATUS_BG    = { connected:"#f0fdf4", degraded:"#fffbeb", offline:"#fef2f2" };
const STATUS_BORDER= { connected:"#bbf7d0", degraded:"#fde68a", offline:"#fecaca" };

export function SIEMSourcesPage() {
  const connected = SOURCES.filter(s => s.status === "connected").length;
  const degraded  = SOURCES.filter(s => s.status === "degraded").length;
  const offline   = SOURCES.filter(s => s.status === "offline").length;

  return (
    <PageShell title="SIEM Sources" subtitle="Intelligence / SIEM Sources"
      actions={
        <button style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", background:"#fff", border:"1px solid #e4e6eb", borderRadius:7, fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}>
          <RefreshCw style={{ width:12, height:12 }} />Refresh
        </button>
      }
    >
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

        {/* Stats */}
        <div style={{ display:"flex", gap:12 }}>
          {[
            { label:"Connected",  value:connected, color:"#22c55e", bg:"#f0fdf4", border:"#bbf7d0" },
            { label:"Degraded",   value:degraded,  color:"#f59e0b", bg:"#fffbeb", border:"#fde68a" },
            { label:"Offline",    value:offline,   color:"#dc2626", bg:"#fef2f2", border:"#fecaca" },
            { label:"Total Sources", value:SOURCES.length, color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} style={{ ...card(), flex:1, padding:"14px 18px", background:bg, borderColor:border }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.07em", marginBottom:6 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize:28, fontWeight:800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Sources grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px,1fr))", gap:12 }}>
          {SOURCES.map(src => {
            const StatusIcon = STATUS_ICON[src.status as keyof typeof STATUS_ICON];
            const sc = STATUS_COLOR[src.status as keyof typeof STATUS_COLOR];
            const sb = STATUS_BG[src.status as keyof typeof STATUS_BG];
            const sbo = STATUS_BORDER[src.status as keyof typeof STATUS_BORDER];
            return (
              <div key={src.name} style={{ ...card(), padding:"16px 18px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:"#f8fafc", border:"1px solid #e4e6eb", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Server style={{ width:15, height:15, color:"#2563eb" }} />
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{src.name}</div>
                      <div style={{ fontSize:11, color:"#94a3b8" }}>{src.host}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:99, background:sb, border:`1px solid ${sbo}` }}>
                    <StatusIcon style={{ width:11, height:11, color:sc }} />
                    <span style={{ fontSize:11, fontWeight:700, color:sc, textTransform:"capitalize" }}>{src.status}</span>
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {[
                    ["Type",     src.type],
                    ["Index",    src.index],
                    ["Events/hr",src.eventsHr],
                    ["Latency",  src.latencyMs === "—" ? "—" : `${src.latencyMs}ms`],
                    ["Last Event",src.lastEvent],
                  ].map(([k,v]) => (
                    <div key={k} style={{ padding:"6px 8px", background:"#f8fafc", borderRadius:6 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", marginBottom:2 }}>{k}</div>
                      <div style={{ fontSize:12, fontWeight:600, color:"#374151", fontFamily: k==="Index"?"monospace":"inherit" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
