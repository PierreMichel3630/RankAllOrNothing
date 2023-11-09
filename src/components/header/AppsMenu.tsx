import {
  Box,
  Grid,
  IconButton,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import { px } from "csx";
import { useState } from "react";

import AppsRoundedIcon from "@mui/icons-material/AppsRounded";

import logoFindMusics from "src/assets/app/logoFindMusics.png";
import logoMovieWatch from "src/assets/app/logoMovieWatch.png";
import logoRank from "src/assets/app/logoRank.png";
import { openInNewTab } from "src/utils/navigation";
import { Colors } from "src/style/Colors";

interface App {
  name: string;
  url: string;
  logo: string;
}

export const AppsMenu = () => {
  const APPS: Array<App> = [
    {
      name: "RankAllOrNothing",
      url: "https://rankallandnothing.web.app/",
      logo: logoRank,
    },
    {
      name: "MovieSerieSearch",
      url: "https://moviewatch-f9ee4.web.app/",
      logo: logoMovieWatch,
    },
    {
      name: "findMusics",
      url: "https://findmusic-b647d.web.app/",
      logo: logoFindMusics,
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
      <IconButton aria-label="apps" color="inherit" onClick={handleOpenMenu}>
        <AppsRoundedIcon fontSize="large" />
      </IconButton>
      <Popover
        id="menu-apps"
        sx={{
          mt: 1,
        }}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "bottom",
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
        <Paper
          sx={{
            p: px(5),
            borderRadius: px(15),
            border: "4px solid",
            borderColor: Colors.lightgrey,
          }}
        >
          <Grid container>
            {APPS.map((app, index) => (
              <Grid item xs={4} key={index}>
                <AppItem app={app} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Popover>
    </Box>
  );
};

interface PropsAppItem {
  app: App;
}
const AppItem = ({ app }: PropsAppItem) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: Colors.lightgrey,
        color: Colors.black,
      },
      borderRadius: px(15),
      p: px(5),
      m: px(5),
    }}
    onClick={() => openInNewTab(app.url)}
  >
    <img src={app.logo} width={50} />
    <Typography
      variant="caption"
      sx={{
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        maxWidth: px(100),
      }}
    >
      {app.name}
    </Typography>
  </Box>
);
