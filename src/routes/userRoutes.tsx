import { ProfilePage } from "src/pages/ProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";

export const UserRoutes = [
  {
    path: "/user/:id",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
];
