import { Container, Grid, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MailIcon from "@mui/icons-material/Mail";
import { getBreakpoint } from "src/utils/mediaQuery";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BASEURLFRIENDS } from "src/routes/friendsRoutes";

export const FriendsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const MENUS = [
    {
      label: t("commun.myfriends"),
      icon: <GroupsIcon />,
      url: BASEURLFRIENDS,
    },
    {
      label: t("commun.addfriend"),
      icon: <PersonAddAlt1Icon />,
      url: BASEURLFRIENDS + "/add",
    },
    {
      label: t("commun.waitinvitation"),
      icon: <MailIcon />,
      url: BASEURLFRIENDS + "/invitation",
    },
  ];

  const menuSelect = MENUS.findIndex((el) => el.url === location.pathname);

  const [tab, setTab] = useState(menuSelect);
  const breakpoint = getBreakpoint();

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    setTab(menuSelect);
  }, [menuSelect]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            variant="fullWidth"
            color="secondary"
          >
            {MENUS.map((menu) => (
              <Tab
                sx={{ minHeight: "inherit" }}
                key={menu.url}
                label={menu.label}
                icon={menu.icon}
                iconPosition={breakpoint === "xs" ? "top" : "start"}
                onClick={() => navigate(menu.url)}
              />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
  );
};
