import { Container, Grid, IconButton } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "src/App";
import { getMovieGenre, getTvGenre } from "src/api/tmdb/commun";
import { Genre } from "src/models/tmdb/commun/Genre";
import { MediaType } from "src/models/tmdb/enum";
import { useQuery } from "src/utils/hook";
import { SearchInput } from "src/components/commun/Input";
import { BASEURLMOVIE, THEMETMDB } from "src/routes/movieRoutes";

import { MessageSnackbar } from "src/components/commun/Snackbar";
import { RankTMDBDialog } from "src/components/dialog/RankTMDBDialog";

import MovieIcon from "@mui/icons-material/Movie";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  countRanksByThemeAndType,
  deleteRank,
  insertCheck,
} from "src/api/supabase/rank";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";

export const SearchContext = createContext<{
  type: MediaType | undefined;
  query: string;
  genres: Array<Genre>;
  setQuery: (query: string) => void;
  setType: (type: MediaType | undefined) => void;
}>({
  type: undefined,
  query: "",
  genres: [],
  setQuery: (query: string) => {},
  setType: (type: MediaType | undefined) => {},
});

export interface ItemToRank {
  type: MediaType;
  name: string;
  description: string;
  image: string;
  id: number;
}

export interface ItemToCheck {
  type: MediaType;
  name: string;
  description: string;
  image: string;
  id: number;
  isSee: boolean;
  idRank?: number;
}

export const RankContext = createContext<{
  itemToRank: undefined | ItemToRank;
  itemToCheck: undefined | ItemToCheck;
  refresh: undefined | number;
  setItemToRank: (value: ItemToRank | undefined) => void;
  setItemToCheck: (value: ItemToCheck | undefined) => void;
  setRefresh: (value: undefined | number) => void;
}>({
  itemToRank: undefined,
  itemToCheck: undefined,
  refresh: undefined,
  setItemToRank: (value: ItemToRank | undefined) => {},
  setItemToCheck: (value: ItemToCheck | undefined) => {},
  setRefresh: (value: undefined | number) => {},
});

export const HomeMoviesPage = () => {
  const DEFAULTPAGE = 1;
  const params = useQuery();
  const { user } = useAuth();
  const { language } = useContext(UserContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [itemToRank, setItemToRank] = useState<ItemToRank | undefined>(
    undefined
  );
  const [itemToCheck, setItemToCheck] = useState<ItemToCheck | undefined>(
    undefined
  );
  const [refresh, setRefresh] = useState<undefined | number>(undefined);
  const [message, setMessage] = useState("");
  const [openModalRate, setOpenModalRate] = useState(false);

  const [query, setQuery] = useState(
    params.has("query") ? (params.get("query") as string) : ""
  );
  const [type, setType] = useState<MediaType | undefined>(
    params.has("type") ? (params.get("type") as MediaType) : undefined
  );
  const [genres, setGenres] = useState<Array<Genre>>([]);

  useEffect(() => {
    Promise.all([getTvGenre(language.iso), getMovieGenre(language.iso)]).then(
      (res) => {
        setGenres([
          ...res[0].genres.map((el) => ({ ...el, type: MediaType.tv })),
          ...res[1].genres.map((el) => ({ ...el, type: MediaType.movie })),
        ]);
      }
    );
  }, [language]);

  const submitSearch = () => {
    navigate({
      pathname: `${BASEURLMOVIE}/search`,
      search: `?query=${query}&page=${DEFAULTPAGE}${
        type ? `&type=${type}` : ""
      }`,
    });
  };

  const clearSearch = () => {
    setQuery("");
  };

  useEffect(() => {
    if (itemToRank) {
      if (user !== null) {
        setOpenModalRate(itemToRank !== undefined);
      } else {
        navigate("/login");
        setItemToRank(undefined);
      }
    }
  }, [itemToRank]);

  const closeModalRank = () => {
    setOpenModalRate(false);
    setItemToRank(undefined);
  };

  const validateRank = (id: number) => {
    closeModalRank();
    setRefresh(id);
    setItemToRank(undefined);
  };

  const checkValue = async (value: ItemToCheck) => {
    const res = await countRanksByThemeAndType(Number(THEMETMDB), value.type);
    const rank = res.count !== null ? Number(res.count + 1) : 1;
    const { error } = await insertCheck({
      id_extern: value.id.toString(),
      type: value.type.toString(),
      theme: THEMETMDB,
      rank,
    });
    if (error) {
      setMessage(t("commun.error"));
      setItemToCheck(undefined);
      setRefresh(value.id);
    } else {
      setMessage("");
      setItemToCheck(undefined);
      setRefresh(value.id);
    }
  };

  const removeRank = async (value: ItemToCheck) => {
    if (value.idRank) {
      const { error } = await deleteRank(value.idRank);
      if (error) {
        setMessage(t("commun.error"));
        setItemToCheck(undefined);
        setRefresh(value.id);
      } else {
        setMessage("");
        setItemToCheck(undefined);
        setRefresh(value.id);
      }
    }
  };

  useEffect(() => {
    if (itemToCheck) {
      itemToCheck.isSee ? checkValue(itemToCheck) : removeRank(itemToCheck);
      if (user !== null) {
        itemToCheck.isSee ? checkValue(itemToCheck) : removeRank(itemToCheck);
      } else {
        navigate("/login");
        setItemToCheck(undefined);
      }
    }
  }, [itemToCheck]);

  return (
    <RankContext.Provider
      value={{
        itemToRank,
        setItemToRank,
        itemToCheck,
        setItemToCheck,
        refresh,
        setRefresh,
      }}
    >
      <SearchContext.Provider
        value={{ type, setType, query, genres, setQuery }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Container maxWidth="lg">
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Link to={BASEURLMOVIE}>
                    <IconButton>
                      <MovieIcon fontSize="large" />
                    </IconButton>
                  </Link>
                </Grid>
                <Grid item xs>
                  <SearchInput
                    onChange={(value) => setQuery(value)}
                    submit={submitSearch}
                    value={query}
                    clear={clearSearch}
                  />
                </Grid>
                <Grid item>
                  <Link to="/rank?theme=2">
                    <IconButton>
                      <EmojiEventsIcon fontSize="large" />
                    </IconButton>
                  </Link>
                </Grid>
              </Grid>
            </Container>
          </Grid>
          <Grid item xs={12}>
            <Outlet />
          </Grid>
          {itemToRank && (
            <RankTMDBDialog
              open={openModalRate}
              close={closeModalRank}
              value={itemToRank}
              validate={validateRank}
            />
          )}
          <MessageSnackbar
            open={message !== ""}
            handleClose={() => setMessage("")}
            message={message}
          />
        </Grid>
      </SearchContext.Provider>
    </RankContext.Provider>
  );
};