import { Alert, Container, Grid, IconButton } from "@mui/material";
import { px } from "csx";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "src/App";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { getThemeById } from "src/api/supabase/theme";
import { BasicSearchInput } from "src/components/commun/Input";
import { TitleTheme } from "src/components/commun/Title";
import { Theme } from "src/models/Theme";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { CardChannelTwitch } from "src/components/card/CardTwitch";
import { CardHorizontalSkeleton } from "src/components/commun/skeleton/Skeleton";
import { TwitchChannel, TwitchResults } from "src/models/external/Twitch";
import { useQuery } from "src/utils/hook";
import { sortByDisplayName } from "src/utils/sort";
import { searchChannelsTwitch } from "src/api/supabase/edgefunctions/twitchapi";

export const ThemeTwitchChannelPage = () => {
  const ITEMPERPAGE = 24;
  const params = useQuery();
  const navigate = useNavigate();
  const { t } = useTranslation();
  let { id } = useParams();
  const { language } = useContext(UserContext);

  const [title, setTitle] = useState<undefined | string>(undefined);

  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [query, setQuery] = useState<string>(
    params.has("query") ? (params.get("query") as string) : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [channels, setChannels] = useState<Array<TwitchChannel>>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

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

  const submitSearch = async () => {
    if (query !== "") {
      const { data } = await searchChannelsTwitch(query, ITEMPERPAGE);
      const res = data as TwitchResults<TwitchChannel>;
      setChannels(res.data.sort(sortByDisplayName));
      setCursor(res.pagination.cursor);
      setIsEnd(res.pagination.cursor ? false : true);
      setIsLoading(false);
    } else {
      setChannels([]);
      setCursor(undefined);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setChannels([]);
    setCursor(undefined);

    const timeout = setTimeout(() => {
      navigate({
        pathname: `/external/theme/7`,
        search: `?query=${query}`,
      });
      submitSearch();
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const getNextPage = async () => {
    setIsLoading(true);
    const { data } = await searchChannelsTwitch(query, ITEMPERPAGE, cursor);
    const res = data as TwitchResults<TwitchChannel>;
    setChannels((prev) => [...prev, ...res.data.sort(sortByDisplayName)]);
    setCursor(res.pagination.cursor);
    setIsEnd(res.pagination.cursor ? false : true);
    setIsLoading(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading ||
      isEnd
    ) {
      return;
    }
    getNextPage();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [cursor, isLoading, isEnd]);

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
          </>
        )}
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs>
              <BasicSearchInput
                label={t("pages.theme.search")}
                onChange={(value) => setQuery(value)}
                value={query}
                clear={() => setQuery("")}
              />
            </Grid>
            <Grid item>
              <Link to={`/rank?theme=${theme?.id}`}>
                <IconButton>
                  <EmojiEventsIcon fontSize="large" />
                </IconButton>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        {id &&
          channels.length > 0 &&
          channels.map((value) => (
            <Grid key={value.id} item xs={12} sm={12} md={6}>
              <CardChannelTwitch value={value} idtheme={id} />
            </Grid>
          ))}

        {isLoading &&
          Array.from(new Array(8)).map((_, index) => (
            <Grid key={index} item xs={12} sm={12} md={6}>
              <CardHorizontalSkeleton />
            </Grid>
          ))}

        {query === "" && (
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <Alert severity="info">{t("commun.noresearch")}</Alert>
          </Grid>
        )}

        {query !== "" && !isLoading && channels.length === 0 && (
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <Alert severity="warning">{t("commun.noresult")}</Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
