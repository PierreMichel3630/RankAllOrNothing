import { Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";
import { EpisodeDetail } from "src/models/tmdb/tv/EpisodeDetail";
import { style } from "typestyle";
import { EpisodeSkeleton } from "../commun/skeleton/Skeleton";

const imageEpisodeCss = style({
  width: percent(100),
  aspectRatio: "initial",
});

interface Props {
  episodeSelected?: EpisodeDetail;
  isLoading?: boolean;
}

export const EpisodeHeader = ({
  episodeSelected,
  isLoading = false,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={2}>
      {isLoading || !episodeSelected ? (
        <EpisodeSkeleton />
      ) : (
        <>
          <Grid item xs={12} sm={3}>
            <img
              src={`https://image.tmdb.org/t/p/original${episodeSelected.still_path}`}
              className={imageEpisodeCss}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Typography variant="h4">
              {`${t("commun.season")} ${episodeSelected.season_number} ${t(
                "commun.episode"
              )} ${episodeSelected.episode_number} - ${episodeSelected.name}`}
            </Typography>
            <Typography variant="body1">{episodeSelected.overview}</Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
};
