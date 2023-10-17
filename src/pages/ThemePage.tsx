import { Container, Grid, Tab, Tabs } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getThemeById } from "src/api/supabase/theme";
import { Theme } from "src/models/Theme";
import { TitleTheme } from "src/components/commun/Title";
import { BlockThemeOverview } from "src/components/theme/BlockThemeOverview";
import { RankBlock } from "src/components/RankBlock";
import { px } from "csx";
import { Helmet } from "react-helmet-async";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { UserContext } from "src/App";

export const ThemePage = () => {
  const { t } = useTranslation();
  let { id } = useParams();
  const { language } = useContext(UserContext);

  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState<undefined | string>(undefined);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  const getTheme = async () => {
    if (id) {
      const { data } = await getThemeById(Number(id));
      const res = data as Theme;
      setTheme(res);
    }
  };

  const getTitle = () => {
    if (theme) {
      const nameLocalLanguage = theme.name[language.iso];
      const nameEnglish = theme.name[DEFAULT_ISO_LANGUAGE];
      const name = nameLocalLanguage ? nameLocalLanguage : nameEnglish;
      setTitle(name);
    }
  };

  useEffect(() => {
    getTheme();
  }, [id]);

  useEffect(() => {
    getTitle();
  }, [theme, language]);

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>
          {title ? `${title} - RankAllAndNothing` : "RankAllAndNothing"}
        </title>
      </Helmet>
      <Grid
        container
        spacing={1}
        alignItems="center"
        sx={{ position: "relative" }}
      >
        {theme && (
          <>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", gap: px(15), justifyContent: "center" }}
            >
              <TitleTheme value={theme} />
            </Grid>
            <Grid item xs={12}>
              <Tabs
                value={tab}
                onChange={handleChangeTab}
                centered
                color="secondary"
              >
                <Tab label={t("commun.overview")} />
                <Tab label={t("commun.ranking")} />
              </Tabs>
            </Grid>
            <Grid item xs={12}>
              {tab === 0 ? (
                <BlockThemeOverview theme={theme} />
              ) : (
                <RankBlock theme={theme} />
              )}
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};
