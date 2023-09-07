import { useRoutes } from "react-router-dom";
import { MovieRoutes } from "./movieRoutes";
import { MainRoutes } from "./mainRoutes";
import { Home } from "src/pages/Home";
import { CommunRoutes } from "./communRoutes";

export default function ThemeRoutes() {
  const HomeRoute = {
    path: "/",
    element: <Home />,
    children: [...CommunRoutes, ...MovieRoutes],
  };

  return useRoutes([HomeRoute, ...MainRoutes]);
}
