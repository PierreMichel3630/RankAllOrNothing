import { AlertColor, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { insertFriend, selectFriend } from "src/api/supabase/friend";
import { searchProfile } from "src/api/supabase/profile";
import { CardProfile } from "src/components/card/CardProfile";
import { BasicSearchInput } from "src/components/commun/Input";
import { Loading } from "src/components/commun/Loading";
import { MessageSnackbar } from "src/components/commun/Snackbar";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Friend, FriendInsert } from "src/models/Friend";
import { Profile } from "src/models/Profile";

export const AddFriendPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState<Array<Profile>>([]);

  const [uuidfriends, setUuidFriends] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");

  const getUsers = async () => {
    const { data } = await searchProfile(search, uuidfriends);
    setProfiles(data as Array<Profile>);
  };

  useEffect(() => {
    if (search !== "") {
      getUsers();
    } else {
      setProfiles([]);
    }
  }, [search, user, uuidfriends]);

  const getFriends = async () => {
    const { data } = await selectFriend();
    const friends = data as Array<Friend>;
    const uuids: Array<string> = [];
    friends.forEach((el) => {
      uuids.push(el.user1.id);
      uuids.push(el.user2.id);
    });
    setUuidFriends([...new Set(uuids)]);
    setIsLoading(false);
  };

  useEffect(() => {
    getFriends();
  }, []);

  const addToFriend = async (profile: Profile) => {
    if (user !== null) {
      const invitation: FriendInsert = {
        user1: user.id,
        user2: profile.id,
      };
      const { error } = await insertFriend(invitation);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setUuidFriends((prev) => [...prev, profile.id]);
        setSeverity("success");
        setMessage(t("alert.sendfriendrequest"));
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  return (
    <Grid container spacing={1}>
      {isLoading ? (
        <Grid item xs={12}>
          <Loading />
        </Grid>
      ) : (
        <Grid item xs={12}>
          <BasicSearchInput
            label={t("commun.searchfriend")}
            onChange={(value) => setSearch(value)}
            value={search}
            clear={() => setSearch("")}
          />
        </Grid>
      )}
      {profiles.map((profile) => (
        <Grid item xs={3} key={profile.id}>
          <CardProfile
            profile={profile}
            addToFriend={() => addToFriend(profile)}
          />
        </Grid>
      ))}
      <MessageSnackbar
        autoHideDuration={600000}
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
        severity={severity}
      />
    </Grid>
  );
};
