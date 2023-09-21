import { Alert, AlertColor, Divider, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectFriend, updateFriend } from "src/api/supabase/friend";
import {
  CardInvitationFriend,
  CardRequestFriend,
} from "src/components/card/CardFriend";
import { MessageSnackbar } from "src/components/commun/Snackbar";
import { CardFriendSkeleton } from "src/components/commun/skeleton/Skeleton";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS, Friend, FriendUpdate } from "src/models/Friend";

export const InvitationFriendPage = () => {
  const LOADINGITEM = 3;
  const { user } = useAuth();
  const { t } = useTranslation();

  const [friends, setFriends] = useState<Array<Friend>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");

  const getFriends = async () => {
    const { data } = await selectFriend(FRIENDSTATUS.PROGRESS);
    setFriends(data as Array<Friend>);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getFriends();
  }, []);

  const confirmFriend = async (friend: Friend, status: FRIENDSTATUS) => {
    const value: FriendUpdate = {
      id: friend.id,
      status: status,
    };
    const { error } = await updateFriend(value);
    if (error) {
      setSeverity("error");
      setMessage(t("commun.error"));
    } else {
      setFriends((prev) => [...prev].filter((el) => el.id !== friend.id));
      setSeverity("success");
      setMessage(
        status === FRIENDSTATUS.VALID
          ? t("alert.validatefriendrequest")
          : t("alert.refusefriendrequest")
      );
    }
  };

  const invitations = friends.filter(
    (el) => user !== null && user.id === el.user2.id
  );

  const requests = friends.filter(
    (el) => user !== null && user.id === el.user1.id
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2">{t("commun.myinvitation")}</Typography>
      </Grid>
      {isLoading ? (
        Array.from(new Array(LOADINGITEM)).map((_, index) => (
          <Grid key={index} item xs={12}>
            <CardFriendSkeleton />
          </Grid>
        ))
      ) : invitations.length > 0 ? (
        invitations.map((invitation) => (
          <Grid item xs={12} key={invitation.id}>
            <CardInvitationFriend
              friend={invitation}
              validate={() => confirmFriend(invitation, FRIENDSTATUS.VALID)}
              refuse={() => confirmFriend(invitation, FRIENDSTATUS.REFUSE)}
            />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Alert severity="warning">{t("commun.noresultinvitation")}</Alert>
        </Grid>
      )}
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h2">{t("commun.myrequests")}</Typography>
      </Grid>
      {isLoading ? (
        Array.from(new Array(LOADINGITEM)).map((_, index) => (
          <Grid key={index} item xs={12}>
            <CardFriendSkeleton />
          </Grid>
        ))
      ) : requests.length > 0 ? (
        requests.map((invitation) => (
          <Grid item xs={12} key={invitation.id}>
            <CardRequestFriend friend={invitation} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Alert severity="warning">{t("commun.noresultrequest")}</Alert>
        </Grid>
      )}
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
