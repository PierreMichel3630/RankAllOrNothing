import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { style } from "typestyle";
import { AccountBadge } from "../commun/AccountBadge";

import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import { User } from "@supabase/supabase-js";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useNavigate } from "react-router-dom";
import { AvatarAccount } from "../commun/Avatar";
import { px } from "csx";

const divCss = style({
  display: "flex",
  padding: 16,
  alignItems: "center",
  gap: px(5),
});

interface Setting {
  name: string;
  url: string;
}

interface Props {
  user: User;
}

export const AccountMenu = ({ user }: Props) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const { profile } = useAuth();

  const settings: Array<Setting> = [
    {
      name: t("header.account.ranking"),
      url: "/rank",
    },
    {
      name: t("header.account.parameter"),
      url: "/parameter",
    },
  ];

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const disconnect = async () => {
    handleCloseUserMenu();
    await logout();
    navigate("/");
  };

  const goTo = (url: string) => {
    handleCloseUserMenu();
    navigate(url);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <AccountBadge user={user} onClick={handleOpenUserMenu} />
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <div className={divCss}>
          <AvatarAccount picture={profile ? profile.avatar : "1"} />
          <div>
            {profile && (
              <Typography variant="h6">{profile.username}</Typography>
            )}
            <Typography variant="caption" color="secondary">
              {user.email}
            </Typography>
          </div>
        </div>
        <Divider />
        {settings.map((setting, index) => (
          <MenuItem key={index} onClick={() => goTo(setting.url)}>
            <ListItemText>{setting.name}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={disconnect}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("header.account.logout")}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};
