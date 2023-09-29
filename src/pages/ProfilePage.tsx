import { Container, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { UserContext } from "src/App";
import { selectFriendByProfileId } from "src/api/supabase/friend";
import { getProfil } from "src/api/supabase/profile";
import { getAllThemes } from "src/api/supabase/theme";
import { RankProfileBlock } from "src/components/RankBlock";
import { UnauthorizedBlock } from "src/components/UnauthorizedBlock";
import { AvatarAccount } from "src/components/avatar/AvatarAccount";
import { ThemeAutocomplete } from "src/components/input/ThemeAutocomplete";
import { RankTmdbProfileBlock } from "src/components/tmdb/BlockRankTmdb";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FriendNotJoin } from "src/models/Friend";
import { Profile } from "src/models/Profile";
import { Theme } from "src/models/Theme";
import { THEMETMDB } from "src/routes/movieRoutes";

export const ProfilePage = () => {
  let { id } = useParams();
  const { t } = useTranslation();
  const { language } = useContext(UserContext);
  const { profile } = useAuth();

  const [profileSelect, setProfileSelect] = useState<null | Profile>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<undefined | boolean>(
    undefined
  );

  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [themes, setThemes] = useState<Array<Theme>>([]);

  const getProfile = async () => {
    if (id && profile) {
      if (id === profile.id) {
        setProfileSelect(profile);
        setIsLoading(false);
      } else {
        const { data } = await getProfil(id);
        setProfileSelect(data as Profile);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getProfile();
    getFriend();
  }, [id, profile]);

  const getThemes = async () => {
    const { data } = await getAllThemes();
    const datas = data as Array<Theme>;
    setThemes(datas);
    setTheme(datas[0]);
  };

  useEffect(() => {
    getThemes();
  }, []);

  const getFriend = async () => {
    if (id && profile) {
      if (id === profile.id) {
        setIsAuthorized(true);
      } else {
        const { data } = await selectFriendByProfileId(id);
        const friend = data as FriendNotJoin;

        setIsAuthorized(
          friend !== null
            ? friend.status === "VALID" ||
                (friend.status === "PROGRESS" && friend.user1 === id)
            : false
        );
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        {profileSelect && (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <AvatarAccount avatar={profileSelect.avatar} size={100} />
            <div>
              <Typography variant="h1">{profileSelect.username}</Typography>
              <Typography variant="caption">
                {t("commun.createdthe", {
                  value: moment(profileSelect.created_at).format(
                    "DD MMMM YYYY"
                  ),
                })}
              </Typography>
            </div>
          </Grid>
        )}
        {isAuthorized && (
          <>
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
            {theme && profileSelect && (
              <Grid item xs={12}>
                {theme.id === THEMETMDB ? (
                  <Grid item xs={12}>
                    <RankTmdbProfileBlock profile={profileSelect} />
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <RankProfileBlock theme={theme} profile={profileSelect} />
                  </Grid>
                )}
              </Grid>
            )}
          </>
        )}

        {isAuthorized === false && (
          <Grid item xs={12}>
            <UnauthorizedBlock text={t("unauthorized.profile")} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
