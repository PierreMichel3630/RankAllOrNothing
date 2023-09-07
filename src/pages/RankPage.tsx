import { Container, Grid, IconButton, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { UserContext } from "src/App";
import { getAllThemes } from "src/api/supabase/theme";
import { RankBlock } from "src/components/RankBlock";
import { ThemeAutocomplete } from "src/components/input/ThemeAutocomplete";
import { BlockRankTmdb } from "src/components/tmdb/BlockRankTmdb";
import { ThemeView } from "src/models/Theme";
import { THEMETMDB } from "src/routes/movieRoutes";
import { useQuery } from "src/utils/hook";

import LinkIcon from "@mui/icons-material/Link";

export const RankPage = () => {
  const { t } = useTranslation();
  const { language } = useContext(UserContext);

  const [theme, setTheme] = useState<ThemeView | undefined>(undefined);
  const [themes, setThemes] = useState<Array<ThemeView>>([]);

  const params = useQuery();
  const idTheme = params.has("theme")
    ? (params.get("theme") as string)
    : undefined;

  const getThemes = async () => {
    const { data } = await getAllThemes();
    const datas = data as Array<ThemeView>;
    setThemes(datas);
    if (idTheme) {
      const selectTheme = datas.find((el) => el.id === Number(idTheme));
      setTheme(selectTheme ? selectTheme : datas[0]);
    } else {
      setTheme(datas[0]);
    }
  };

  useEffect(() => {
    getThemes();
  }, []);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{t("commun.myrank")}</Typography>
        </Grid>
        {language && theme && (
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <ThemeAutocomplete
                  theme={theme}
                  themes={themes}
                  language={language}
                  onChange={(value) => setTheme(value)}
                />
              </Grid>
              <Grid item>
                <Link to={`/theme/${theme.id}`}>
                  <IconButton type="button" size="large">
                    <LinkIcon fontSize="large" />
                  </IconButton>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        )}
        {theme && (
          <>
            {theme.id === THEMETMDB ? (
              <Grid item xs={12}>
                <BlockRankTmdb />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <RankBlock theme={theme} />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Container>
  );
};
