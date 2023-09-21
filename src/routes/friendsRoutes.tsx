import { FriendsPage } from "src/pages/friends/FriendsPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { MyFriendsPage } from "src/pages/friends/MyFriendsPage";
import { AddFriendPage } from "src/pages/friends/AddFriendPage";
import { InvitationFriendPage } from "src/pages/friends/InvitationFriendPage";

export const BASEURLFRIENDS = "/friends";

export const FriendsRoutes = [
  {
    path: BASEURLFRIENDS,
    element: (
      <ProtectedRoute>
        <FriendsPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: BASEURLFRIENDS,
        element: <MyFriendsPage />,
      },
      {
        path: BASEURLFRIENDS + "/add",
        element: <AddFriendPage />,
      },
      {
        path: BASEURLFRIENDS + "/invitation",
        element: <InvitationFriendPage />,
      },
    ],
  },
];
