import { Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "src/App";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { BUCKET_VALUE, getUrlPublic } from "src/api/supabase/storage";
import { StatsValue, Value } from "src/models/Value";
import { style } from "typestyle";

const imageCss = style({
  maxWidth: percent(100),
  borderRadius: px(15),
  maxHeight: px(400),
});

interface Props {
  value: Value;
  stats?: StatsValue;
}

export const HeaderValue = ({ stats, value }: Props) => {
  const { t } = useTranslation();
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
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        sm={5}
        md={4}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <img
          src={getUrlPublic(BUCKET_VALUE, value.image)}
          className={imageCss}
        />
      </Grid>
      <Grid item xs={12} sm={7} md={8}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h1">{name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">{description}</Typography>
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
            <Typography variant="body1">{t("commun.avgnotation")}</Typography>
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
    </Grid>
  );
};

interface PropsExtern {
  value: {
    image: string;
    name: string;
    description: string;
  };
  stats?: StatsValue;
}

export const HeaderExternValue = ({ stats, value }: PropsExtern) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={1}>
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
            <Typography variant="body1">{t("commun.avgnotation")}</Typography>
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
    </Grid>
  );
};
