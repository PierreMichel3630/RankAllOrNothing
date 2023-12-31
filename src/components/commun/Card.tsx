import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { BUCKET_VALUE, getUrlPublic } from "src/api/supabase/storage";
import { Rank } from "src/models/Rank";
import { Value } from "src/models/Value";
import { Cast } from "src/models/tmdb/commun/Cast";
import { GuestStar } from "src/models/tmdb/commun/GuestStar";
import { EpisodeDetail } from "src/models/tmdb/tv/EpisodeDetail";
import { TvAggregateCreditCast } from "src/models/tmdb/tv/TvAggregateCreditCast";
import { Colors } from "src/style/Colors";
import { classes, style } from "typestyle";
import { ImageNotFoundBlock } from "./ImageBlock";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "src/App";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { getRanksByIdExtern } from "src/api/supabase/rank";
import { getMovieDetails } from "src/api/tmdb/movie";
import { getPersonDetails } from "src/api/tmdb/person";
import { getTvDetails } from "src/api/tmdb/tv";
import { MediaType } from "src/models/tmdb/enum";
import {
  ItemToCheck,
  ItemToRank,
  RankContext,
} from "src/pages/tmdb/HomeMoviesPage";
import { BASEURLMOVIE, THEMETMDB } from "src/routes/movieRoutes";
import { TranslateForm } from "../form/TranslateForm";
import { RankBadge } from "./RankBadge";
import { VoteBadge } from "./VoteBadge";

import BarChartIcon from "@mui/icons-material/BarChart";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import LinkIcon from "@mui/icons-material/Link";
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

const cardHeightCss = style({
  height: percent(100),
});

interface PropsPerson {
  value: Cast;
}

export const CardPerson = ({ value }: PropsPerson) => {
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
  }, [value, user]);

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
          <Typography variant="caption">{value.character}</Typography>
          <Typography variant="h6">{value.known_for_department}</Typography>
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
      </Card>
    </Link>
  );
};

interface PropsPersonTv {
  value: TvAggregateCreditCast;
}

export const CardPersonTv = ({ value }: PropsPersonTv) => {
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
  }, [value, user]);

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
          {value.roles.map((role, index) => (
            <Typography key={index} variant="caption" component="p">{`${
              role.character
            } (${role.episode_count} ${t("commun.episodes")})`}</Typography>
          ))}
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
      </Card>
    </Link>
  );
};

interface PropsPersonGuest {
  value: GuestStar;
}

export const CardPersonGuest = ({ value }: PropsPersonGuest) => {
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
  }, [value, user]);

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
          <Typography variant="caption">{value.character}</Typography>
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
      </Card>
    </Link>
  );
};

interface PropsEpisode {
  value: EpisodeDetail;
}

export const CardEpisode = ({ value }: PropsEpisode) => {
  const { t } = useTranslation();
  return (
    <Link
      to={`${BASEURLMOVIE}/tv/${value.show_id}/season/${value.season_number}/episode/${value.episode_number}`}
    >
      <Card className={cardCss}>
        <Grid container>
          <Grid item xs={12} sm={4}>
            {value.still_path !== null ? (
              <CardMedia
                sx={{
                  width: percent(100),
                  aspectRatio: "auto",
                  height: percent(100),
                  minHeight: px(250),
                }}
                image={`https://image.tmdb.org/t/p/original${value.still_path}`}
                title={value.name}
              />
            ) : (
              <ImageNotFoundBlock style={{ height: px(250) }} />
            )}
          </Grid>
          <Grid item xs={12} sm={8}>
            <CardContent>
              <Typography variant="h4">
                {`${t("commun.season")} ${value.season_number} ${t(
                  "commun.episode"
                )} ${value.episode_number} - ${value.name}`}
              </Typography>
              <Typography variant="body1">{value.overview}</Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
};

const cardCheckCss = style({
  border: `4px solid ${Colors.green}`,
});

interface PropsCardValue {
  value: Value;
  check: () => void;
  rate: () => void;
  remove: (rank: Rank | undefined) => void;
  ranks: Array<Rank>;
}

export const CardValue = ({
  ranks,
  value,
  check,
  rate,
  remove,
}: PropsCardValue) => {
  const { language } = useContext(UserContext);

  const nameLocalLanguage = value.name[language.iso];
  const nameEnglish = value.name[DEFAULT_ISO_LANGUAGE];
  const name = nameLocalLanguage ? nameLocalLanguage : nameEnglish;

  const descriptionLocalLanguage = value.description[language.iso];
  const descriptionEnglish = value.description[DEFAULT_ISO_LANGUAGE];
  const description = descriptionLocalLanguage
    ? descriptionLocalLanguage
    : descriptionEnglish;

  const rank = ranks.find((el) => value.id === el.value.id);
  const isCheck = rank !== undefined;

  return (
    <Link to={`/value/${value.id}`}>
      <Card
        className={
          isCheck ? classes(cardHeightCss, cardCheckCss) : cardHeightCss
        }
        sx={{ position: "relative" }}
      >
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
        <CardMedia
          sx={{
            width: percent(100),
            aspectRatio: "auto",
            height: percent(100),
            minHeight: px(250),
          }}
          image={getUrlPublic(BUCKET_VALUE, value.image)}
        />
        <CardContent sx={{ position: "relative", mt: 1 }}>
          {isCheck && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: percent(2),
                transform: "translate(0%,-65%)",
              }}
            >
              <VoteBadge value={rank.notation} tooltip={rank.opinion} />
            </div>
          )}
          <Typography variant="h4">{name}</Typography>
          <Tooltip title={description} placement="top">
            <Typography
              variant="body1"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
              }}
            >
              {description}
            </Typography>
          </Tooltip>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end", display: "flex" }}>
          <IconButton aria-label="Statistic">
            <BarChartIcon />
          </IconButton>
          {isCheck ? (
            <IconButton
              aria-label="Check"
              onClick={(event) => {
                event.preventDefault();
                remove(rank);
              }}
            >
              <ClearIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="Check"
              onClick={(event) => {
                event.preventDefault();
                check();
              }}
            >
              <CheckIcon />
            </IconButton>
          )}
          <IconButton
            aria-label="Rate"
            onClick={(event) => {
              event.preventDefault();
              rate();
            }}
          >
            <StarRateIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Link>
  );
};

