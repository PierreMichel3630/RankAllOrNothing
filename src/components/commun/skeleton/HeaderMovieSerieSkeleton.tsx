import { Grid, Skeleton } from "@mui/material";
import { ChipSkeleton } from "./Skeleton";
import { px } from "csx";

export const HeaderMovieSerieSkeleton = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Skeleton variant="text" sx={{ fontSize: "50px" }} width="40%" />
    </Grid>
    <Grid item xs={12} sx={{ display: "flex", gap: 1 }}>
      <ChipSkeleton width={120} />
      <ChipSkeleton />
      <ChipSkeleton width={100} />
    </Grid>
    <Grid item xs={12} sx={{ display: "flex", gap: 1 }}>
      <Skeleton variant="rectangular" sx={{ width: px(150), height: px(25) }} />
      <Skeleton variant="text" sx={{ fontSize: "16px" }} width="15%" />
    </Grid>
    <Grid item xs={12}>
      <Skeleton variant="text" sx={{ fontSize: "16px" }} width="15%" />
      <Skeleton variant="text" sx={{ fontSize: "13px" }} width="100%" />
      <Skeleton variant="text" sx={{ fontSize: "13px" }} width="100%" />
      <Skeleton variant="text" sx={{ fontSize: "13px" }} width="25%" />
    </Grid>
  </Grid>
);
