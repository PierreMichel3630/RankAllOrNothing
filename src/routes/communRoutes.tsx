import { ParameterPage } from "src/pages/ParameterPage";
import { RankPage } from "src/pages/RankPage";
import { SearchThemePage } from "src/pages/SearchThemePage";
import { ThemePage } from "src/pages/ThemePage";
import { TranslatePage } from "src/pages/TranslatePage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ComparePage } from "src/pages/ComparePage";
import { ValuePage } from "src/pages/ValuePage";
import { ThemeTwitchChannelPage } from "src/pages/external/ThemeTwitchChannelPage";
import { ValueExternalPage } from "src/pages/external/ValueExternalPage";

export const CommunRoutes = [
  {
    path: "/",
    element: <SearchThemePage />,
  },
  {
    path: "/theme/:id",
    element: <ThemePage />,
  },
  {
    path: "/external/theme/:id",
    element: <ThemeTwitchChannelPage />,
  },
  {
    path: "/external/theme/:theme/value/:id/statistic",
    element: <ValueExternalPage />,
  },
  {
    path: "/external/theme/:theme/:type/value/:id/statistic",
    element: <ValueExternalPage />,
  },
  {
    path: "/rank",
    element: (
      <ProtectedRoute>
        <RankPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/compare",
    element: (
      <ProtectedRoute>
        <ComparePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/parameter",
    element: (
      <ProtectedRoute>
        <ParameterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/translate",
    element: <TranslatePage />,
  },
  {
    path: "/value/:id",
    element: <ValuePage />,
  },
];
