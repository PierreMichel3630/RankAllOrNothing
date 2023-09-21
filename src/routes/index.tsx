import { useRoutes } from "react-router-dom";
import { MovieRoutes } from "./movieRoutes";
import { MainRoutes } from "./mainRoutes";
import { Home } from "src/pages/Home";
import { CommunRoutes } from "./communRoutes";
import { FriendsRoutes } from "./friendsRoutes";
import { UserRoutes } from "./userRoutes";

export default function ThemeRoutes() {
  const HomeRoute = {
    path: "/",
    element: <Home />,
    children: [
      ...CommunRoutes,
      ...MovieRoutes,
      ...FriendsRoutes,
      ...UserRoutes,
    ],
  };

  return useRoutes([HomeRoute, ...MainRoutes]);
}
