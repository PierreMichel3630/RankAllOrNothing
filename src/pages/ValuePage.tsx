import { Alert, Container, Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { UserContext } from "src/App";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { getMaxRankByTheme, getRanksByValue } from "src/api/supabase/rank";

import { getStatsValueById, getValueById } from "src/api/supabase/value";
import { ReturnArrow } from "src/components/NavigationButton";
import { CardReview } from "src/components/card/CardReview";
import { DataDonut, DonutChart } from "src/components/chart/DonutChart";
import { Loading } from "src/components/commun/Loading";
import { ReviewSkeleton } from "src/components/commun/skeleton/Skeleton";
import { HeaderValue } from "src/components/value/HeaderValue";
import { Review } from "src/models/Review";
import { StatsValue, Value } from "src/models/Value";
import { Colors } from "src/style/Colors";

export const ValuePage = () => {
  let { id } = useParams();
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
  const [title, setTitle] = useState<undefined | string>(undefined);

  const getTotalValueTheme = async (idTheme: number) => {
    const res = await getMaxRankByTheme(Number(idTheme));
    if (res.data !== null) setMax(res.data[0].rank);
  };

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
  }, [statsValue, max]);

  const getValue = async () => {
    if (id) {
      const { data } = await getValueById(Number(id));
      const res = data as Value;
      setValue(res);
      getTotalValueTheme(res.theme);
    }
  };

  const getStatsValue = async () => {
    if (id) {
      const { data } = await getStatsValueById(Number(id));
      if (data !== null) {
        setStatsValue(data as StatsValue);
      }
    }
  };

  const getReview = async () => {
    setIsLoadingReview(true);
    if (id) {
      const { data } = await getRanksByValue(Number(id));
      setReviews(data as Array<Review>);
      setIsLoadingReview(false);
    }
  };
  const getTitle = () => {
    if (value) {
      const nameLocalLanguage = value.name[language.iso];
      const nameEnglish = value.name[DEFAULT_ISO_LANGUAGE];
      const name = nameLocalLanguage ? nameLocalLanguage : nameEnglish;
      setTitle(name);
    }
  };

  useEffect(() => {
    getTitle();
  }, [value, language]);

  useEffect(() => {
    getValue();
    getStatsValue();
    getReview();
  }, [id]);

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>
          {title ? `${title} - RankAllAndNothing` : "RankAllAndNothing"}
        </title>
      </Helmet>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <ReturnArrow />
        </Grid>
        {value ? (
          <>
            <Grid item xs={12}>
              <HeaderValue value={value} stats={statsValue} />
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
