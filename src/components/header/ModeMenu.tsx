import { useContext } from "react";

import { IconButton } from "@mui/material";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { Colors } from "src/style/Colors";
import { UserContext } from "src/App";

export const ModeMenu = () => {
  const { mode, setMode } = useContext(UserContext);
  return (
    <IconButton
      aria-label="light mode"
      color="inherit"
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
    >
      {mode === "light" ? (
        <LightModeIcon sx={{ fill: Colors.yellow, width: 25, height: 25 }} />
      ) : (
        <DarkModeIcon sx={{ fill: Colors.white, width: 25, height: 25 }} />
      )}
    </IconButton>
  );
};
