import { DiscoverPage } from "src/pages/tmdb/DiscoverPage";
import { EpisodePage } from "src/pages/tmdb/EpisodePage";
import { HomeMoviesPage } from "src/pages/tmdb/HomeMoviesPage";
import { MoviePage } from "src/pages/tmdb/MoviePage";
import { PersonPage } from "src/pages/tmdb/PersonPage";
import { SearchPage } from "src/pages/tmdb/SearchPage";
import { SeriePage } from "src/pages/tmdb/SeriePage";
import { TrendingPage } from "src/pages/tmdb/TrendingPage";
import { TrendingSearchPage } from "src/pages/tmdb/TrendingSearchPage";
import { ValuePage } from "src/pages/tmdb/ValuePage";

export const THEMETMDB = 2;
export const BASEURLMOVIE = "/external/theme/2";
export const MovieRoutes = [
  {
    path: BASEURLMOVIE,
    element: <HomeMoviesPage />,
    children: [
      {
        path: BASEURLMOVIE,
        element: <TrendingPage />,
      },
      {
        path: BASEURLMOVIE + "/search",
        element: <SearchPage />,
      },
      {
        path: BASEURLMOVIE + "/movie/:id",
        element: <MoviePage />,
      },
      {
        path: BASEURLMOVIE + "/person/:id",
        element: <PersonPage />,
      },
      {
        path: BASEURLMOVIE + "/tv/:id",
        element: <SeriePage />,
      },
      {
        path: BASEURLMOVIE + "/tv/:id/season/:season/episode/:episode",
        element: <EpisodePage />,
      },
      {
        path: BASEURLMOVIE + "/trendingsearch",
        element: <TrendingSearchPage />,
      },
      {
        path: BASEURLMOVIE + "/discover",
        element: <DiscoverPage />,
      },
    ],
  },
];
