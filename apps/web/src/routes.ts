import { createBrowserRouter } from "react-router";
import { LandingPage }        from "./components/LandingPage";
import { AuditInProgress }    from "./components/AuditInProgress";
import { AuditResults }       from "./components/AuditResults";
import { ReportPreview }      from "./components/ReportPreview";
import { OverviewPage }       from "./components/OverviewPage";
import { InvestigationsPage } from "./components/InvestigationsPage";
import { IncidentsPage }      from "./components/IncidentsPage";
import { AIAgentPage }        from "./components/AIAgentPage";
import { PlaybooksPage }      from "./components/PlaybooksPage";
import { SIEMSourcesPage }    from "./components/SIEMSourcesPage";
import { AssetInventoryPage } from "./components/AssetInventoryPage";
import { UsersPage }          from "./components/UsersPage";
import { TimelinePage }       from "./components/TimelinePage";
import { SettingsPage }       from "./components/SettingsPage";

export const router = createBrowserRouter([
  { path: "/",                  Component: LandingPage        },
  { path: "/audit/in-progress", Component: AuditInProgress    },
  { path: "/audit/results",     Component: AuditResults       },
  { path: "/report",            Component: ReportPreview      },
  { path: "/overview",          Component: OverviewPage       },
  { path: "/investigations",    Component: InvestigationsPage },
  { path: "/incidents",         Component: IncidentsPage      },
  { path: "/ai-agent",          Component: AIAgentPage        },
  { path: "/playbooks",         Component: PlaybooksPage      },
  { path: "/siem-sources",      Component: SIEMSourcesPage    },
  { path: "/assets",            Component: AssetInventoryPage },
  { path: "/users",             Component: UsersPage          },
  { path: "/timeline",          Component: TimelinePage       },
  { path: "/settings",          Component: SettingsPage       },
]);
