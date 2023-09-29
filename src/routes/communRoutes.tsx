import { ParameterPage } from "src/pages/ParameterPage";
import { RankPage } from "src/pages/RankPage";
import { SearchThemePage } from "src/pages/SearchThemePage";
import { ThemePage } from "src/pages/ThemePage";
import { TranslatePage } from "src/pages/TranslatePage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ComparePage } from "src/pages/ComparePage";

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
];
