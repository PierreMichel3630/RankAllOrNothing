import { Alert, Container, Grid } from "@mui/material";
import { percent, viewHeight } from "csx";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { UserContext } from "src/App";
import {
  getTvDetails,
  getTvEpisodeImages,
  getTvEpisodeVideos,
  getTvSeason,
} from "src/api/tmdb/tv";
import { PhotosBlock } from "src/components/PhotosBlock";
import { VideosBlock } from "src/components/VideosBlock";
import { EpisodeHeader } from "src/components/serie/EpisodeHeader";
import { EpisodeNavigation } from "src/components/serie/EpisodeNavigation";
import { GuestStarsBlock } from "src/components/serie/GuestStarsBlock";
import { HeaderSerieEpisode } from "src/components/serie/HeaderSerieEpisode";
import { Image } from "src/models/tmdb/commun/Image";
import { Video } from "src/models/tmdb/commun/Video";
import { ImageType } from "src/models/tmdb/enum";
import { EpisodeDetail } from "src/models/tmdb/tv/EpisodeDetail";
import { SeasonDetail } from "src/models/tmdb/tv/SeasonDetail";
import { SerieDetails } from "src/models/tmdb/tv/SerieDetails";
import { getBreakpoint } from "src/utils/mediaQuery";
import { style } from "typestyle";

export const EpisodePage = () => {
  let { id, episode, season } = useParams();
  const { language } = useContext(UserContext);
  const { t } = useTranslation();

  const [detail, setDetail] = useState<undefined | SerieDetails>(undefined);
  const [seasonDetail, setSeasonDetail] = useState<undefined | SeasonDetail>(
    undefined
  );
  const [episodeSelected, setEpisodeSelected] = useState<
    undefined | EpisodeDetail
  >(undefined);
  const [images, setImages] = useState<Array<Image>>([]);
  const [videos, setVideos] = useState<Array<Video>>([]);

  const [isNoResult, setIsNoResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [isLoadingSeason, setIsLoadingSeason] = useState(true);

  const breakpoint = getBreakpoint();
  const isSmallScreen = breakpoint === "xs" || breakpoint === "sm";

  const backdropCss = style({
    width: percent(100),
    height: viewHeight(50),
    position: "relative",
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    $nest: {
      "&::before": {
        content: "''",
        backgroundImage: `url('${
          detail
            ? `https://image.tmdb.org/t/p/original${
                isSmallScreen ? detail.poster_path : detail.backdrop_path
              }`
            : ""
        }')`,
        backgroundSize: "cover",
        position: "absolute",
        width: percent(100),
        height: percent(100),
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
        opacity: 0.25,
      },
    },
  });

  useEffect(() => {
    if (id) {
      getTvDetails(Number(id), language.iso).then((res) => {
        setDetail(res);
      });
    }
  }, [id, language]);

  useEffect(() => {
    setIsLoading(true);
    setIsLoadingSeason(true);
    if (id && episode && season) {
      getTvSeason(Number(id), Number(season), language.iso).then((res) => {
        setSeasonDetail(res);
        const newEpisodeSelect: undefined | EpisodeDetail = res.episodes.find(
          (el) => el.episode_number === Number(episode)
        );
        if (newEpisodeSelect) {
          setEpisodeSelected(newEpisodeSelect);
          setIsNoResult(false);
        } else {
          setIsNoResult(true);
        }
        setIsLoading(false);
        setIsLoadingSeason(false);
      });
    }
  }, [id, season, language]);

  useEffect(() => {
    setIsLoading(true);
    if (episode && seasonDetail) {
      const newEpisodeSelect: undefined | EpisodeDetail =
        seasonDetail.episodes.find(
          (el) => el.episode_number === Number(episode)
        );
      if (newEpisodeSelect) {
        setEpisodeSelected(newEpisodeSelect);
        setIsNoResult(false);
      } else {
        setIsNoResult(true);
      }
      setIsLoading(false);
    }
  }, [episode, season]);

  useEffect(() => {
    if (id && episode && season) {
      setIsLoadingImage(true);
      getTvEpisodeImages(
        Number(id),
        Number(season),
        Number(episode),
        language.iso
      ).then((res) => {
        setImages(
          res.stills
            ? res.stills.map((el) => ({ ...el, type: ImageType.still }))
            : []
        );
        setIsLoadingImage(false);
      });
    }
  }, [id, episode, season, language]);

  useEffect(() => {
    if (id && episode && season) {
      setIsLoadingVideo(true);
      getTvEpisodeVideos(
        Number(id),
        Number(season),
        Number(episode),
        language.iso
      ).then((res) => {
        setVideos(res.results ? res.results : []);
        setIsLoadingVideo(false);
      });
    }
  }, [id, episode, season, language]);

  return (
    <Grid container>
      <Grid item xs={12} className={backdropCss}>
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <HeaderSerieEpisode
            isLoading={isLoadingSeason}
            seasonDetail={seasonDetail}
            detail={detail}
          />
        </Container>
      </Grid>
      <Grid item xs={12}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {isNoResult ? (
              <>
                <EpisodeNavigation
                  serieId={Number(id)}
                  season={Number(season)}
                  episode={Number(episode)}
                  seasons={detail ? detail.seasons : []}
                />
                <Grid item xs={12} sx={{ marginTop: 2 }}>
                  <Alert severity="warning">
                    {t("commun.noresultepisode")}
                  </Alert>
                </Grid>
              </>
            ) : (
              <>
                <EpisodeNavigation
                  serieId={Number(id)}
                  season={Number(season)}
                  episode={Number(episode)}
                  seasons={detail ? detail.seasons : []}
                  isLoading={isLoading}
                />
                <Grid item xs={12}>
                  <EpisodeHeader
                    episodeSelected={episodeSelected}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <GuestStarsBlock
                    guests={episodeSelected ? episodeSelected.guest_stars : []}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PhotosBlock
                    name={
                      detail && episodeSelected
                        ? `${detail.name} - ${t("commun.season")} ${
                            episodeSelected.season_number
                          } ${t("commun.episode")} ${
                            episodeSelected.episode_number
                          } - ${episodeSelected.name}`
                        : ""
                    }
                    images={images}
                    isLoading={isLoadingImage}
                  />
                </Grid>
                <Grid item xs={12}>
                  <VideosBlock videos={videos} isLoading={isLoadingVideo} />
                </Grid>
              </>
            )}
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};
