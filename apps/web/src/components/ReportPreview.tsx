import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { SeverityBadge } from "./SeverityBadge";
import { RiskLevelBadge } from "./RiskLevelBadge";
import { Download, FileText, AlertTriangle, ArrowLeft, Shield, CheckCircle2 } from "lucide-react";
import type { AuditResultsResponse, Finding } from "../lib/api";

interface TocItem { id: string; label: string; level: number }

function buildToc(findings: Finding[]): TocItem[] {
  const toc: TocItem[] = [
    { id:"executive-summary", label:"Executive Summary",  level:1 },
    { id:"methodology",       label:"Methodology",        level:1 },
    { id:"scope",             label:"Scope & Coverage",   level:1 },
    { id:"findings",          label:"Detailed Findings",  level:1 },
  ];
  findings.forEach((f,i) => toc.push({ id:`finding-${i+1}`, label:`${f.id} — ${f.title}`, level:2 }));
  toc.push(
    { id:"recommendations", label:"Recommendations",  level:1 },
    { id:"appendix",        label:"Appendix",          level:1 },
    { id:"queries",         label:"Query Log",         level:2 },
  );
  return toc;
}

const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });

function getCachedResults(): AuditResultsResponse | null {
  try { return JSON.parse(localStorage.getItem("artifex_last_results") || "null"); } catch { return null; }
}

