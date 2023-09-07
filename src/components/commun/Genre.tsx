import { useContext } from "react";
import { SearchContext } from "src/pages/tmdb/HomeMoviesPage";

export const getListGenre = (listId?: Array<number>) => {
  const { genres } = useContext(SearchContext);

  const value = listId ? listId : [];

  return (
    <>
      {genres
        .filter((genre) => value.includes(genre.id))
        .map((genre) => genre.name)
        .filter((v, i, a) => a.indexOf(v) == i)
        .join(", ")}
    </>
  );
};
