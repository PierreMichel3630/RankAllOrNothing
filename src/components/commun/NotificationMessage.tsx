import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Notification } from "src/models/Notification";
import { style } from "typestyle";
import { AvatarAccount } from "../avatar/AvatarAccount";
import { useEffect, useState } from "react";
import { NotificationSkeleton } from "./skeleton/Skeleton";
import { selectFriendById } from "src/api/supabase/friend";
import { Friend } from "src/models/Friend";
import { Link } from "react-router-dom";
import { Colors } from "src/style/Colors";

const divCss = style({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: 8,
  gap: 5,
  $nest: {
    "&:hover": {
      backgroundColor: Colors.greyDarkMode,
    },
  },
});

const divTextCss = style({
  marginLeft: 10,
});

interface Props {
  notification: Notification;
  onClose: () => void;
}

export const NotificationMessage = ({ notification, onClose }: Props) => (
  <NotificationFriendRequestMessage
    notification={notification}
    onClose={onClose}
  />
);

const NotificationFriendRequestMessage = ({ notification, onClose }: Props) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [friend, setFriend] = useState<null | Friend>(null);

  const getFriend = async () => {
    const { data } = await selectFriendById(notification.extra.id);
    setFriend(data as Friend);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getFriend();
  }, [notification]);

  return isLoading ? (
    <NotificationSkeleton />
  ) : (
    <Link to="/friends/invitation" onClick={onClose}>
      <div className={divCss}>
        {friend !== null && (
          <AvatarAccount avatar={friend.user1.avatar} size={45} />
        )}
        <div className={divTextCss}>
          <Typography variant="h6">
            {t("notification.FRIENDREQUEST.title")}
          </Typography>
          {friend !== null && (
            <Typography variant="caption">
              {t("notification.FRIENDREQUEST.text", {
                username: friend.user1.username,
              })}
            </Typography>
          )}
        </div>
      </div>
    </Link>
  );
};
