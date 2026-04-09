import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Shield, LayoutDashboard, Target, AlertOctagon, Cpu,
  Server, FileText, Settings, Activity, Network,
  Clock, Users, BookOpen, ChevronDown, ChevronRight,
  Search as SearchIcon
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: "Platform",
    items: [
      { icon: LayoutDashboard, label: "Overview",          path: "/overview"     },
      { icon: Target,          label: "Threat Hunt",       path: "/"             },
      { icon: SearchIcon,      label: "Investigations",    path: "/investigations" },
      { icon: AlertOctagon,    label: "Incidents",         path: "/incidents", badge: "3" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { icon: Cpu,      label: "AI Agent",     path: "/ai-agent"     },
      { icon: BookOpen, label: "Playbooks",    path: "/playbooks"    },
      { icon: Network,  label: "SIEM Sources", path: "/siem-sources" },
    ],
  },
  {
    title: "Manage",
    items: [
      { icon: Server, label: "Asset Inventory", path: "/assets"   },
      { icon: Users,  label: "Users & Access",  path: "/users"    },
      { icon: Clock,  label: "Audit Timeline",  path: "/timeline" },
    ],
  },
  {
    title: "Output",
    items: [
      { icon: FileText, label: "Reports", path: "/report" },
    ],
  },
];

function isActive(itemPath: string, current: string): boolean {
  if (itemPath === "/") return current === "/" || current === "/audit/in-progress";
  if (itemPath === "/investigations") return current === "/audit/results";
  if (itemPath === "/report") return current === "/report";
  return current === itemPath || current.startsWith(itemPath + "/");
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const current  = location.pathname;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (title: string) =>
    setCollapsed(c => ({ ...c, [title]: !c[title] }));

  return (
    <div style={{
      width: 224, flexShrink: 0, height: "100vh", display: "flex", flexDirection: "column",
      background: "#fff", borderRight: "1px solid #e4e6eb", position: "sticky", top: 0, zIndex: 40,
    }}>

      {/* Logo */}
      <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid #f1f3f6", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Shield style={{ width: 17, height: 17, color: "#fff" }} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            Artife<span style={{ color: "#2563eb" }}>x</span>AI
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em" }}>THREAT INTEL</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0 8px" }}>
        {SECTIONS.map(section => {
          const isClosed = collapsed[section.title];
          return (
            <div key={section.title} style={{ marginBottom: 4 }}>
              {/* Section header */}
              <button
                onClick={() => toggle(section.title)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 16px", background: "none", border: "none", cursor: "pointer" }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                  {section.title}
                </span>
                {isClosed
                  ? <ChevronRight style={{ width: 12, height: 12, color: "#d1d5db" }} />
                  : <ChevronDown  style={{ width: 12, height: 12, color: "#d1d5db" }} />
                }
              </button>

              {/* Section items */}
              {!isClosed && section.items.map(item => {
                const active = isActive(item.path, current);
                const Icon   = item.icon;
                return (
                  <div
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                      display: "flex", alignItems: "center", gap: 9,
                      margin: "1px 8px", padding: "7px 10px", borderRadius: 7,
                      cursor: "pointer",
                      background: active ? "#eff6ff" : "transparent",
                      borderLeft: active ? "3px solid #2563eb" : "3px solid transparent",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f9fafb"; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon style={{ width: 15, height: 15, flexShrink: 0, color: active ? "#2563eb" : "#6b7280" }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#1d4ed8" : "#374151", whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "#ef4444", padding: "1px 6px", borderRadius: 99 }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: "1px solid #f1f3f6", padding: "10px 8px 8px" }}>
        <div
          onClick={() => navigate("/settings")}
          style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 7, cursor: "pointer", margin: "1px 0 8px" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Settings style={{ width: 15, height: 15, color: "#6b7280" }} />
          <span style={{ fontSize: 13, color: "#374151" }}>Settings</span>
        </div>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", background: "#f9fafb", borderRadius: 8, border: "1px solid #f1f3f6" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>A</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Demo User</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ fontSize: 10, color: "#9ca3af" }}>AI Agent Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
