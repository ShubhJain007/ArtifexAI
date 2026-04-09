import React, { useState } from "react";
import { PageShell, card } from "./PageShell";
import { Settings, Shield, Database, Cpu, Bell, Save, CheckCircle2 } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width:"100%", padding:"8px 12px", border:"1px solid #e4e6eb", borderRadius:7,
  fontSize:13, color:"#374151", background:"#fff", outline:"none", boxSizing:"border-box",
};
const labelStyle: React.CSSProperties = { fontSize:12, fontWeight:600, color:"#475569", marginBottom:5, display:"block" };
const sectionTitle = (icon: React.ReactNode, text: string) => (
  <div style={{ display:"flex", alignItems:"center", gap:7, padding:"12px 18px", borderBottom:"1px solid #f1f5f9" }}>
    {icon}
    <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>{text}</span>
  </div>
);

export function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    splunkHost:   "splunk.corp.local",
    splunkPort:   "8089",
    splunkToken:  "••••••••••••••••",
    aiModel:      "claude-opus-4-5",
    maxIter:      "10",
    timeout:      "30",
    mockMode:     "true",
    orgName:      "Demo Corp",
    timezone:     "UTC",
    retainDays:   "90",
    emailAlerts:  "true",
    slackWebhook: "",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const field = (key: keyof typeof form, label: string, type = "text", opts?: string[]) => (
    <div style={{ marginBottom:14 }}>
      <label style={labelStyle}>{label}</label>
      {opts ? (
        <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ ...inputStyle, appearance:"none" }}>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
      )}
    </div>
  );

  return (
    <PageShell title="Settings" subtitle="Settings"
      actions={
        <button onClick={handleSave} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 16px", background: saved ? "#16a34a" : "#2563eb", border:"none", borderRadius:7, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", transition:"background 0.3s" }}>
          {saved ? <><CheckCircle2 style={{ width:13, height:13 }} />Saved!</> : <><Save style={{ width:13, height:13 }} />Save Changes</>}
        </button>
      }
    >
      <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>

        {/* Left column */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16 }}>

          {/* SIEM */}
          <div style={{ ...card(), overflow:"hidden" }}>
            {sectionTitle(<Database style={{ width:14, height:14, color:"#2563eb" }} />, "SIEM CONNECTION")}
            <div style={{ padding:"16px 18px" }}>
              {field("splunkHost", "Splunk Host")}
              <div style={{ display:"flex", gap:12 }}>
                <div style={{ flex:1 }}>{field("splunkPort", "Port")}</div>
                <div style={{ flex:2 }}>{field("splunkToken", "API Token", "password")}</div>
              </div>
              {field("mockMode", "Mode", "text", ["true (Mock)", "false (Live)"])}
            </div>
          </div>

          {/* Notifications */}
          <div style={{ ...card(), overflow:"hidden" }}>
            {sectionTitle(<Bell style={{ width:14, height:14, color:"#2563eb" }} />, "NOTIFICATIONS")}
            <div style={{ padding:"16px 18px" }}>
              {field("emailAlerts", "Email Alerts", "text", ["true", "false"])}
              {field("slackWebhook", "Slack Webhook URL")}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ width:320, flexShrink:0, display:"flex", flexDirection:"column", gap:16 }}>

          {/* AI Agent */}
          <div style={{ ...card(), overflow:"hidden" }}>
            {sectionTitle(<Cpu style={{ width:14, height:14, color:"#2563eb" }} />, "AI AGENT")}
            <div style={{ padding:"16px 18px" }}>
              {field("aiModel", "Model", "text", ["claude-opus-4-5", "claude-sonnet-4-5", "claude-haiku-3-5"])}
              {field("maxIter", "Max Iterations")}
              {field("timeout", "Query Timeout (s)")}
            </div>
          </div>

          {/* Platform */}
          <div style={{ ...card(), overflow:"hidden" }}>
            {sectionTitle(<Settings style={{ width:14, height:14, color:"#2563eb" }} />, "PLATFORM")}
            <div style={{ padding:"16px 18px" }}>
              {field("orgName", "Organization Name")}
              {field("timezone", "Timezone", "text", ["UTC", "America/New_York", "America/Chicago", "America/Los_Angeles", "Europe/London", "Asia/Tokyo"])}
              {field("retainDays", "Retention Period (days)")}
            </div>
          </div>

          {/* Info card */}
          <div style={{ padding:"14px 16px", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
              <Shield style={{ width:13, height:13, color:"#2563eb" }} />
              <span style={{ fontSize:12, fontWeight:700, color:"#1d4ed8" }}>Demo Mode Active</span>
            </div>
            <p style={{ fontSize:12, color:"#3b82f6", margin:0, lineHeight:1.6 }}>
              MOCK_MODE=true — no live SIEM queries are executed. All hunt results are generated from hardcoded demo data.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
