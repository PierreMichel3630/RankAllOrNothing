import { Alert, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  getMaxRankByTheme,
  getMaxRankByThemeAndType,
  getRanksByIdExternAndTheme,
  getRanksByIdExternAndTypeAndTheme,
} from "src/api/supabase/rank";

import {
  getStatsValueByExternIdAndTheme,
  getStatsValueByExternIdAndTypeAndTheme,
} from "src/api/supabase/value";
import { ReturnArrow } from "src/components/NavigationButton";
import { CardReview } from "src/components/card/CardReview";
import { DataDonut, DonutChart } from "src/components/chart/DonutChart";
import { ReviewSkeleton } from "src/components/commun/skeleton/Skeleton";
import { HeaderExternValue } from "src/components/value/HeaderExternValue";
import { Review } from "src/models/Review";
import { StatsValue } from "src/models/Value";
import { Colors } from "src/style/Colors";

export const ValueExternalPage = () => {
  let { id, theme, type } = useParams();
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [statsValue, setStatsValue] = useState<StatsValue | undefined>(
    undefined
  );
  const [isLoadingReview, setIsLoadingReview] = useState(true);
  const [reviews, setReviews] = useState<Array<Review>>([]);
  const [dataNotation, setDataNotation] = useState<Array<DataDonut>>([]);
  const [dataRank, setDataRank] = useState<Array<DataDonut>>([]);
  const [max, setMax] = useState<number | null>(null);

  const getTotalValueTheme = async () => {
    if (theme) {
      const res = type
        ? await getMaxRankByThemeAndType(Number(theme), type)
        : await getMaxRankByTheme(Number(theme));
      if (res.data !== null) setMax(res.data[0].rank);
    }
  };

  useEffect(() => {
    getTotalValueTheme();
  }, [theme]);

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

  const getStatsValue = async () => {
    if (id && theme) {
      const { data } = type
        ? await getStatsValueByExternIdAndTypeAndTheme(
            Number(id),
            type,
            Number(theme)
          )
        : await getStatsValueByExternIdAndTheme(Number(id), Number(theme));
      if (data !== null) {
        setStatsValue(data as StatsValue);
      }
    }
  };

  const getReview = async () => {
    setIsLoadingReview(true);
    if (id && theme) {
      const { data } = type
        ? await getRanksByIdExternAndTypeAndTheme(
            Number(id),
            type,
            Number(theme)
          )
        : await getRanksByIdExternAndTheme(Number(id), Number(theme));
      setReviews(data as Array<Review>);
      setIsLoadingReview(false);
    }
  };

  useEffect(() => {
    getStatsValue();
    getReview();
  }, [id, theme]);

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>{`${title} - RankAllAndNothing`}</title>
      </Helmet>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <ReturnArrow />
        </Grid>
        <Grid item xs={12}>
          <HeaderExternValue stats={statsValue} onChangeTitle={setTitle} />
        </Grid>
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
