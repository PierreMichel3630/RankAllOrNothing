import { Button, Card, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Profile } from "src/models/Profile";
import { AvatarAccount } from "../avatar/AvatarAccount";
import { px } from "csx";
import moment from "moment";
import { Link } from "react-router-dom";

interface Props {
  profile: Profile;
  addToFriend?: () => void;
}

export const CardProfile = ({ profile, addToFriend }: Props) => {
  const { t } = useTranslation();

  const add = (event: any) => {
    event.preventDefault();
    if (addToFriend) addToFriend();
  };

  return (
    <Link to={`/user/${profile.id}`}>
      <Card variant="outlined">
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: px(10),
          }}
        >
          <AvatarAccount avatar={profile.avatar} size={80} />
          <Typography variant="h2">{profile.username}</Typography>
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            {t("commun.createdthe", {
              value: moment(profile.created_at).format("DD MMMM YYYY"),
            })}
          </Typography>
          {addToFriend && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              fullWidth
              onClick={add}
            >
              {t("commun.addtofriend")}
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
