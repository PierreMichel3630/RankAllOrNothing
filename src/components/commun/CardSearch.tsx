import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getListGenre } from "./Genre";

import moment from "moment";
import { Link } from "react-router-dom";
import { style } from "typestyle";
import { percent, px } from "csx";
import { ImageNotFoundBlock } from "./ImageBlock";
import { MovieSearchElement } from "src/models/tmdb/movie/MovieSearchElement";
import { PersonSearchElement } from "src/models/tmdb/person/PersonSearchElement";
import { TvSearchElement } from "src/models/tmdb/tv/TvSearchElement";
import { MediaType } from "src/models/tmdb/enum";
import { VoteBadge } from "./VoteBadge";
import { useContext, useEffect, useState } from "react";
import { BASEURLMOVIE, THEMETMDB } from "src/routes/movieRoutes";
import { getRanksByIdExtern } from "src/api/supabase/rank";
import { Rank } from "src/models/Rank";
import {
  ItemToCheck,
  ItemToRank,
  RankContext,
} from "src/pages/tmdb/HomeMoviesPage";

import StarRateIcon from "@mui/icons-material/StarRate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { RankBadge } from "./RankBadge";

const cardCss = style({
  cursor: "pointer",
  height: percent(100),
  display: "flex",
  flexDirection: "column",
  position: "relative",
});

interface PropsSearch {
  value: MovieSearchElement | PersonSearchElement | TvSearchElement;
}
export const CardSearch = ({ value }: PropsSearch) => {
  const getCardType = (
    value: MovieSearchElement | PersonSearchElement | TvSearchElement
  ) => {
    switch (value.media_type) {
      case MediaType.tv:
        return <CardTvSearch value={value as TvSearchElement} />;
      case MediaType.movie:
        return <CardMovieSearch value={value as MovieSearchElement} />;
      case MediaType.person:
        return <CardPersonSearch value={value as PersonSearchElement} />;
      default:
        return <CardTvSearch value={value as TvSearchElement} />;
    }
  };

  return getCardType(value);
};

interface PropsMovieSearch {
  value: MovieSearchElement;
}

