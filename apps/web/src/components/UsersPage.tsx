import React from "react";
import { PageShell, card } from "./PageShell";
import { Users, Shield, CheckCircle2, Clock, Key } from "lucide-react";

const USERS = [
  { name:"Alex Rivera",     email:"a.rivera@corp.local",    role:"SOC Analyst Tier 3",  access:"Full Hunt",    mfa:true,  lastLogin:"2m ago",   status:"active"   },
  { name:"Jordan Kim",      email:"j.kim@corp.local",       role:"SOC Analyst Tier 2",  access:"Full Hunt",    mfa:true,  lastLogin:"18m ago",  status:"active"   },
  { name:"Sam Patel",       email:"s.patel@corp.local",     role:"SOC Analyst Tier 1",  access:"Read Only",    mfa:true,  lastLogin:"1hr ago",  status:"active"   },
  { name:"Chris Morgan",    email:"c.morgan@corp.local",    role:"CISO",                access:"Dashboard",    mfa:true,  lastLogin:"3hr ago",  status:"active"   },
  { name:"Taylor Webb",     email:"t.webb@corp.local",      role:"Incident Responder",  access:"Full Hunt",    mfa:false, lastLogin:"5hr ago",  status:"active"   },
  { name:"Dana Brooks",     email:"d.brooks@corp.local",    role:"Threat Intel Analyst","access":"Hunt + Report",mfa:true,lastLogin:"Yesterday","status":"active"  },
  { name:"Morgan Lee",      email:"m.lee@corp.local",       role:"Platform Admin",      access:"Admin",        mfa:true,  lastLogin:"2 days",   status:"inactive" },
  { name:"Casey Stone",     email:"c.stone@corp.local",     role:"Auditor",             access:"Read Only",    mfa:false, lastLogin:"1 week",   status:"inactive" },
];

const ROLE_COLOR: Record<string, string> = {
  "Platform Admin":"#7c3aed","CISO":"#7c3aed","SOC Analyst Tier 3":"#2563eb","SOC Analyst Tier 2":"#2563eb","SOC Analyst Tier 1":"#2563eb",
  "Incident Responder":"#ea580c","Threat Intel Analyst":"#16a34a","Auditor":"#94a3b8",
};

export function UsersPage() {
  const active   = USERS.filter(u => u.status === "active").length;
  const noMfa    = USERS.filter(u => !u.mfa).length;

  return (
    <PageShell title="Users & Access" subtitle="Manage / Users & Access"
      actions={
        <button style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 14px", background:"#2563eb", border:"none", borderRadius:7, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          <Users style={{ width:13, height:13 }} />Invite User
        </button>
      }
    >
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

        {/* Stats */}
        <div style={{ display:"flex", gap:12 }}>
          {[
            { label:"Active Users",  value:active,             color:"#22c55e", bg:"#f0fdf4", border:"#bbf7d0" },
            { label:"Total Users",   value:USERS.length,       color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
            { label:"MFA Disabled",  value:noMfa,              color:"#dc2626", bg:"#fef2f2", border:"#fecaca" },
            { label:"Admin Users",   value:USERS.filter(u=>u.access==="Admin").length, color:"#7c3aed", bg:"#faf5ff", border:"#e9d5ff" },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} style={{ ...card(), flex:1, padding:"14px 18px", background:bg, borderColor:border }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.07em", marginBottom:6 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize:28, fontWeight:800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* MFA warning */}
        {noMfa > 0 && (
          <div style={{ padding:"10px 16px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, display:"flex", alignItems:"center", gap:10, fontSize:13, color:"#92400e" }}>
            <Shield style={{ width:14, height:14, color:"#d97706", flexShrink:0 }} />
            <strong>{noMfa} user{noMfa > 1 ? "s" : ""}</strong> {noMfa > 1 ? "have" : "has"} MFA disabled — enforce MFA immediately to reduce account takeover risk.
          </div>
        )}

        {/* Table */}
        <div style={{ ...card(), overflow:"hidden" }}>
          <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:7 }}>
            <Users style={{ width:14, height:14, color:"#2563eb" }} />
            <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>USER ROSTER</span>
          </div>

          <div style={{ display:"flex", padding:"8px 18px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
            {["USER","ROLE","ACCESS LEVEL","MFA","LAST LOGIN","STATUS"].map((h,i) => (
              <span key={i} style={{ flex: i===0?"1": i===1?"0 0 180px":"0 0 120px", fontSize:11, fontWeight:700, color:"#94a3b8" }}>{h}</span>
            ))}
          </div>

          {USERS.map((u, i) => (
            <div key={u.email} style={{ display:"flex", alignItems:"center", padding:"11px 18px", borderBottom: i < USERS.length-1 ? "1px solid #f8fafc" : "none", cursor:"pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background="#fafafa")}
              onMouseLeave={e => (e.currentTarget.style.background="transparent")}
            >
              <div style={{ flex:1, display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#2563eb,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>
                  {u.name[0]}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{u.name}</div>
                  <div style={{ fontSize:11, color:"#94a3b8" }}>{u.email}</div>
                </div>
              </div>
              <span style={{ flex:"0 0 180px", fontSize:12, fontWeight:600, color: ROLE_COLOR[u.role] || "#475569" }}>{u.role}</span>
              <span style={{ flex:"0 0 120px" }}>
                <span style={{ fontSize:11, padding:"2px 8px", borderRadius:99, background:"#f8fafc", border:"1px solid #e4e6eb", color:"#475569", fontWeight:600, display:"flex", alignItems:"center", gap:4, width:"fit-content" }}>
                  <Key style={{ width:10, height:10 }} />{u.access}
                </span>
              </span>
              <span style={{ flex:"0 0 120px" }}>
                {u.mfa
                  ? <span style={{ fontSize:11, fontWeight:700, color:"#16a34a", display:"flex", alignItems:"center", gap:4 }}><CheckCircle2 style={{ width:12, height:12 }} />Enabled</span>
                  : <span style={{ fontSize:11, fontWeight:700, color:"#dc2626" }}>⚠ Disabled</span>
                }
              </span>
              <span style={{ flex:"0 0 120px", fontSize:11, color:"#94a3b8", display:"flex", alignItems:"center", gap:4 }}>
                <Clock style={{ width:11, height:11 }} />{u.lastLogin}
              </span>
              <span style={{ flex:"0 0 120px" }}>
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, color: u.status==="active"?"#16a34a":"#94a3b8", background: u.status==="active"?"#f0fdf4":"#f8fafc" }}>
                  {u.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
