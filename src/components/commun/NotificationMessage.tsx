import { Typography } from "@mui/material";
import { Notification } from "src/models/Notification";
import { style } from "typestyle";

const divCss = style({
  display: "flex",
  alignItems: "center",
  padding: 8,
  gap: 5,
});

const divTextCss = style({
  marginLeft: 10,
});

interface Props {
  notification: Notification;
}

export const NotificationMessage = ({ notification }: Props) => (
  <div className={divCss}>
    {notification.icon && notification.icon}
    <div className={divTextCss}>
      <Typography variant="h6">{notification.title}</Typography>
      <Typography variant="caption">{notification.text}</Typography>
    </div>
  </div>
);
