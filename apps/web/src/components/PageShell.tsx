import React from "react";
import { Sidebar } from "./Sidebar";

interface PageShellProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
  fullHeight?: boolean;
}

export function PageShell({ title, subtitle, actions, children, noPadding, fullHeight }: PageShellProps) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Page header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e4e6eb", padding: "0 28px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            {subtitle && <div style={{ fontSize: 11, color: "#98a2b3", marginBottom: 1 }}>{subtitle}</div>}
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{title}</div>
          </div>
          {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: fullHeight ? "hidden" : "auto", padding: noPadding || fullHeight ? 0 : "24px 28px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: "#fff", border: "1px solid #e4e6eb", borderRadius: 10,
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)", ...extra,
});

export const badge = (color: string, bg: string, border: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 9px",
  borderRadius: 99, fontSize: 11, fontWeight: 600, color, background: bg, border: `1px solid ${border}`,
  whiteSpace: "nowrap" as const,
});

export const btn = (variant: "primary" | "secondary" | "ghost" = "secondary"): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
  borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
  background: variant === "primary" ? "#1d4ed8" : variant === "ghost" ? "transparent" : "#fff",
  color: variant === "primary" ? "#fff" : "#374151",
  border: variant === "ghost" ? "none" : variant === "primary" ? "none" : "1px solid #e4e6eb",
  boxShadow: variant === "primary" ? "0 1px 4px rgba(29,78,216,0.3)" : "none",
} as React.CSSProperties);
