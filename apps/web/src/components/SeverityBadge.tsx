import React from "react";

type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";

const CFG: Record<SeverityLevel, { color: string; bg: string; border: string; dot: string; label: string }> = {
  critical: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", dot: "#dc2626", label: "Critical" },
  high:     { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", dot: "#ea580c", label: "High"     },
  medium:   { color: "#d97706", bg: "#fffbeb", border: "#fde68a", dot: "#d97706", label: "Medium"   },
  low:      { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", dot: "#16a34a", label: "Low"      },
  info:     { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", dot: "#2563eb", label: "Info"     },
};

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  const c = CFG[severity] ?? CFG.info;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600,
      color: c.color, background: c.bg, border: `1px solid ${c.border}`,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  );
}