interface PropsCardValueTranslate {
  value: Value;
}

export const CardValueTranslate = ({ value }: PropsCardValueTranslate) => {
  const { language } = useContext(UserContext);

  const nameLocalLanguage = value.name[language.iso];
  const nameEnglish = value.name[DEFAULT_ISO_LANGUAGE];
  const name = nameLocalLanguage ? nameLocalLanguage : nameEnglish;

  const descriptionLocalLanguage = value.description[language.iso];
  const descriptionEnglish = value.description[DEFAULT_ISO_LANGUAGE];
  const description = descriptionLocalLanguage
    ? descriptionLocalLanguage
    : descriptionEnglish;

  return (
    <Card className={cardHeightCss} sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <CardMedia
            sx={{
              width: percent(100),
              aspectRatio: "auto",
              height: percent(100),
              minHeight: px(250),
            }}
            image={getUrlPublic(BUCKET_VALUE, value.image)}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4">{name}</Typography>
          <Typography variant="body1">{description}</Typography>
        </Grid>
        <Grid item xs={5}>
          <TranslateForm
            idValue={value.id}
            validate={() => console.log("validate")}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

interface PropsCardRankBasic {
  rank: Rank;
  index: number;
}

export const CardRankBasic = ({ index, rank }: PropsCardRankBasic) => {
  const { language } = useContext(UserContext);
  const nameLocalLanguage = rank.value.name[language.iso];
  const nameEnglish = rank.value.name[DEFAULT_ISO_LANGUAGE];
  const name = nameLocalLanguage ? nameLocalLanguage : nameEnglish;

  const descriptionLocalLanguage = rank.value.description[language.iso];
  const descriptionEnglish = rank.value.description[DEFAULT_ISO_LANGUAGE];
  const description = descriptionLocalLanguage
    ? descriptionLocalLanguage
    : descriptionEnglish;

  return (
    <Card
      className={classes(cardCss, cardHeightCss)}
      sx={{ position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: percent(2),
          left: percent(2),
        }}
      >
        <RankBadge rank={index + 1} />
      </div>

      <CardMedia
        sx={{
          width: percent(100),
          aspectRatio: "auto",
          maxHeight: percent(100),
          minHeight: px(250),
        }}
        image={getUrlPublic(BUCKET_VALUE, rank.value.image)}
        title={name}
      />
      <CardContent sx={{ position: "relative", mt: 1 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            right: percent(2),
            transform: "translate(0%,-65%)",
          }}
        >
          <VoteBadge value={rank.notation} tooltip={rank.opinion} />
        </div>
        <Typography variant="h4">{name}</Typography>
        <Tooltip title={description} placement="top">
          <Typography
            variant="body1"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {description}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};

interface PropsCardRank {
  rank: Rank;
  rate: () => void;
  remove: () => void;
  index: number;
}

export const CardRank = ({ index, rank, rate, remove }: PropsCardRank) => {
  const { language } = useContext(UserContext);
  const navigate = useNavigate();

  const nameLocalLanguage = rank.value.name[language.iso];
  const nameEnglish = rank.value.name[DEFAULT_ISO_LANGUAGE];
  const name = nameLocalLanguage ? nameLocalLanguage : nameEnglish;

  const descriptionLocalLanguage = rank.value.description[language.iso];
  const descriptionEnglish = rank.value.description[DEFAULT_ISO_LANGUAGE];
  const description = descriptionLocalLanguage
    ? descriptionLocalLanguage
    : descriptionEnglish;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: rank.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const removeRank = (event: any) => {
    event.preventDefault();
    remove();
  };

  const rateRank = (event: any) => {
    event.preventDefault();
    rate();
  };

  const goStats = (event: any) => {
    event.preventDefault();
    navigate(`/value/${rank.value.id}`);
  };

  return (
    <Card
      className={classes(cardCss, cardHeightCss)}
      ref={setNodeRef}
      {...attributes}
      style={style}
      sx={{ position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: percent(2),
          left: percent(2),
        }}
      >
        <RankBadge rank={index + 1} />
      </div>

      <CardMedia
        sx={{
          width: percent(100),
          aspectRatio: "auto",
          maxHeight: percent(100),
          minHeight: px(250),
          cursor: "grab",
        }}
        image={getUrlPublic(BUCKET_VALUE, rank.value.image)}
        title={name}
        {...listeners}
      />
      <CardContent
        sx={{ position: "relative", mt: 1, cursor: "grab" }}
        {...listeners}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: percent(2),
            transform: "translate(0%,-65%)",
          }}
        >
          <VoteBadge value={rank.notation} tooltip={rank.opinion} />
        </div>
        <Typography variant="h4">{name}</Typography>
        <Tooltip title={description} placement="top">
          <Typography
            variant="body1"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {description}
          </Typography>
        </Tooltip>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", display: "flex" }}>
        <IconButton aria-label="Statistic">
          <BarChartIcon
            aria-label="Stats"
            onClick={(event) => goStats(event)}
          />
        </IconButton>
        <IconButton aria-label="Remove" onClick={(event) => removeRank(event)}>
          <ClearIcon />
        </IconButton>
        <IconButton aria-label="Rate" onClick={(event) => rateRank(event)}>
          <StarRateIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

interface PropsCardRankTmdb {
  rank: Rank;
  rate: (value: ItemToRank) => void;
  remove: () => void;
  index: number;
}

export const CardRankTmdb = ({
  index,
  rank,
  rate,
  remove,
}: PropsCardRankTmdb) => {
  const { language } = useContext(UserContext);

  const [value, setValue] = useState<undefined | ItemToRank>(undefined);
  const [loading, setLoading] = useState(true);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: rank.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getItemTMDB = () => {
    const id = rank.id_extern;
    if (language && id !== null) {
      switch (rank.type as MediaType) {
        case MediaType.tv:
          getTvDetails(Number(id), language.iso).then((res) => {
            setValue({
              id: Number(id),
              name: res.name,
              image: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
              description: res.overview,
              type: MediaType.tv,
            });
            setLoading(false);
          });
          break;
        case MediaType.movie:
          getMovieDetails(Number(id), language.iso).then((res) => {
            setValue({
              id: Number(id),
              name: res.title,
              image: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
              description: res.overview,
              type: MediaType.movie,
            });
            setLoading(false);
          });
          break;
        case MediaType.person:
          getPersonDetails(Number(id), language.iso).then((res) => {
            setValue({
              id: Number(id),
              name: res.name,
              image: `https://image.tmdb.org/t/p/w500${res.profile_path}`,
              description: res.biography,
              type: MediaType.person,
            });
            setLoading(false);
          });
          break;
        default:
          getMovieDetails(Number(id), language.iso).then((res) => {
            setValue({
              id: Number(id),
              name: res.title,
              image: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
              description: res.overview,
              type: MediaType.movie,
            });
            setLoading(false);
          });
          break;
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    getItemTMDB();
  }, [rank, language]);

  const removeRank = (event: any) => {
    event.preventDefault();
    remove();
  };

  const rateRank = (event: any, el: ItemToRank) => {
    event.preventDefault();
    rate(el);
  };

  return (
    <Card
      className={classes(cardCss, cardHeightCss)}
      ref={setNodeRef}
      {...attributes}
      style={style}
      sx={{ position: "relative" }}
    >
      {loading || value === undefined ? (
        <>
          <Skeleton
            variant="rectangular"
            sx={{ width: percent(100), height: px(250) }}
          />
          <CardContent>
            <Skeleton width="60%" />
            <Skeleton width="20%" />
          </CardContent>
        </>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: percent(2),
              left: percent(2),
            }}
          >
            <RankBadge rank={index + 1} />
          </div>
          <CardMedia
            sx={{
              width: percent(100),
              aspectRatio: "2/3",
              minHeight: px(300),
              cursor: "grab",
            }}
            image={value.image}
            title={value.name}
            {...listeners}
          />
          <CardContent
            sx={{ position: "relative", mt: 1, pb: 1, cursor: "grab" }}
            {...listeners}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: percent(2),
                transform: "translate(0%,-65%)",
              }}
            >
              <VoteBadge value={rank.notation} tooltip={rank.opinion} />
            </div>
            <Typography variant="h4">{value.name}</Typography>
            <Tooltip title={value.description} placement="bottom">
              <Typography
                variant="body1"
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                }}
              >
                {value.description}
              </Typography>
            </Tooltip>
          </CardContent>
          <CardActions
            sx={{
              mt: "auto",
              justifyContent: "flex-end",
              display: "flex",
              alignItems: "center",
              padding: px(2),
              gap: px(2),
            }}
          >
            <Grid item>
              <Link
                to={`/external/theme/${THEMETMDB}/${value.type.toString()}/value/${
                  value.id
                }/statistic`}
              >
                <IconButton aria-label="Statistic">
                  <BarChartIcon />
                </IconButton>
              </Link>
            </Grid>
            <Grid item>
              <Link to={`${BASEURLMOVIE}/${value.type.toString()}/${value.id}`}>
                <IconButton aria-label="Go to">
                  <LinkIcon />
                </IconButton>
              </Link>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="Remove"
                onClick={(event) => removeRank(event)}
              >
                <ClearIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="Rate"
                onClick={(event) => rateRank(event, value)}
              >
                <StarRateIcon />
              </IconButton>
            </Grid>
          </CardActions>
        </>
      )}
    </Card>
  );
};

