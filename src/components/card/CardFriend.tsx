import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Friend } from "src/models/Friend";
import { AvatarAccount } from "../avatar/AvatarAccount";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { px } from "csx";

interface PropsCardInvitationFriend {
  friend: Friend;
  validate: () => void;
  refuse: () => void;
}

export const CardInvitationFriend = ({
  friend,
  validate,
  refuse,
}: PropsCardInvitationFriend) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          flexDirection="row"
          alignItems="center"
        >
          <Grid item>
            <AvatarAccount avatar={friend.user1.avatar} size={50} />
          </Grid>
          <Grid item>
            <Typography variant="h2">{friend.user1.username}</Typography>
            <Typography variant="caption" sx={{ fontSize: 10 }}>
              {t("commun.createdthe", {
                value: moment(friend.user1.created_at).format("DD MMMM YYYY"),
              })}
            </Typography>
          </Grid>
          <Grid
            item
            sx={{ display: "flex", flexDirection: "column", gap: px(5) }}
          >
            <Button
              variant="contained"
              fullWidth
              color="success"
              onClick={validate}
            >
              {t("commun.validate")}
            </Button>
            <Button
              variant="contained"
              fullWidth
              color="error"
              onClick={refuse}
            >
              {t("commun.refuse")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

interface PropsCardRequestFriend {
  friend: Friend;
}

export const CardRequestFriend = ({ friend }: PropsCardRequestFriend) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          flexDirection="row"
          alignItems="center"
        >
          <Grid item>
            <AvatarAccount avatar={friend.user2.avatar} size={50} />
          </Grid>
          <Grid item>
            <Typography variant="h2">{friend.user2.username}</Typography>
            <Typography variant="caption" sx={{ fontSize: 10 }}>
              {t("commun.createdthe", {
                value: moment(friend.user2.created_at).format("DD MMMM YYYY"),
              })}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              {t("commun.waitvalidation")}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 10 }}>
              {moment(friend.created_at).format("DD MMMM YYYY")}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
