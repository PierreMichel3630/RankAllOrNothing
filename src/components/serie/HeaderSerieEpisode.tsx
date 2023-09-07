import { Grid, Skeleton, Typography } from "@mui/material";
import { ImageNotFoundBlock } from "../commun/ImageBlock";
import moment from "moment";
import { style } from "typestyle";
import { percent, px, viewHeight } from "csx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeasonDetail } from "src/models/tmdb/tv/SeasonDetail";
import { SerieDetails } from "src/models/tmdb/tv/SerieDetails";
import { BASEURLMOVIE } from "src/routes/movieRoutes";

const posterCss = style({
  maxHeight: viewHeight(40),
  aspectRatio: "initial",
  maxWidth: percent(100),
});

interface Props {
  seasonDetail?: SeasonDetail;
  detail?: SerieDetails;
  isLoading?: boolean;
}

export const HeaderSerieEpisode = ({
  seasonDetail,
  detail,
  isLoading = false,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        {!isLoading && seasonDetail !== undefined ? (
          seasonDetail.poster_path !== null ? (
            <img
              src={`https://image.tmdb.org/t/p/original${seasonDetail.poster_path}`}
              className={posterCss}
            />
          ) : (
            <ImageNotFoundBlock style={{ aspectRatio: "2/3" }} />
          )
        ) : (
          <Skeleton
            variant="rectangular"
            sx={{ width: percent(100), height: px(150) }}
          />
        )}
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {detail ? (
              <Typography
                variant="h1"
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`${BASEURLMOVIE}/tv/${Number(detail.id)}`)
                }
              >
                {detail ? detail.name : ""}
              </Typography>
            ) : (
              <Skeleton variant="text" sx={{ fontSize: "50px" }} width="25%" />
            )}
          </Grid>
          {!isLoading && seasonDetail !== undefined ? (
            <>
              <Grid item xs={12}>
                <Typography variant="h4">{seasonDetail.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4">
                  {moment(seasonDetail.air_date).format("YYYY")} -{" "}
                  {seasonDetail.episodes.length} {t("commun.episodes")}
                </Typography>
              </Grid>
              {seasonDetail.overview !== "" && (
                <Grid item xs={12}>
                  <Typography variant="h4">
                    {t("pages.movie.summary")}
                  </Typography>
                  <Typography variant="body1">
                    {seasonDetail.overview}
                  </Typography>
                </Grid>
              )}
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "16px" }}
                  width="15%"
                />
              </Grid>
              <Grid item xs={12}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "16px" }}
                  width="25%"
                />
              </Grid>
              <Grid item xs={12}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "16px" }}
                  width="15%"
                />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "13px" }}
                  width="100%"
                />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "13px" }}
                  width="100%"
                />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "13px" }}
                  width="25%"
                />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