interface PropsCardRankTmdbProfile {
  rank: Rank;
  index: number;
}

export const CardRankTmdbProfile = ({
  index,
  rank,
}: PropsCardRankTmdbProfile) => {
  const { language } = useContext(UserContext);

  const [value, setValue] = useState<undefined | ItemToRank>(undefined);
  const [loading, setLoading] = useState(true);

  const getItemTMDB = () => {
    const id = rank.id_extern;
    if (language && id !== null) {
      switch (rank.type as MediaType) {
        case MediaType.tv:
          getTvDetails(Number(id), language.iso).then((res) => {
            setValue({
              id: Number(id),
              name: res.name,
              image: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
              description: res.overview,
              type: MediaType.tv,
            });
            setLoading(false);
          });
          break;
        case MediaType.movie:
          getMovieDetails(Number(id), language.iso).then((res) => {
            setValue({
              id: Number(id),
              name: res.title,
              image: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
              description: res.overview,
              type: MediaType.movie,
            });
            setLoading(false);
          });
          break;
        case MediaType.person:
          getPersonDetails(Number(id), language.iso).then((res) => {
            setValue({
              id: Number(id),
              name: res.name,
              image: `https://image.tmdb.org/t/p/w500${res.profile_path}`,
              description: res.biography,
              type: MediaType.person,
            });
            setLoading(false);
          });
          break;
        default:
          getMovieDetails(Number(id), language.iso).then((res) => {
            setValue({
              id: Number(id),
              name: res.title,
              image: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
              description: res.overview,
              type: MediaType.movie,
            });
            setLoading(false);
          });
          break;
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    getItemTMDB();
  }, [rank, language]);

  return (
    <Link to={`${BASEURLMOVIE}/${rank.type}/${rank.id_extern}`}>
      <Card
        className={classes(cardCss, cardHeightCss)}
        sx={{ position: "relative" }}
      >
        {loading || value === undefined ? (
          <>
            <Skeleton
              variant="rectangular"
              sx={{ width: percent(100), height: px(250) }}
            />
            <CardContent>
              <Skeleton width="60%" />
              <Skeleton width="20%" />
            </CardContent>
          </>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                top: percent(2),
                left: percent(2),
              }}
            >
              <RankBadge rank={index + 1} />
            </div>
            <CardMedia
              sx={{
                width: percent(100),
                aspectRatio: "2/3",
                minHeight: px(300),
              }}
              image={value.image}
              title={value.name}
            />
            <CardContent sx={{ position: "relative", mt: 1, pb: 1 }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: percent(2),
                  transform: "translate(0%,-65%)",
                }}
              >
                <VoteBadge value={rank.notation} tooltip={rank.opinion} />
              </div>
              <Typography variant="h4">{value.name}</Typography>
              <Tooltip title={value.description} placement="bottom">
                <Typography
                  variant="body1"
                  sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                  }}
                >
                  {value.description}
                </Typography>
              </Tooltip>
            </CardContent>
          </>
        )}
      </Card>
    </Link>
  );
};
