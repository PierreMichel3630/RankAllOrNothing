import { Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { UserContext } from "src/App";
import { getMovieDetails } from "src/api/tmdb/movie";
import { getPersonDetails } from "src/api/tmdb/person";
import { getTvDetails } from "src/api/tmdb/tv";
import { Loading } from "src/components/commun/Loading";
import { StatsValue } from "src/models/Value";
import { MediaType } from "src/models/tmdb/enum";
import { style } from "typestyle";

const imageCss = style({
  maxWidth: percent(100),
  borderRadius: px(15),
  maxHeight: px(400),
});

interface Value {
  image: string;
  name: string;
  description: string;
}

interface PropsExtern {
  onChangeTitle: (value: string) => void;
  stats?: StatsValue;
}

export const HeaderTmdb = ({ stats, onChangeTitle }: PropsExtern) => {
  let { id, type } = useParams();
  const { t } = useTranslation();
  const { language } = useContext(UserContext);

  const [value, setValue] = useState<Value | undefined>(undefined);

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

  useEffect(() => {
    getValue();
  }, [id, type]);

  useEffect(() => {
    if (value) {
      onChangeTitle(value.name);
    }
  }, [value]);

  return (
    <Grid container spacing={1}>
      {value ? (
        <>
          <Grid
            item
            xs={12}
            sm={5}
            md={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <img src={value.image} className={imageCss} />
          </Grid>
          <Grid item xs={12} sm={7} md={8}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h1">{value.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">{value.description}</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", gap: 2, alignItems: "center" }}
              >
                <Typography variant="body1">{t("commun.avgrank")}</Typography>

                {stats && stats.avg_rank !== null ? (
                  <>
                    <Typography variant="h4">
                      {stats.avg_rank.toFixed(2)}
                    </Typography>
                    <Typography variant="caption">
                      ({stats.ranks.length} {t("commun.ranks")})
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h4">--</Typography>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", gap: 2, alignItems: "center" }}
              >
                <Typography variant="body1">
                  {t("commun.avgnotation")}
                </Typography>
                {stats && stats.avg_notation !== null ? (
                  <>
                    <Typography variant="h4">
                      {stats.avg_notation.toFixed(2)}
                    </Typography>
                    <Typography variant="caption">
                      ({stats.notations.filter((el) => el !== null).length}{" "}
                      {t("commun.notations")})
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h4">--</Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <Loading />
        </Grid>
      )}
    </Grid>
  );
};
