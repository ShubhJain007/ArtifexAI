import React from "react";
import { Shield, ArrowLeft, Activity } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== "/";

  return (
    <header style={{ background: "rgba(5, 13, 26, 0.95)", borderBottom: "1px solid rgba(0, 212, 255, 0.12)", backdropFilter: "blur(12px)" }} className="sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition-colors"
                style={{ color: "#64748b", border: "1px solid rgba(0,212,255,0.12)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "#00d4ff";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.3)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "#64748b";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.12)";
                }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="relative">
                <Shield className="w-7 h-7" style={{ color: "#00d4ff" }} />
                <div
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{ background: "radial-gradient(circle, rgba(0,212,255,0.4) 0%, transparent 70%)" }}
                />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight" style={{ color: "#e2e8f0" }}>
                  Artife<span style={{ color: "#00d4ff" }}>x</span>AI
                </span>
                <div className="text-xs leading-none" style={{ color: "#475569", letterSpacing: "0.1em" }}>
                  THREAT INTELLIGENCE
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
              <Activity className="w-3 h-3" />
              <span style={{ letterSpacing: "0.08em" }}>AI READY</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
