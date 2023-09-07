import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  Typography,
} from "@mui/material";
import { useState } from "react";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { Notification } from "src/models/Notification";
import { Colors } from "src/style/Colors";
import { NotificationMessage } from "../commun/NotificationMessage";

export const NotificationsMenu = () => {
  const notifications: Array<Notification> = [
    {
      title: "Demande d'amis",
      text: "Laudeff vous demande en amis",
      icon: (
        <Avatar
          alt="Avatar"
          src="/src/assets/man-avatar.svg"
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
  ];

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        aria-label="notifications"
        color="inherit"
        onClick={handleOpenMenu}
      >
        <NotificationsIcon sx={{ fill: Colors.grey, width: 25, height: 25 }} />
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchor)}
        onClose={handleCloseMenu}
      >
        <Typography variant="h4" sx={{ padding: 2 }}>
          Notifications
        </Typography>
        <Divider />
        {notifications.map((notification, index) => (
          <NotificationMessage key={index} notification={notification} />
        ))}
      </Menu>
    </Box>
  );
};