export const CardMovieSearch = ({ value }: PropsMovieSearch) => {
  const { t } = useTranslation();
  const { setItemToRank, setItemToCheck, refresh, setRefresh } =
    useContext(RankContext);

  const [rank, setRank] = useState<null | Rank>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(true);

  const getRank = async () => {
    if (value) {
      const { data } = await getRanksByIdExtern(
        value.id,
        THEMETMDB,
        MediaType.movie
      );
      setRank(data as Rank);
      setIsLoadingRank(false);
    }
  };

  useEffect(() => {
    if (refresh && refresh === value.id) {
      setIsLoadingRank(true);
      getRank();
      setRefresh(undefined);
    }
  }, [refresh]);

  useEffect(() => {
    setIsLoadingRank(true);
    getRank();
  }, [value]);

  const rankMovie = (event: any) => {
    event.preventDefault();
    if (value) {
      const item: ItemToRank = {
        id: value.id,
        name: value.title,
        description: value.overview,
        image: `https://image.tmdb.org/t/p/original${value.backdrop_path}`,
        type: MediaType.movie,
      };
      setItemToRank(item);
    }
  };

  const checkMovie = (event: any, isSee: boolean) => {
    event.preventDefault();
    if (value) {
      const item: ItemToCheck = {
        id: value.id,
        name: value.title,
        description: value.overview,
        image: `https://image.tmdb.org/t/p/original${value.backdrop_path}`,
        type: MediaType.movie,
        isSee,
        idRank: rank !== null ? rank.id : undefined,
      };
      setItemToCheck(item);
    }
  };

  const isCheck = rank !== null;

  return (
    <Link to={`${BASEURLMOVIE}/movie/${value.id}`}>
      <Card className={cardCss}>
        <>
          {rank && (
            <div
              style={{
                position: "absolute",
                top: percent(2),
                left: percent(2),
              }}
            >
              <RankBadge rank={rank.rank} />
            </div>
          )}
          {value.poster_path !== null ? (
            <CardMedia
              sx={{ aspectRatio: "2/3" }}
              image={`https://image.tmdb.org/t/p/w500${value.poster_path}`}
              title={value.title}
            />
          ) : (
            <ImageNotFoundBlock style={{ aspectRatio: "2/3" }} />
          )}
          <CardContent sx={{ position: "relative", mt: 1, p: 1, pb: 0 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: percent(2),
                transform: "translate(0%,-90%)",
              }}
            >
              <VoteBadge
                value={
                  rank && rank.notation ? rank.notation : value.vote_average
                }
              />
            </div>
            <Typography variant="h4">{value.title}</Typography>
            <Typography>{moment(value.release_date).format("YYYY")}</Typography>
            <Typography>{getListGenre(value.genre_ids)}</Typography>
          </CardContent>
          <CardActions
            disableSpacing
            sx={{
              justifyContent: "flex-end",
              display: "flex",
              gap: px(5),
              mt: "auto",
            }}
          >
            {!isLoadingRank && (
              <>
                {isCheck ? (
                  <Tooltip title={t("commun.notseemovie")}>
                    <IconButton
                      aria-label="Check"
                      size="small"
                      onClick={(event) => checkMovie(event, false)}
                    >
                      <VisibilityOffIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("commun.seemovie")}>
                    <IconButton
                      aria-label="Check"
                      size="small"
                      onClick={(event) => checkMovie(event, true)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title={t("commun.rankmovie")}>
                  <IconButton
                    aria-label="Rate"
                    size="small"
                    onClick={(event) => rankMovie(event)}
                  >
                    <StarRateIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </CardActions>
        </>
      </Card>
    </Link>
  );
};

interface PropsTvSearch {
  value: TvSearchElement;
}

export const CardTvSearch = ({ value }: PropsTvSearch) => {
  const { t } = useTranslation();
  const { setItemToRank, setItemToCheck, refresh, setRefresh } =
    useContext(RankContext);

  const [rank, setRank] = useState<null | Rank>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(true);

  const getRank = async () => {
    if (value) {
      const { data } = await getRanksByIdExtern(
        value.id,
        THEMETMDB,
        MediaType.tv
      );
      setRank(data as Rank);
      setIsLoadingRank(false);
    }
  };

  useEffect(() => {
    if (refresh && refresh === value.id) {
      setIsLoadingRank(true);
      getRank();
      setRefresh(undefined);
    }
  }, [refresh]);

  useEffect(() => {
    setIsLoadingRank(true);
    getRank();
  }, [value]);

  const rankTv = (event: any) => {
    event.preventDefault();
    if (value) {
      const item: ItemToRank = {
        id: value.id,
        name: value.name,
        description: value.overview,
        image: `https://image.tmdb.org/t/p/original${value.backdrop_path}`,
        type: MediaType.tv,
      };
      setItemToRank(item);
    }
  };

  const checkTv = (event: any, isSee: boolean) => {
    event.preventDefault();
    if (value) {
      const item: ItemToCheck = {
        id: value.id,
        name: value.name,
        description: value.overview,
        image: `https://image.tmdb.org/t/p/original${value.backdrop_path}`,
        type: MediaType.tv,
        isSee,
        idRank: rank !== null ? rank.id : undefined,
      };
      setItemToCheck(item);
    }
  };

  const isCheck = rank !== null;

  return (
    <Link to={`${BASEURLMOVIE}/tv/${value.id}`}>
      <Card className={cardCss}>
        <>
          {rank && (
            <div
              style={{
                position: "absolute",
                top: percent(2),
                left: percent(2),
              }}
            >
              <RankBadge rank={rank.rank} />
            </div>
          )}
          {value.poster_path !== null ? (
            <CardMedia
              sx={{ aspectRatio: "2/3" }}
              image={`https://image.tmdb.org/t/p/w500${value.poster_path}`}
              title={value.name}
            />
          ) : (
            <ImageNotFoundBlock style={{ aspectRatio: "2/3" }} />
          )}
          <CardContent sx={{ position: "relative", mt: 1, p: 1, pb: 0 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: percent(2),
                transform: "translate(0%,-90%)",
              }}
            >
              <VoteBadge value={value.vote_average} />
            </div>
            <Typography variant="h4">{value.name}</Typography>
            <Typography variant="body1">
              {moment(value.first_air_date).format("YYYY")}
            </Typography>
            <Typography variant="body1">
              {getListGenre(value.genre_ids)}
            </Typography>
          </CardContent>
          <CardActions
            disableSpacing
            sx={{
              justifyContent: "flex-end",
              display: "flex",
              gap: px(5),
              mt: "auto",
            }}
          >
            {!isLoadingRank && (
              <>
                {isCheck ? (
                  <Tooltip title={t("commun.notseeserie")}>
                    <IconButton
                      aria-label="Check"
                      size="small"
                      onClick={(event) => checkTv(event, false)}
                    >
                      <VisibilityOffIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("commun.seeserie")}>
                    <IconButton
                      aria-label="Check"
                      size="small"
                      onClick={(event) => checkTv(event, true)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title={t("commun.rankserie")}>
                  <IconButton
                    aria-label="Rate"
                    size="small"
                    onClick={(event) => rankTv(event)}
                  >
                    <StarRateIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </CardActions>
        </>
      </Card>
    </Link>
  );
};

interface PropsPersonSearch {
  value: PersonSearchElement;
}

export const CardPersonSearch = ({ value }: PropsPersonSearch) => {
  const { t } = useTranslation();
  const { setItemToRank, setItemToCheck, refresh, setRefresh } =
    useContext(RankContext);

  const [rank, setRank] = useState<null | Rank>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(true);

  const getRank = async () => {
    if (value) {
      const { data } = await getRanksByIdExtern(
        value.id,
        THEMETMDB,
        MediaType.person
      );
      setRank(data as Rank);
      setIsLoadingRank(false);
    }
  };

  useEffect(() => {
    if (refresh && refresh === value.id) {
      setIsLoadingRank(true);
      getRank();
      setRefresh(undefined);
    }
  }, [refresh]);

  useEffect(() => {
    setIsLoadingRank(true);
    getRank();
  }, [value]);

  const rankPerson = (event: any) => {
    event.preventDefault();
    if (value) {
      const item: ItemToRank = {
        id: value.id,
        name: value.name,
        description: "",
        image: `https://image.tmdb.org/t/p/original${value.profile_path}`,
        type: MediaType.person,
      };
      setItemToRank(item);
    }
  };

  const checkPerson = (event: any, isSee: boolean) => {
    event.preventDefault();
    if (value) {
      const item: ItemToCheck = {
        id: value.id,
        name: value.name,
        description: "",
        image: `https://image.tmdb.org/t/p/original${value.profile_path}`,
        type: MediaType.person,
        isSee,
        idRank: rank !== null ? rank.id : undefined,
      };
      setItemToCheck(item);
    }
  };

  const isCheck = rank !== null;

  return (
    <Link to={`${BASEURLMOVIE}/person/${value.id}`}>
      <Card className={cardCss}>
        <>
          {rank && (
            <div
              style={{
                position: "absolute",
                top: percent(2),
                left: percent(2),
              }}
            >
              <RankBadge rank={rank.rank} />
            </div>
          )}
          {value.profile_path !== null ? (
            <CardMedia
              sx={{ aspectRatio: "2/3" }}
              image={`https://image.tmdb.org/t/p/w500${value.profile_path}`}
              title={value.name}
            />
          ) : (
            <ImageNotFoundBlock style={{ aspectRatio: "2/3" }} />
          )}
          <CardContent sx={{ position: "relative", mt: 1, p: 1, pb: 0 }}>
            <Typography variant="h4">{value.name}</Typography>
            <Typography variant="body1">
              {value.known_for_department}
            </Typography>
            <Typography variant="h6">{t("card.knowfor")}</Typography>
            <Typography
              variant="caption"
              color="secondary"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 4,
              }}
            >
              {value.known_for.map((el) => el.title).join(", ")}
            </Typography>
          </CardContent>
          <CardActions
            disableSpacing
            sx={{
              justifyContent: "flex-end",
              display: "flex",
              gap: px(5),
              mt: "auto",
            }}
          >
            {!isLoadingRank && (
              <>
                {isCheck ? (
                  <Tooltip title={t("commun.notseeactor")}>
                    <IconButton
                      aria-label="Check"
                      size="small"
                      onClick={(event) => checkPerson(event, false)}
                    >
                      <VisibilityOffIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("commun.seeactor")}>
                    <IconButton
                      aria-label="Check"
                      size="small"
                      onClick={(event) => checkPerson(event, true)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title={t("commun.rankactor")}>
                  <IconButton
                    aria-label="Rate"
                    size="small"
                    onClick={(event) => rankPerson(event)}
                  >
                    <StarRateIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </CardActions>
        </>
      </Card>
    </Link>
  );
};
