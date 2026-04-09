import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { RiskLevelBadge } from "./RiskLevelBadge";
import { SeverityBadge } from "./SeverityBadge";
import { FileText, Download, Loader2, Shield, Activity, Target, ChevronRight, AlertCircle } from "lucide-react";
import { api, type Finding, type AuditResultsResponse } from "../lib/api";

const SEV_BORDER: Record<string, string> = { critical:"#dc2626", high:"#ea580c", medium:"#d97706", low:"#16a34a" };
const RESULTS_CACHE_KEY = "artifex_last_results";

function getCachedResults(): AuditResultsResponse | null {
  try { return JSON.parse(localStorage.getItem(RESULTS_CACHE_KEY) || "null"); } catch { return null; }
}

export function AuditResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const auditId  = (location.state?.auditId ?? localStorage.getItem("lastAuditId")) as string | undefined;

  // Restore from cache immediately — no loading flash, no API dependency
  const cached = getCachedResults();
  const [results, setResults] = useState<AuditResultsResponse | null>(cached);
  const [sel,     setSel]     = useState<Finding | null>(cached?.findings?.[0] ?? null);
  const [loading, setLoading] = useState(!cached); // skip loading if we have cache
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!auditId) { setError("No session"); setTimeout(() => navigate("/"), 2000); return; }

    // If we already have cached results for this exact auditId, skip the fetch
    const existing = getCachedResults();
    if (existing && existing.auditId === auditId) {
      setResults(existing);
      if (!sel && existing.findings[0]) setSel(existing.findings[0]);
      setLoading(false);
      return;
    }

    // Otherwise fetch fresh and cache the response
    api.audit.results(auditId)
      .then(d => {
        if (!d.ok) { setError(d.error?.message || "Error"); return; }
        localStorage.setItem(RESULTS_CACHE_KEY, JSON.stringify(d));
        setResults(d);
        if (d.findings[0]) setSel(d.findings[0]);
      })
      .catch(e => setError(e instanceof Error ? e.message : "Failed"))
      .finally(() => setLoading(false));
  }, [auditId, navigate]);

  if (loading) return (
    <div style={{ display:"flex", height:"100vh" }}>
      <Sidebar />
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:14, background:"#f0f4f8" }}>
        <Loader2 style={{ width:28, height:28, color:"#2563eb", animation:"spin 1s linear infinite" }} />
        <span style={{ fontSize:13, color:"#64748b" }}>Loading results...</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error || !results) return (
    <div style={{ display:"flex", height:"100vh" }}>
      <Sidebar />
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"#f0f4f8" }}>
        <div style={{ padding:"14px 20px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, color:"#dc2626", fontSize:13 }}>{error || "No results"}</div>
      </div>
    </div>
  );

  const { findings, stats, summary } = results;
  const crits = findings.filter(f => f.severity === "critical").length;
  const highs = findings.filter(f => f.severity === "high").length;
  const meds  = findings.filter(f => f.severity === "medium").length;
  const lows  = findings.filter(f => f.severity === "low").length;

  const statCards = [
    { label:"Overall Risk",       value: <RiskLevelBadge level={stats.riskLevel} />,             sub: null },
    { label:"Total Findings",     value: <span style={{fontSize:28,fontWeight:800,color:"#0f172a"}}>{stats.totalFindings}</span>, sub: [crits&&`${crits} critical`,highs&&`${highs} high`,meds&&`${meds} medium`,lows&&`${lows} low`].filter(Boolean).join(" · ") },
    { label:"Avg AI Confidence",  value: <span style={{fontSize:28,fontWeight:800,color:"#2563eb"}}>{stats.avgConfidence}%</span>, sub: null },
    { label:"Evidence Items",     value: <span style={{fontSize:28,fontWeight:800,color:"#0f172a"}}>{stats.evidenceCount}</span>, sub: null },
  ];

  return (
    <div style={{ display:"flex", height:"100vh", background:"#f0f4f8" }}>
      <Sidebar />

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Page header */}
        <div style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 32px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:11, color:"#94a3b8", marginBottom:2 }}>Platform / Investigations / Results</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>Threat Hunt Results</div>
          </div>
          <button onClick={() => navigate("/report", { state:{ auditId, results } })}
            style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", background:"#2563eb", border:"none", borderRadius:7, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", boxShadow:"0 1px 4px rgba(37,99,235,0.35)" }}
            onMouseEnter={e => (e.currentTarget.style.background="#1d4ed8")}
            onMouseLeave={e => (e.currentTarget.style.background="#2563eb")}>
            <Download style={{ width:14, height:14 }} />Export Full Report
          </button>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"24px 32px", display:"flex", flexDirection:"column", gap:18 }}>

          {/* Stats */}
          <div style={{ display:"flex", gap:14 }}>
            {statCards.map(({ label, value, sub }) => (
              <div key={label} style={{ flex:1, background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:"16px 18px", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.07em", marginBottom:10 }}>{label.toUpperCase()}</div>
                {value}
                {sub && <div style={{ fontSize:11, color:"#94a3b8", marginTop:5 }}>{sub}</div>}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", overflow:"hidden" }}>
            <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:7 }}>
              <Activity style={{ width:14, height:14, color:"#2563eb" }} />
              <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>EXECUTIVE SUMMARY</span>
            </div>
            <div style={{ padding:"14px 18px", fontSize:13, color:"#475569", lineHeight:1.7 }}>{summary}</div>
          </div>

          {/* Split */}
          <div style={{ display:"flex", gap:16, flex:1, minHeight:400 }}>

            {/* Findings table */}
            <div style={{ flex:"0 0 440px", background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div style={{ padding:"12px 18px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <Target style={{ width:14, height:14, color:"#2563eb" }} />
                  <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>FINDINGS</span>
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:"#2563eb", background:"#eff6ff", border:"1px solid #bfdbfe", padding:"1px 8px", borderRadius:99 }}>{findings.length}</span>
              </div>

              {/* Table header */}
              <div style={{ display:"flex", padding:"8px 18px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
                <span style={{ flex:"0 0 90px", fontSize:11, fontWeight:700, color:"#94a3b8" }}>SEVERITY</span>
                <span style={{ flex:1, fontSize:11, fontWeight:700, color:"#94a3b8" }}>FINDING</span>
                <span style={{ flex:"0 0 60px", fontSize:11, fontWeight:700, color:"#94a3b8", textAlign:"right" }}>CONF.</span>
              </div>

              <div style={{ flex:1, overflowY:"auto" }}>
                {findings.map(f => {
                  const isSelected = sel?.id === f.id;
                  const bc = SEV_BORDER[f.severity] || "#94a3b8";
                  return (
                    <div key={f.id} onClick={() => setSel(f)}
                      style={{ display:"flex", alignItems:"center", padding:"11px 18px", borderBottom:"1px solid #f8fafc", borderLeft:`3px solid ${isSelected ? bc : "transparent"}`, background: isSelected ? "#f8fafc" : "transparent", cursor:"pointer", transition:"background 0.1s" }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background="#fafafa"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background="transparent"; }}>
                      <div style={{ flex:"0 0 90px" }}><SeverityBadge severity={f.severity as any} /></div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color: isSelected ? "#0f172a" : "#374151", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{f.title}</div>
                        <div style={{ fontSize:11, color:"#94a3b8", marginTop:1 }}>{f.affectedEntities.length} hosts · {f.evidenceCount} evidence</div>
                      </div>
                      <div style={{ flex:"0 0 60px", textAlign:"right", fontSize:12, fontWeight:700, color: isSelected ? "#2563eb" : "#94a3b8" }}>{f.confidence}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail */}
            <div style={{ flex:1, background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, boxShadow:"0 1px 3px rgba(0,0,0,0.05)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div style={{ padding:"12px 20px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:7 }}>
                <Shield style={{ width:14, height:14, color:"#2563eb" }} />
                <span style={{ fontSize:12, fontWeight:700, color:"#475569", letterSpacing:"0.06em" }}>FINDING DETAIL</span>
                {sel && <span style={{ marginLeft:"auto", fontSize:11, color:"#94a3b8", fontFamily:"monospace" }}>{sel.id}</span>}
              </div>

              {sel ? (
                <div style={{ flex:1, overflowY:"auto", padding:"20px 20px", display:"flex", flexDirection:"column", gap:18 }}>
                  <div>
                    <div style={{ marginBottom:8 }}><SeverityBadge severity={sel.severity as any} /></div>
                    <h3 style={{ fontSize:16, fontWeight:700, color:"#0f172a", margin:"0 0 8px" }}>{sel.title}</h3>
                    <p style={{ fontSize:13, color:"#64748b", lineHeight:1.7, margin:0 }}>{sel.description}</p>
                  </div>

                  {/* Confidence bar */}
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.06em" }}>AI AGENT CONFIDENCE</span>
                      <span style={{ fontSize:13, fontWeight:700, color:"#2563eb" }}>{sel.confidence}%</span>
                    </div>
                    <div style={{ height:5, borderRadius:99, background:"#f1f5f9" }}>
                      <div style={{ height:"100%", width:`${sel.confidence}%`, borderRadius:99, background: sel.confidence>=80?"#dc2626":sel.confidence>=60?"#d97706":"#16a34a", transition:"width 0.4s" }} />
                    </div>
                  </div>

                  {/* Entities */}
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.06em", marginBottom:8 }}>AFFECTED ENTITIES</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {sel.affectedEntities.map((e,i) => (
                        <span key={i} style={{ fontSize:12, fontFamily:"monospace", color:"#475569", background:"#f8fafc", border:"1px solid #e2e8f0", padding:"3px 10px", borderRadius:6 }}>{e}</span>
                      ))}
                    </div>
                  </div>

                  {/* Evidence */}
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.06em", marginBottom:8 }}>EVIDENCE ({sel.evidenceCount} items)</div>
                    <div style={{ background:"#0f172a", borderRadius:8, overflow:"hidden" }}>
                      {sel.evidence.map((ev,i) => (
                        <div key={i} style={{ padding:"8px 14px", fontSize:12, fontFamily:"monospace", color:"#4ade80", borderBottom: i<sel.evidence.length-1?"1px solid #1e293b":"none", lineHeight:1.5 }}>
                          <span style={{ color:"#334155" }}>{String(i+1).padStart(2,"0")} </span>{ev}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Queries */}
                  {sel.queries.length > 0 && (
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.06em", marginBottom:8 }}>SPL QUERIES EXECUTED</div>
                      {sel.queries.map((q,i) => (
                        <div key={i} style={{ marginBottom:6, padding:"10px 14px", background:"#0f172a", borderRadius:8, fontSize:12, fontFamily:"monospace", color:"#60a5fa", wordBreak:"break-all", lineHeight:1.6 }}>
                          <span style={{ color:"#334155" }}>$ </span>{q}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommendation */}
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"0.06em", marginBottom:8 }}>REMEDIATION GUIDANCE</div>
                    <div style={{ padding:"12px 14px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, fontSize:13, color:"#166534", lineHeight:1.7 }}>
                      {sel.recommendation}
                    </div>
                  </div>

                  <button onClick={() => navigate("/report", { state:{ auditId, results } })}
                    style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, color:"#2563eb", fontSize:13, fontWeight:600, cursor:"pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background="#f8fafc")}
                    onMouseLeave={e => (e.currentTarget.style.background="#fff")}>
                    <FileText style={{ width:14, height:14 }} />View Full Audit Report
                  </button>
                </div>
              ) : (
                <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:10, color:"#cbd5e1" }}>
                  <Target style={{ width:32, height:32 }} />
                  <span style={{ fontSize:13 }}>Select a finding to view details</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