export function ReportPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const state    = location.state as { auditId?: string; results?: AuditResultsResponse } | null;
  const auditId  = state?.auditId ?? localStorage.getItem("lastAuditId") ?? undefined;
  // Use results from router state, or fall back to localStorage cache
  const results  = state?.results ?? getCachedResults() ?? undefined;
  const [active, setActive] = useState("executive-summary");

  if (!results?.findings) return (
    <div style={{ display:"flex", height:"100vh" }}>
      <Sidebar />
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"#f0f4f8" }}>
        <div style={{ maxWidth:420, padding:"20px 24px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10 }}>
          <div style={{ display:"flex", gap:9, alignItems:"center", marginBottom:8 }}>
            <AlertTriangle style={{ width:16, height:16, color:"#d97706" }} />
            <span style={{ fontWeight:700, color:"#92400e" }}>No Report Data</span>
          </div>
          <p style={{ fontSize:13, color:"#78350f", marginBottom:12 }}>Navigate here from the Audit Results page.</p>
          <button onClick={() => navigate("/")} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#2563eb", background:"transparent", border:"1px solid #bfdbfe", borderRadius:6, padding:"6px 12px", cursor:"pointer" }}>
            <ArrowLeft style={{ width:13, height:13 }} />Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  const { findings, stats, summary } = results;
  const today  = fmtDate(new Date());
  const allQ   = [...new Set(findings.flatMap(f => f.queries))];
  const crits  = findings.filter(f => f.severity === "critical").length;
  const highs  = findings.filter(f => f.severity === "high").length;
  const meds   = findings.filter(f => f.severity === "medium").length;
  const lows   = findings.filter(f => f.severity === "low").length;
  const toc    = buildToc(findings);

  const scroll = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:"#f0f4f8" }}>
      <Sidebar />

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Page header */}
        <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 32px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:11, color:"#94a3b8", marginBottom:2 }}>Platform / Reports / Audit Report</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>Cybersecurity Due Diligence Report</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => window.print()}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"#fff", border:"1px solid #e2e8f0", borderRadius:7, color:"#475569", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              <Download style={{ width:13, height:13 }} />Export PDF
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, display:"flex", overflow:"hidden", gap:0 }}>

          {/* TOC */}
          <div style={{ width:224, flexShrink:0, background:"#fff", borderRight:"1px solid #e2e8f0", display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:"1px solid #f1f5f9" }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.08em" }}>TABLE OF CONTENTS</span>
            </div>
            <nav style={{ flex:1, overflowY:"auto", padding:"8px 8px" }}>
              {toc.map(item => (
                <button key={item.id} onClick={() => scroll(item.id)}
                  style={{
                    width:"100%", textAlign:"left", padding: item.level===2 ? "6px 10px 6px 24px" : "7px 10px",
                    borderRadius:6, border:"none", cursor:"pointer", fontSize: item.level===2?11:12,
                    fontWeight: active===item.id ? 700 : (item.level===1?600:400),
                    color: active===item.id ? "#2563eb" : item.level===2 ? "#94a3b8" : "#475569",
                    background: active===item.id ? "#eff6ff" : "transparent",
                    display:"block", transition:"all 0.1s", marginBottom:1,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                  }}>
                  {item.level===2 ? `↳ ${item.label.split("—")[0].trim()}` : item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Report */}
          <div style={{ flex:1, overflowY:"auto" }}>
            <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 40px 60px" }}>

              {/* Report cover */}
              <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"28px 32px", marginBottom:20, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <div style={{ width:34, height:34, borderRadius:8, background:"#eff6ff", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Shield style={{ width:17, height:17, color:"#2563eb" }} />
                      </div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:"#2563eb" }}>ArtifexAI Threat Intelligence</div>
                        <div style={{ fontSize:10, color:"#94a3b8" }}>Powered by Claude AI Agent</div>
                      </div>
                    </div>
                    <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a", margin:"0 0 6px", letterSpacing:"-0.02em" }}>Cybersecurity Due Diligence Report</h1>
                    <div style={{ fontSize:13, color:"#64748b" }}>M&A Security Assessment — Confidential</div>
                  </div>
                  <RiskLevelBadge level={stats.riskLevel} large />
                </div>
                <div style={{ display:"flex", gap:24, marginTop:20, paddingTop:18, borderTop:"1px solid #f1f5f9" }}>
                  {[
                    ["Generated",       today],
                    ["Audit ID",        auditId?.slice(-12).toUpperCase() || "—"],
                    ["Total Findings",  String(stats.totalFindings)],
                    ["Avg AI Confidence", `${stats.avgConfidence}%`],
                    ["Evidence Items",  String(stats.evidenceCount)],
                  ].map(([k,v]) => (
                    <div key={k}>
                      <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:"0.07em", marginBottom:3 }}>{k.toUpperCase()}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section helper */}
              {(() => {
                const Section = ({ id, title, accent = "#2563eb", children }: { id:string; title:string; accent?:string; children:React.ReactNode }) => (
                  <div id={id} style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, marginBottom:16, overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div style={{ padding:"14px 24px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:3, height:18, borderRadius:2, background:accent }} />
                      <span style={{ fontSize:15, fontWeight:700, color:"#0f172a" }}>{title}</span>
                    </div>
                    <div style={{ padding:"20px 24px" }}>{children}</div>
                  </div>
                );

                return (
                  <>
                    {/* Executive Summary */}
                    <Section id="executive-summary" title="Executive Summary">
                      <p style={{ fontSize:13, color:"#475569", lineHeight:1.8, margin:"0 0 16px" }}>{summary}</p>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                        <div style={{ padding:"14px 16px", background:"#f8fafc", borderRadius:8, border:"1px solid #f1f5f9" }}>
                          <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:10, letterSpacing:"0.07em" }}>SEVERITY BREAKDOWN</div>
                          {[{l:"Critical",n:crits,c:"#dc2626"},{l:"High",n:highs,c:"#ea580c"},{l:"Medium",n:meds,c:"#d97706"},{l:"Low",n:lows,c:"#16a34a"}].map(s => (
                            <div key={s.l} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                              <div style={{ width:6, height:6, borderRadius:"50%", background:s.c, flexShrink:0 }} />
                              <div style={{ flex:1, height:4, borderRadius:99, background:"#f1f5f9", overflow:"hidden" }}>
                                <div style={{ height:"100%", width:`${stats.totalFindings ? (s.n/stats.totalFindings)*100 : 0}%`, background:s.c, borderRadius:99 }} />
                              </div>
                              <span style={{ fontSize:12, color:s.c, fontWeight:700, width:14, textAlign:"right" }}>{s.n}</span>
                              <span style={{ fontSize:12, color:"#94a3b8", width:44 }}>{s.l}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ padding:"14px 16px", background:"#f8fafc", borderRadius:8, border:"1px solid #f1f5f9" }}>
                          <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:10, letterSpacing:"0.07em" }}>COVERAGE SUMMARY</div>
                          {[["Playbooks Executed","1"],["Unique SPL Queries",String(allQ.length)],["Analysis Method","AI Agent (Claude)"],["Access Mode","Read-Only"]].map(([k,v]) => (
                            <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:12 }}>
                              <span style={{ color:"#94a3b8" }}>{k}</span>
                              <span style={{ fontWeight:600, color:"#374151" }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Section>

                    {/* Methodology */}
                    <Section id="methodology" title="Methodology" accent="#7c3aed">
                      <p style={{ fontSize:13, color:"#475569", lineHeight:1.8, margin:"0 0 14px" }}>
                        ArtifexAI's AI Agent — built on Anthropic's Claude — autonomously interprets threat hunting playbooks and executes SPL queries against live SIEM data. Every finding is grounded in actual log evidence with traceable query provenance.
                      </p>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {[
                          ["01","Coverage Assessment","Validated SIEM connectivity, log source completeness and credential scope"],
                          ["02","Hunt Selection","Loaded MITRE ATT&CK-aligned threat hunting playbooks tailored to the environment"],
                          ["03","AI Agent Execution","Claude AI Agent autonomously ran SPL queries, analyzed results, and identified anomalies"],
                          ["04","Evidence Collection","Raw log entries matched and confidence scores calculated per finding"],
                          ["05","Risk Assessment","Severity, business impact and remediation priority assessed for each finding"],
                        ].map(([n,t,d]) => (
                          <div key={n} style={{ display:"flex", gap:12, padding:"10px 12px", background:"#f8fafc", borderRadius:8 }}>
                            <span style={{ fontSize:11, fontWeight:800, color:"#bfdbfe", background:"#eff6ff", width:24, height:24, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{n}</span>
                            <div>
                              <div style={{ fontSize:13, fontWeight:600, color:"#0f172a", marginBottom:2 }}>{t}</div>
                              <div style={{ fontSize:12, color:"#64748b" }}>{d}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Section>

                    {/* Scope */}
                    <Section id="scope" title="Scope & Coverage" accent="#0891b2">
                      <p style={{ fontSize:13, color:"#475569", lineHeight:1.8, margin:0 }}>
                        The audit covered all systems forwarding logs to the SIEM during the assessment period.
                        A total of <strong>{allQ.length} unique SPL queries</strong> were executed across <strong>{findings.length} threat hunting playbook{findings.length!==1?"s":""}</strong>.
                        All operations were performed with read-only credentials — no production systems were modified.
                      </p>
                    </Section>

                    {/* Findings */}
                    <Section id="findings" title={`Detailed Findings (${findings.length})`} accent="#dc2626">
                      {findings.length === 0
                        ? <p style={{ fontSize:13, color:"#94a3b8", fontStyle:"italic" }}>No findings were identified during this assessment.</p>
                        : <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                            {findings.map((f, idx) => (
                              <div key={f.id} id={`finding-${idx+1}`} style={{ border:"1px solid #f1f5f9", borderRadius:10, overflow:"hidden" }}>
                                <div style={{ padding:"12px 16px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                    <SeverityBadge severity={f.severity as any} />
                                    <span style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{f.id} — {f.title}</span>
                                  </div>
                                  <span style={{ fontSize:12, fontWeight:700, color:"#2563eb" }}>{f.confidence}% confidence</span>
                                </div>
                                <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:12 }}>
                                  <p style={{ fontSize:13, color:"#475569", lineHeight:1.7, margin:0 }}>{f.description}</p>
                                  <div>
                                    <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:6, letterSpacing:"0.06em" }}>AFFECTED ENTITIES</div>
                                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                                      {f.affectedEntities.map((e,i) => <span key={i} style={{ fontSize:12, fontFamily:"monospace", color:"#475569", background:"#f8fafc", border:"1px solid #e2e8f0", padding:"2px 8px", borderRadius:5 }}>{e}</span>)}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:6, letterSpacing:"0.06em" }}>KEY EVIDENCE</div>
                                    <div style={{ background:"#0f172a", borderRadius:8, overflow:"hidden" }}>
                                      {f.evidence.slice(0,3).map((ev,i) => (
                                        <div key={i} style={{ padding:"7px 14px", fontSize:11, fontFamily:"monospace", color:"#4ade80", borderBottom:i<2?"1px solid #1e293b":"none", lineHeight:1.5 }}>
                                          <span style={{ color:"#334155" }}>{String(i+1).padStart(2,"0")} </span>{ev}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:6, letterSpacing:"0.06em" }}>REMEDIATION</div>
                                    <div style={{ padding:"10px 14px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:7, fontSize:13, color:"#166534", lineHeight:1.7 }}>{f.recommendation}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                      }
                    </Section>

                    {/* Recommendations */}
                    <Section id="recommendations" title="Consolidated Recommendations" accent="#16a34a">
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {findings.map(f => (
                          <div key={f.id} style={{ display:"flex", gap:12, padding:"12px 14px", background:"#f8fafc", borderRadius:9, border:"1px solid #f1f5f9" }}>
                            <SeverityBadge severity={f.severity as any} />
                            <div>
                              <div style={{ fontSize:13, fontWeight:600, color:"#0f172a", marginBottom:3 }}>{f.title}</div>
                              <div style={{ fontSize:12, color:"#64748b", lineHeight:1.6 }}>{f.recommendation}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Section>

                    {/* Appendix */}
                    <Section id="appendix" title="Appendix" accent="#475569">
                      <div id="queries">
                        <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:10, letterSpacing:"0.07em" }}>COMPLETE SPL QUERY LOG ({allQ.length} queries)</div>
                        <div style={{ background:"#0f172a", borderRadius:8, overflow:"hidden" }}>
                          {allQ.map((q,i) => (
                            <div key={i} style={{ padding:"8px 16px", fontSize:12, fontFamily:"monospace", color:"#60a5fa", borderBottom:i<allQ.length-1?"1px solid #1e293b":"none", lineHeight:1.6, wordBreak:"break-all" }}>
                              <span style={{ color:"#334155" }}>{String(i+1).padStart(2,"0")} $ </span>{q}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Section>

                    {/* Footer */}
                    <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", fontSize:11, color:"#cbd5e1" }}>
                      <span>ArtifexAI Threat Intelligence Platform — CONFIDENTIAL</span>
                      <span>Generated {today} — {auditId?.slice(-12).toUpperCase()}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
