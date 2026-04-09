import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { PageShell } from "./PageShell";
import { CheckCircle2, Circle, Loader2, XCircle, Database, Package, FileText, Search, Zap } from "lucide-react";
import { api, type LogEntry } from "../lib/api";

type SS = "pending" | "in-progress" | "complete" | "failed";

const STAGES = [
  { id: "coverage",  label: "Coverage Analysis",  desc: "Validating SIEM connectivity & log sources", Icon: Database },
  { id: "selecting", label: "Hunt Selection",      desc: "Loading AI Agent threat playbooks",          Icon: Search   },
  { id: "running",   label: "Active Threat Hunt",  desc: "AI Agent executing SPL queries",            Icon: Zap      },
  { id: "packaging", label: "Evidence Collection", desc: "Packaging findings & artifacts",            Icon: Package  },
  { id: "report",    label: "Report Generation",   desc: "Compiling executive summary",               Icon: FileText },
];

const STORAGE_KEY = "artifex_hunt_state";

// Only save serialisable fields — Icon components can't survive JSON.stringify
function saveState(auditId: string, progress: number, logs: LogEntry[], stageStatuses: SS[], t0: number, error: string | null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ auditId, progress, logs, stageStatuses, t0, error }));
  } catch { /* quota exceeded — ignore */ }
}

function loadSaved(auditId: string | undefined) {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    // Only restore if it belongs to this exact hunt
    if (!raw || raw.auditId !== auditId) return null;
    return raw;
  } catch { return null; }
}

