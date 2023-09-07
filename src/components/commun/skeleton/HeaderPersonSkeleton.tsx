import { Grid, Skeleton } from "@mui/material";
import { percent, px } from "csx";

export const HeaderPersonSkeleton = () => (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={3}>
      <Skeleton
        variant="rectangular"
        sx={{ width: percent(100), height: px(400) }}
      />
    </Grid>
    <Grid item xs={12} sm={9}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Skeleton variant="text" sx={{ fontSize: "50px" }} width="40%" />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: "16px" }} width="12%" />
          <Skeleton variant="text" sx={{ fontSize: "16px" }} width="20%" />
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: "16px" }} width="15%" />
          <Skeleton variant="text" sx={{ fontSize: "16px" }} width="18%" />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="text" sx={{ fontSize: "16px" }} width="10%" />
          <Skeleton variant="text" sx={{ fontSize: "13px" }} width="100%" />
          <Skeleton variant="text" sx={{ fontSize: "13px" }} width="100%" />
          <Skeleton variant="text" sx={{ fontSize: "13px" }} width="100%" />
          <Skeleton variant="text" sx={{ fontSize: "13px" }} width="100%" />
          <Skeleton variant="text" sx={{ fontSize: "13px" }} width="100%" />
          <Skeleton variant="text" sx={{ fontSize: "13px" }} width="100%" />
          <Skeleton variant="text" sx={{ fontSize: "13px" }} width="25%" />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);
