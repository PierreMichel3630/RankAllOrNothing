import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Friend } from "src/models/Friend";
import { AvatarAccount } from "../avatar/AvatarAccount";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { px } from "csx";
import { Link } from "react-router-dom";

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
    <Link to={`/user/${friend.user1.id}`}>
      <Card>
        <CardContent>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{
              textAlign: { xs: "center", sm: "left" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Grid item>
              <AvatarAccount avatar={friend.user1.avatar} size={80} />
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
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                gap: px(5),
              }}
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
    </Link>
  );
};

interface PropsCardRequestFriend {
  friend: Friend;
}

export const CardRequestFriend = ({ friend }: PropsCardRequestFriend) => {
  const { t } = useTranslation();

  return (
    <Link to={`/user/${friend.user2.id}`}>
      <Card>
        <CardContent>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{
              textAlign: { xs: "center", sm: "left" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Grid item>
              <AvatarAccount avatar={friend.user2.avatar} size={80} />
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
    </Link>
  );
};
