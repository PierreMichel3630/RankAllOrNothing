import { Badge, Box, IconButton, Menu } from "@mui/material";
import { useEffect, useState } from "react";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { Notification } from "src/models/Notification";
import { Colors } from "src/style/Colors";
import { NotificationMessage } from "../commun/NotificationMessage";
import {
  SUPABASE_NOTIFICATION_TABLE,
  countNotificationNotRead,
  selectNotification,
  updateReadAllNotification,
} from "src/api/supabase/notification";
import { supabase } from "src/api/supabase";

export const NotificationsMenu = () => {
  const [notifications, setNotifications] = useState<Array<Notification>>([]);
  const [notificationNotRead, setNotificationNotRead] = useState<null | number>(
    null
  );
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
    readAllNotifications();
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  const readAllNotifications = async () => {
    const { error } = await updateReadAllNotification();
    if (!error) {
      setNotificationNotRead(0);
    }
  };

  const getNotifications = async () => {
    const { data } = await selectNotification();
    setNotifications(data as Array<Notification>);
  };

  const getCountNewNotifications = async () => {
    const res = await countNotificationNotRead();
    setNotificationNotRead(res.count);
  };

  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: SUPABASE_NOTIFICATION_TABLE,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [...prev, newNotification]);
          if (!newNotification.isread) {
            setNotificationNotRead((prev) => (prev !== null ? prev + 1 : 1));
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    getNotifications();
    getCountNewNotifications();
  }, []);

  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        aria-label="notifications"
        color="inherit"
        onClick={handleOpenMenu}
      >
        <Badge color="error" badgeContent={notificationNotRead} max={10}>
          <NotificationsIcon
            sx={{ fill: Colors.grey, width: 25, height: 25 }}
          />
        </Badge>
      </IconButton>
      <Menu
        sx={{ mt: "45px", p: 0 }}
        id="menu-appbar"
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchor)}
        onClose={handleCloseMenu}
      >
        {notifications.map((notification, index) => (
          <NotificationMessage
            key={index}
            notification={notification}
            onClose={handleCloseMenu}
          />
        ))}
      </Menu>
    </Box>
  );
};
