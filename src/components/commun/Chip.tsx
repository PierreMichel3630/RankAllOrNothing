import { Avatar, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { px } from "csx";

import { Genre } from "src/models/tmdb/commun/Genre";
import { MediaType } from "src/models/tmdb/enum";
import { Colors } from "src/style/Colors";
import { FormatTime, toHoursAndMinutes } from "src/utils/time";

import LiveTvIcon from "@mui/icons-material/LiveTv";
import MovieIcon from "@mui/icons-material/Movie";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarIcon from "@mui/icons-material/Star";

import action from "../../assets/genre/action.png";
import adventure from "../../assets/genre/adventure.png";
import animation from "../../assets/genre/animation.png";
import comedy from "../../assets/genre/comedy.png";
import crime from "../../assets/genre/crime.png";
import documentary from "../../assets/genre/documentary.png";
import drama from "../../assets/genre/drama.png";
import fantasy from "../../assets/genre/fantasy.png";
import family from "../../assets/genre/family.png";
import history from "../../assets/genre/history.png";
import horror from "../../assets/genre/horror.png";
import kids from "../../assets/genre/kids.png";
import music from "../../assets/genre/music.png";
import mystery from "../../assets/genre/mystery.png";
import news from "../../assets/genre/news.png";
import reality from "../../assets/genre/reality.png";
import romance from "../../assets/genre/romance.png";
import scifi from "../../assets/genre/sci-fi.png";
import talk from "../../assets/genre/talk.png";
import thriller from "../../assets/genre/thriller.png";
import tvmovie from "../../assets/genre/tvmovie.png";
import war from "../../assets/genre/war.png";
import western from "../../assets/genre/western.png";
import { Language } from "src/models/Language";
import { PersonDetails } from "src/models/tmdb/person/PersonDetails";
import { useContext, useEffect, useState } from "react";
import { getPersonDetails } from "src/api/tmdb/person";
import { UserContext } from "src/App";
import { ChipSkeleton } from "./skeleton/Skeleton";
import { LanguageOrigin } from "src/models/LanguageOrigin";

interface PropsChipMediaType {
  active: boolean;
  onClick: () => void;
  type: MediaType;
}

export const ChipMediaType = ({
  active,
  onClick,
  type,
}: PropsChipMediaType) => {
  const { t } = useTranslation();

  const getLabel = () => {
    let label = t("commun.movies");
    switch (type) {
      case MediaType.movie:
        label = t("commun.movies");
        break;
      case MediaType.tv:
        label = t("commun.series");
        break;
      case MediaType.person:
        label = t("commun.persons");
        break;
    }
    return label;
  };

  const getIcon = () => {
    let icon = <MovieIcon />;
    switch (type) {
      case MediaType.movie:
        icon = <MovieIcon />;
        break;
      case MediaType.tv:
        icon = <LiveTvIcon />;
        break;
      case MediaType.person:
        icon = <PersonIcon />;
        break;
    }
    return icon;
  };
  return (
    <Chip
      label={getLabel()}
      icon={getIcon()}
      variant={active ? "filled" : "outlined"}
      onClick={onClick}
      sx={{ padding: px(2) }}
    />
  );
};

interface PropsChipGenre {
  active?: boolean;
  onClick: () => void;
  genre: Genre;
}

const iconsGenre = new Map<number, string>();
iconsGenre.set(12, adventure);
iconsGenre.set(14, fantasy);
iconsGenre.set(16, animation);
iconsGenre.set(18, drama);
iconsGenre.set(27, horror);
iconsGenre.set(28, action);
iconsGenre.set(35, comedy);
iconsGenre.set(36, history);
iconsGenre.set(37, western);
iconsGenre.set(53, thriller);
iconsGenre.set(80, crime);
iconsGenre.set(99, documentary);
iconsGenre.set(878, scifi);
iconsGenre.set(9648, mystery);
iconsGenre.set(10749, romance);
iconsGenre.set(10751, family);
iconsGenre.set(10752, war);
iconsGenre.set(10759, adventure);
iconsGenre.set(10762, kids);
iconsGenre.set(10763, news);
iconsGenre.set(10764, reality);
iconsGenre.set(10765, scifi);
iconsGenre.set(10766, romance);
iconsGenre.set(10767, talk);
iconsGenre.set(10768, war);
iconsGenre.set(10770, tvmovie);
iconsGenre.set(10402, music);

export const ChipGenre = ({
  active = false,
  onClick,
  genre,
}: PropsChipGenre) => (
  <Chip
    label={genre.name}
    variant={active ? "filled" : "outlined"}
    onClick={onClick}
    sx={{ padding: px(2) }}
  />
);

interface PropsChipGenreFilter {
  onDelete: () => void;
  genre: Genre;
  without?: boolean;
}
export const ChipGenreFilter = ({
  onDelete,
  genre,
  without = false,
}: PropsChipGenreFilter) => (
  <Chip
    label={genre.name}
    variant={"outlined"}
    sx={{ padding: px(2), color: without ? Colors.red : Colors.green }}
    onDelete={onDelete}
  />
);

interface PropsChipRuntimeFilter {
  onDelete: () => void;
  runtime: number;
  type: "over" | "under";
}
export const ChipRuntimeFilter = ({
  onDelete,
  runtime,
  type,
}: PropsChipRuntimeFilter) => {
  const { t } = useTranslation();
  return (
    <Chip
      label={`${
        type === "over" ? t("commun.over") : t("commun.under")
      } ${toHoursAndMinutes(runtime, FormatTime.intern)}`}
      icon={<AccessTimeIcon />}
      variant={"outlined"}
      sx={{ padding: px(2) }}
      onDelete={onDelete}
    />
  );
};

interface PropsChipVoteFilter {
  onDelete: () => void;
  value: number;
  type: "over" | "under";
}
export const ChipVoteFilter = ({
  onDelete,
  value,
  type,
}: PropsChipVoteFilter) => {
  const { t } = useTranslation();
  return (
    <Chip
      label={`${
        type === "over" ? t("commun.over") : t("commun.under")
      } ${value}`}
      icon={<StarIcon />}
      variant={"outlined"}
      sx={{ padding: px(2) }}
      onDelete={onDelete}
    />
  );
};

interface PropsChipYearFilter {
  onDelete: () => void;
  year: number;
  type: "before" | "after" | "exact";
}
export const ChipYearFilter = ({
  onDelete,
  year,
  type,
}: PropsChipYearFilter) => {
  const { t } = useTranslation();
  return (
    <Chip
      label={`${type === "exact" ? "" : `${t(`commun.${type}`)} `}${year}`}
      icon={<CalendarMonthIcon />}
      variant={"outlined"}
      sx={{ padding: px(2) }}
      onDelete={onDelete}
    />
  );
};

interface PropsChipLanguage {
  active?: boolean;
  onClick: () => void;
  language: Language;
}
export const ChipLanguage = ({
  active = false,
  onClick,
  language,
}: PropsChipLanguage) => (
  <Chip
    avatar={<Avatar>{language.image}</Avatar>}
    label={language.name}
    variant={active ? "filled" : "outlined"}
    onClick={onClick}
    sx={{ padding: px(2) }}
  />
);

interface PropsChipLanguageOrigin {
  active?: boolean;
  onClick: () => void;
  language: LanguageOrigin;
}
export const ChipLanguageOrigin = ({
  active = false,
  onClick,
  language,
}: PropsChipLanguageOrigin) => (
  <Chip
    avatar={<Avatar>{language.flag}</Avatar>}
    label={language.name}
    variant={active ? "filled" : "outlined"}
    onClick={onClick}
    sx={{ padding: px(2) }}
  />
);

interface PropsChipLanguageOriginFilter {
  onDelete: () => void;
  value: LanguageOrigin;
}
export const ChipLanguageOriginFilter = ({
  onDelete,
  value,
}: PropsChipLanguageOriginFilter) => (
  <Chip
    avatar={<Avatar>{value.flag}</Avatar>}
    label={value.name}
    variant={"outlined"}
    sx={{ padding: px(2) }}
    onDelete={onDelete}
  />
);

//ACTOR
interface PropsChipActorFilter {
  onDelete: () => void;
  id: number;
}
export const ChipActorFilter = ({ onDelete, id }: PropsChipActorFilter) => {
  const { language } = useContext(UserContext);
  const [actor, setActor] = useState<undefined | PersonDetails>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getPersonDetails(id, language.iso).then((res) => {
      setActor(res);
      setIsLoading(false);
    });
  }, [id]);

  return isLoading ? (
    <ChipSkeleton />
  ) : (
    actor && (
      <Chip
        label={actor.name}
        avatar={
          <Avatar
            alt={actor.name}
            src={`https://image.tmdb.org/t/p/w45${actor.profile_path}`}
          />
        }
        variant="outlined"
        sx={{ padding: px(2) }}
        onDelete={onDelete}
      />
    )
  );
};
