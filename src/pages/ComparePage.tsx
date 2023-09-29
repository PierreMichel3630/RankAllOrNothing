import { Container, Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "src/App";
import { selectFriend } from "src/api/supabase/friend";
import { getAllThemes } from "src/api/supabase/theme";
import { CompareRankBlock } from "src/components/compare/CompareRankBlock";
import { CompareTMDBRankBlock } from "src/components/compare/CompareTMDBRankBlock";
import { ProfileAutocomplete } from "src/components/input/ProfileAutocomplete";
import { ThemeAutocomplete } from "src/components/input/ThemeAutocomplete";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS, Friend } from "src/models/Friend";
import { Profile } from "src/models/Profile";
import { Theme } from "src/models/Theme";
import { THEMETMDB } from "src/routes/movieRoutes";
import { sortByUsername } from "src/utils/sort";

export const ComparePage = () => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const { language } = useContext(UserContext);

  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [themes, setThemes] = useState<Array<Theme>>([]);

  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [profiles, setProfiles] = useState<Array<Profile>>([]);

  const [user1, setUser1] = useState<Profile | undefined>(undefined);
  const [user2, setUser2] = useState<Profile | undefined>(undefined);

  const getFriends = async () => {
    if (profile !== null) {
      const { data } = await selectFriend(FRIENDSTATUS.VALID);
      const friends = data as Array<Friend>;
      const profiles = friends.map((el) =>
        el.user1.id === profile.id ? el.user2 : el.user1
      );
      setProfiles([profile, ...profiles.sort(sortByUsername)]);
      setUser1(profile);
      setUser2(profiles.length > 0 ? profiles[0] : profile);
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    setIsLoadingProfile(true);
    getFriends();
  }, [user, profile]);

  const getThemes = async () => {
    const { data } = await getAllThemes();
    const datas = data as Array<Theme>;
    setThemes(datas);
    setTheme(datas[0]);
  };

  useEffect(() => {
    getThemes();
  }, []);

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ProfileAutocomplete
            profile={user1}
            results={profiles}
            onSelect={(value) => setUser1(value)}
            placeholder={t("commun.user1")}
            isLoading={isLoadingProfile}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ProfileAutocomplete
            profile={user2}
            results={profiles}
            onSelect={(value) => setUser2(value)}
            placeholder={t("commun.user2")}
            isLoading={isLoadingProfile}
          />
        </Grid>
        {theme && language && (
          <Grid item xs={12}>
            <ThemeAutocomplete
              theme={theme}
              themes={themes}
              language={language}
              onChange={(value) => setTheme(value)}
            />
          </Grid>
        )}
        {theme && (
          <>
            {theme.id === THEMETMDB ? (
              <Grid item xs={12}>
                <CompareTMDBRankBlock user1={user1} user2={user2} />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <CompareRankBlock user1={user1} user2={user2} theme={theme} />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Container>
  );
};
