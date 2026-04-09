import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

type RiskLevel = "low" | "medium" | "high" | "critical";

const CFG = {
  low:      { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", label: "Low Risk",      icon: CheckCircle  },
  medium:   { color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Medium Risk",   icon: AlertTriangle },
  high:     { color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", label: "High Risk",     icon: AlertCircle  },
  critical: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Critical Risk", icon: ShieldAlert  },
};

export function RiskLevelBadge({ level, large = false, className = "" }: { level: RiskLevel; large?: boolean; className?: string }) {
  const c = CFG[level] ?? CFG.medium;
  const Icon = c.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: large ? "6px 14px" : "4px 10px",
      borderRadius: 99, fontSize: large ? 13 : 12, fontWeight: 700,
      color: c.color, background: c.bg, border: `1px solid ${c.border}`,
      whiteSpace: "nowrap",
    }}>
      <Icon style={{ width: large ? 16 : 13, height: large ? 16 : 13 }} />
      {c.label}
    </span>
  );
}
