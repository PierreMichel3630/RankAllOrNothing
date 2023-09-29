import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { style } from "typestyle";
import { ImageNotFoundBlock } from "../commun/ImageBlock";
import { PersonCrew } from "src/models/tmdb/person/PersonCrew";
import { PersonCastMovie } from "src/models/tmdb/person/PersonCastMovie";
import { PersonCastTv } from "src/models/tmdb/person/PersonCastTv";
import { MediaType } from "src/models/tmdb/enum";
import { BASEURLMOVIE, THEMETMDB } from "src/routes/movieRoutes";
import {
  ItemToCheck,
  ItemToRank,
  RankContext,
} from "src/pages/tmdb/HomeMoviesPage";
import { useContext, useEffect, useState } from "react";
import { getRanksByIdExtern } from "src/api/supabase/rank";
import { Rank } from "src/models/Rank";

import StarRateIcon from "@mui/icons-material/StarRate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "src/context/AuthProviderSupabase";

const cardCss = style({
  cursor: "pointer",
  height: percent(100),
  display: "flex",
  flexDirection: "column",
});

interface PropsCast {
  value: PersonCastTv | PersonCastMovie;
  type: MediaType;
}

export const CastPersonCard = ({ value, type }: PropsCast) => {
  return type === MediaType.movie ? (
    <CastPersonMovieCard value={value as PersonCastMovie} />
  ) : (
    <CastPersonTvCard value={value as PersonCastTv} />
  );
};

interface PropsCastTv {
  value: PersonCastTv;
}
export const CastPersonTvCard = ({ value }: PropsCastTv) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { setItemToRank, setItemToCheck, refresh, setRefresh } =
    useContext(RankContext);

  const [rank, setRank] = useState<null | Rank>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(true);

  const getRank = async () => {
    if (value && user) {
      const { data } = await getRanksByIdExtern(
        user.id,
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
  }, [value, user]);

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
          <Typography variant="h4">{value.name}</Typography>
          <Typography variant="body1">{value.character}</Typography>
          <Typography variant="h6">
            {value.first_air_date !== ""
              ? moment(value.first_air_date).format("YYYY")
              : t("commun.datenotknow")}
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
      </Card>
    </Link>
  );
};

interface PropsCastMovie {
  value: PersonCastMovie;
}

export const CastPersonMovieCard = ({ value }: PropsCastMovie) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { setItemToRank, setItemToCheck, refresh, setRefresh } =
    useContext(RankContext);

  const [rank, setRank] = useState<null | Rank>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(true);

  const getRank = async () => {
    if (value && user) {
      const { data } = await getRanksByIdExtern(
        user.id,
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
  }, [value, user]);

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
          <Typography variant="h4">{value.title}</Typography>
          <Typography variant="body1">{value.character}</Typography>
          <Typography variant="h6">
            {value.release_date !== ""
              ? moment(value.release_date).format("YYYY")
              : t("commun.datenotknow")}
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
      </Card>
    </Link>
  );
};

interface PropsCrew {
  value: PersonCrew;
}

export const CrewPersonCard = ({ value }: PropsCrew) => (
  <Link to={`${BASEURLMOVIE}/person/${value.id}`}>
    <Card className={cardCss}>
      {value.poster_path !== null ? (
        <CardMedia
          sx={{ aspectRatio: "2/3" }}
          image={`https://image.tmdb.org/t/p/w500${value.poster_path}`}
          title={value.title}
        />
      ) : (
        <ImageNotFoundBlock style={{ aspectRatio: "2/3" }} />
      )}
      <CardContent>
        <Typography variant="h4">{value.title}</Typography>
        <Typography variant="h4">{value.job}</Typography>
        <Typography>{moment(value.release_date).format("YYYY")}</Typography>
      </CardContent>
    </Card>
  </Link>
);