export function AuditInProgress() {
  const navigate = useNavigate();
  const location = useLocation();
  const auditId  = (location.state?.auditId ?? localStorage.getItem("inProgressAuditId")) as string | undefined;
  const logsEnd  = useRef<HTMLDivElement>(null);

  // Restore saved state immediately so there's no flicker on re-visit.
  // Icons are never stored — always taken from STAGES constant.
  const saved = loadSaved(auditId);
  const t0 = useRef<number>(saved?.t0 ?? Date.now());

  const [stages, setStages] = useState(
    STAGES.map((s, i) => ({ ...s, status: (saved?.stageStatuses?.[i] ?? "pending") as SS }))
  );
  const [progress, setProgress] = useState<number>(saved?.progress ?? 0);
  const [logs,     setLogs]     = useState<LogEntry[]>(saved?.logs ?? []);
  const [error,    setError]    = useState<string | null>(saved?.error ?? null);
  const [elapsed,  setElapsed]  = useState<number>(
    saved ? Math.floor((Date.now() - saved.t0) / 1000) : 0
  );

  useEffect(() => {
    const t = setInterval(() => {
      const e = Math.floor((Date.now() - t0.current) / 1000);
      setElapsed(e);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { logsEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  useEffect(() => {
    if (!auditId) { setError("No audit session"); setTimeout(() => navigate("/"), 2000); return; }

    // Persist the auditId so we can return to this page after navigating away
    localStorage.setItem("inProgressAuditId", auditId);

    const iv = setInterval(async () => {
      try {
        const s = await api.audit.status(auditId);
        if (!s.ok) { setError(s.error?.message || "Error"); clearInterval(iv); return; }

        const order = ["coverage", "selecting", "running", "packaging", "report"];
        const ci = order.indexOf(s.stage);
        const nextStages = STAGES.map((st, i) => {
          if (s.stage === "failed") {
            // find which was in-progress in the saved state
            const fi = order.indexOf(s.stage);
            if (i < ci) return { ...st, status: "complete" as SS };
            if (i === ci) return { ...st, status: "failed" as SS };
            return { ...st, status: "pending" as SS };
          }
          if (i < ci) return { ...st, status: "complete" as SS };
          if (i === ci) return { ...st, status: s.stage === "complete" ? "complete" : "in-progress" as SS };
          return { ...st, status: "pending" as SS };
        });

        const nextStatuses = nextStages.map(st => st.status);
        setProgress(s.progress);
        setLogs(s.logs);
        setStages(nextStages);
        // Save only serialisable data (no Icon functions)
        saveState(auditId, s.progress, s.logs, nextStatuses, t0.current, null);

        if (s.stage === "failed") {
          clearInterval(iv);
          setError("Hunt aborted — see terminal log");
          saveState(auditId, s.progress, s.logs, nextStatuses, t0.current, "Hunt aborted");
          localStorage.removeItem("inProgressAuditId");
        }
        if (s.stage === "complete") {
          clearInterval(iv);
          localStorage.setItem("lastAuditId", auditId);
          localStorage.removeItem("inProgressAuditId");
          saveState(auditId, 100, s.logs, nextStatuses, t0.current, null);
          // Pre-fetch and cache results NOW so the results page loads instantly
          api.audit.results(auditId).then(r => {
            if (r.ok) localStorage.setItem("artifex_last_results", JSON.stringify(r));
          }).catch(() => {});
          setTimeout(() => navigate("/audit/results", { state: { auditId } }), 1200);
        }
      } catch (e) { setError(e instanceof Error ? e.message : "Connection lost"); clearInterval(iv); }
    }, 1000);

    return () => clearInterval(iv);
  }, [auditId, navigate]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const done   = stages.filter(s => s.status === "complete").length;
  const active = stages.find(s => s.status === "in-progress");

  return (
    <PageShell
      title="AI Agent Hunt In Progress"
      subtitle="Platform / Threat Hunt / Active"
      fullHeight
      actions={
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280" }}>
          <span>Session: <strong style={{ color: "#111827", fontFamily: "monospace" }}>{auditId?.slice(-10).toUpperCase() || "—"}</strong></span>
          <span>Elapsed: <strong style={{ color: "#111827" }}>{fmt(elapsed)}</strong></span>
          <span>Stages: <strong style={{ color: "#111827" }}>{done}/{STAGES.length}</strong></span>
        </div>
      }
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

        {/* Status strip */}
        <div style={{
          background: error ? "#fef2f2" : progress >= 100 ? "#f0fdf4" : "#fffbeb",
          borderBottom: `1px solid ${error ? "#fecaca" : progress >= 100 ? "#bbf7d0" : "#fde68a"}`,
          padding: "8px 28px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
        }}>
          {error
            ? <><XCircle style={{ width: 13, height: 13, color: "#dc2626" }} /><span style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>Hunt failed — {error}</span><button onClick={() => navigate("/")} style={{ marginLeft: "auto", fontSize: 12, color: "#dc2626", background: "#fff", border: "1px solid #fecaca", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>← Restart</button></>
            : progress >= 100
            ? <><CheckCircle2 style={{ width: 13, height: 13, color: "#16a34a" }} /><span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>Hunt complete — redirecting to results...</span></>
            : <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", display: "inline-block", animation: "pulse-dot 1.5s infinite" }} /><span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>AI Agent actively hunting threats{active ? ` — ${active.desc}` : ""}</span></>
          }
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* LEFT — Pipeline */}
          <div style={{ width: 300, flexShrink: 0, borderRight: "1px solid #e4e6eb", background: "#fff", display: "flex", flexDirection: "column" }}>
            {/* Progress */}
            <div style={{ padding: "20px 20px", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Overall Progress</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#2563eb" }}>{progress}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: "#f3f4f6", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, borderRadius: 99, background: "linear-gradient(90deg,#2563eb,#7c3aed)", transition: "width 0.5s ease" }} />
              </div>
            </div>

            {/* Stages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: 10 }}>PIPELINE STAGES</div>
              {stages.map((st, i) => {
                const Icon = st.Icon;
                const isDone   = st.status === "complete";
                const isActive = st.status === "in-progress";
                const isFailed = st.status === "failed";
                return (
                  <div key={st.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, background: isActive ? "#eff6ff" : "transparent", border: `1px solid ${isActive ? "#bfdbfe" : "transparent"}`, transition: "all 0.2s" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDone ? "#2563eb" : isActive ? "#eff6ff" : isFailed ? "#fef2f2" : "#f3f4f6", border: isActive ? "2px solid #2563eb" : "none" }}>
                        {isDone   && <CheckCircle2 style={{ width: 14, height: 14, color: "#fff" }} />}
                        {isActive && <Loader2 style={{ width: 13, height: 13, color: "#2563eb", animation: "spin 1s linear infinite" }} />}
                        {isFailed && <XCircle style={{ width: 14, height: 14, color: "#dc2626" }} />}
                        {st.status === "pending" && <Circle style={{ width: 14, height: 14, color: "#d1d5db" }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: isDone ? "#374151" : isActive ? "#1d4ed8" : isFailed ? "#dc2626" : "#9ca3af" }}>{st.label}</div>
                        <div style={{ fontSize: 11, color: isActive ? "#3b82f6" : "#9ca3af" }}>{st.desc}</div>
                      </div>
                      <Icon style={{ width: 13, height: 13, color: isDone ? "#2563eb" : isActive ? "#2563eb" : "#d1d5db" }} />
                    </div>
                    {i < stages.length - 1 && <div style={{ width: 1, height: 8, background: isDone ? "#bfdbfe" : "#f3f4f6", margin: "0 0 0 23px" }} />}
                  </div>
                );
              })}
            </div>

            {/* Meta */}
            <div style={{ padding: "12px 18px", borderTop: "1px solid #f3f4f6" }}>
              {[["AI Engine","Claude AI Agent"],["Query Lang","SPL (Splunk)"],["Mode","Autonomous"],["Access","Read-Only"]].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12, borderBottom: "1px solid #f9fafb" }}>
                  <span style={{ color: "#9ca3af" }}>{k}</span>
                  <span style={{ color: "#374151", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Terminal */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "0 20px", height: 38, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1e293b", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#475569", marginLeft: 4 }}>ai-agent — threat-hunt — {auditId?.slice(-8) || "session"}</span>
              </div>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#334155" }}>{logs.length} events</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", background: "#0f172a", fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", fontSize: 12, lineHeight: 1.7 }}>
              {logs.length === 0
                ? <span style={{ color: "#334155" }}>Initializing AI Agent hunt session...<span style={{ animation: "blink 1s step-end infinite", color: "#3b82f6" }}>█</span></span>
                : logs.map((e, i) => {
                    const isErr   = e.level === "error";
                    const isQuery = e.message.includes("SPL:") || e.message.includes("Executing query");
                    const isAgent = e.message.includes("LLM") || e.message.includes("iteration") || e.message.includes("LLM");
                    let color = "#4ade80";
                    if (isErr)   color = "#f87171";
                    else if (isQuery) color = "#60a5fa";
                    else if (isAgent) color = "#c084fc";
                    return <div key={i} style={{ color, marginBottom: 1 }}>{e.message.replace(/\bLLM\b/g, "AI Agent")}</div>;
                  })
              }
              {!error && progress < 100 && logs.length > 0 && <span style={{ color: "#3b82f6", animation: "blink 1s step-end infinite" }}>█</span>}
              <div ref={logsEnd} />
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </PageShell>
  );
}
