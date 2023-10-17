import { Alert, Container, Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { UserContext } from "src/App";
import {
  getMaxRankByThemeAndType,
  getRanksByIdExternAndType,
} from "src/api/supabase/rank";

import { getStatsValueByExternIdAndType } from "src/api/supabase/value";
import { getMovieDetails } from "src/api/tmdb/movie";
import { getPersonDetails } from "src/api/tmdb/person";
import { getTvDetails } from "src/api/tmdb/tv";
import { ReturnArrow } from "src/components/NavigationButton";
import { CardReview } from "src/components/card/CardReview";
import { DataDonut, DonutChart } from "src/components/chart/DonutChart";
import { Loading } from "src/components/commun/Loading";
import { ReviewSkeleton } from "src/components/commun/skeleton/Skeleton";
import { HeaderExternValue } from "src/components/value/HeaderValue";
import { Review } from "src/models/Review";
import { StatsValue } from "src/models/Value";
import { MediaType } from "src/models/tmdb/enum";
import { THEMETMDB } from "src/routes/movieRoutes";
import { Colors } from "src/style/Colors";

interface Value {
  image: string;
  name: string;
  description: string;
}

export const ValuePage = () => {
  let { id, type } = useParams();
  const { t } = useTranslation();
  const { language } = useContext(UserContext);

  const [value, setValue] = useState<Value | undefined>(undefined);
  const [statsValue, setStatsValue] = useState<StatsValue | undefined>(
    undefined
  );
  const [isLoadingReview, setIsLoadingReview] = useState(true);
  const [reviews, setReviews] = useState<Array<Review>>([]);
  const [dataNotation, setDataNotation] = useState<Array<DataDonut>>([]);
  const [dataRank, setDataRank] = useState<Array<DataDonut>>([]);
  const [max, setMax] = useState<number | null>(null);

  const getTotalValueTheme = async () => {
    if (type) {
      const res = await getMaxRankByThemeAndType(THEMETMDB, type);
      if (res.data !== null) setMax(res.data[0].rank);
    }
  };

  useEffect(() => {
    getTotalValueTheme();
  }, [type]);

  const getDataNotation = () => {
    if (statsValue) {
      setDataNotation(
        [
          {
            name: t("commun.nonotation"),
            value: statsValue.notations.filter((el) => el === null).length,
            color: Colors.greyDarkMode,
          },
          {
            name: t("commun.notationunder", {
              max: 2,
            }),
            value: statsValue.notations.filter((el) => el < 2 && el !== null)
              .length,
            color: Colors.red,
          },
          {
            name: t("commun.notationbetween", {
              min: 2,
              max: 4,
            }),
            value: statsValue.notations.filter((el) => el >= 2 && el < 4)
              .length,
            color: Colors.orange,
          },
          {
            name: t("commun.notationbetween", {
              min: 4,
              max: 6,
            }),
            value: statsValue.notations.filter((el) => el >= 4 && el < 6)
              .length,
            color: Colors.yellow,
          },
          {
            name: t("commun.notationbetween", {
              min: 6,
              max: 8,
            }),
            value: statsValue.notations.filter((el) => el >= 6 && el < 8)
              .length,
            color: Colors.teal,
          },
          {
            name: t("commun.notationover", {
              min: 8,
            }),
            value: statsValue.notations.filter((el) => el >= 8).length,
            color: Colors.green,
          },
        ].filter((el) => el.value !== 0)
      );
    }
  };

  const getDataRank = () => {
    if (statsValue && max) {
      const quart = Math.ceil(max / 4);
      const top25 = quart === 1 ? 2 : quart;
      const top50 = Math.ceil(max / 2);
      const top75 = 3 * quart;
      setDataRank(
        [
          {
            name:
              top25 === 2
                ? t("commun.rankvalue", {
                    value: 1,
                  })
                : t("commun.rankbetween", {
                    min: 1,
                    max: top25,
                  }),
            value: statsValue.ranks.filter((el) => el < top25).length,
            color: Colors.green,
          },
          {
            name: t("commun.rankbetween", {
              min: top25,
              max: top50,
            }),
            value: statsValue.ranks.filter((el) => el >= top25 && el < top50)
              .length,
            color: Colors.yellow,
          },
          {
            name: t("commun.rankbetween", {
              min: top50,
              max: top75,
            }),
            value: statsValue.ranks.filter((el) => el >= top50 && el < top75)
              .length,
            color: Colors.orange,
          },
          {
            name: t("commun.rankover", {
              min: top75,
            }),
            value: statsValue.ranks.filter((el) => el >= top75).length,
            color: Colors.red,
          },
        ].filter((el) => el.value !== 0)
      );
    }
  };
  useEffect(() => {
    getDataNotation();
  }, [statsValue]);

  useEffect(() => {
    getDataRank();
  }, [statsValue]);

  const getValue = async () => {
    if (id && type) {
      if (type === MediaType.tv) {
        getTvDetails(Number(id), language.iso).then((res) => {
          setValue({
            image: `https://image.tmdb.org/t/p/original${res.poster_path}`,
            name: res.name,
            description: res.overview,
          });
        });
      } else if (type === MediaType.movie) {
        getMovieDetails(Number(id), language.iso).then((res) => {
          setValue({
            image: `https://image.tmdb.org/t/p/original${res.poster_path}`,
            name: res.title,
            description: res.overview,
          });
        });
      } else if (type === MediaType.person) {
        getPersonDetails(Number(id), language.iso).then((res) => {
          setValue({
            image: `https://image.tmdb.org/t/p/original${res.profile_path}`,
            name: res.name,
            description: res.biography,
          });
        });
      }
    }
  };

  const getStatsValue = async () => {
    if (id && type) {
      const { data } = await getStatsValueByExternIdAndType(Number(id), type);
      if (data !== null) {
        setStatsValue(data as StatsValue);
      }
    }
  };

  const getReview = async () => {
    setIsLoadingReview(true);
    if (id && type) {
      const { data } = await getRanksByIdExternAndType(Number(id), type);
      setReviews(data as Array<Review>);
      setIsLoadingReview(false);
    }
  };

  useEffect(() => {
    getValue();
    getStatsValue();
    getReview();
  }, [id, type]);

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>
          {value ? `${value.name} - RankAllAndNothing` : "RankAllAndNothing"}
        </title>
      </Helmet>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <ReturnArrow />
        </Grid>
        {value ? (
          <>
            <Grid item xs={12}>
              <HeaderExternValue value={value} stats={statsValue} />
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Loading />
          </Grid>
        )}
        {dataNotation.length > 0 && (
          <Grid item xs={12} md={6}>
            <DonutChart data={dataNotation} title="Notation" />
          </Grid>
        )}
        {dataNotation.length > 0 && (
          <Grid item xs={12} md={6}>
            <DonutChart data={dataRank} title="Rank" />
          </Grid>
        )}
        {isLoadingReview ? (
          Array.from(new Array(4)).map((_, index) => (
            <Grid key={index} item xs={12} md={6}>
              <ReviewSkeleton />
            </Grid>
          ))
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <Grid item xs={12} md={6} key={review.id}>
              <CardReview review={review} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="warning">{t("commun.noresultreview")}</Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
