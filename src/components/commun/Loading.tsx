import { CircularProgress } from "@mui/material";
import { percent } from "csx";

export const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: percent(100),
    }}
  >
    <CircularProgress color="inherit" size={60} />
  </div>
);
