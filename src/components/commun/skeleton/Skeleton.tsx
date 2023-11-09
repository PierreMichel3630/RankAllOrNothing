import { Card, CardContent, Grid, Paper, Skeleton } from "@mui/material";
import { percent, px } from "csx";

export const CardSearchSkeleton = () => (
  <Card sx={{ height: percent(100) }}>
    <Skeleton
      variant="rectangular"
      sx={{ width: percent(100), height: px(250) }}
    />
    <CardContent>
      <Skeleton width="60%" />
      <Skeleton width="20%" />
      <Skeleton width="50%" />
      <Skeleton width="25%" />
      <Skeleton />
      <Skeleton />
      <Skeleton width="30%" />
    </CardContent>
  </Card>
);

export const CardActorSkeleton = () => (
  <Card sx={{ height: percent(100) }}>
    <Skeleton
      variant="rectangular"
      sx={{ width: percent(100), height: px(250) }}
    />
    <CardContent>
      <Skeleton width="60%" />
      <Skeleton width="20%" />
    </CardContent>
  </Card>
);

export const CardMovieSerieSkeleton = () => (
  <Card sx={{ height: percent(100) }}>
    <Skeleton
      variant="rectangular"
      sx={{ width: percent(100), height: px(250) }}
    />
    <CardContent>
      <Skeleton width="60%" />
      <Skeleton width="20%" />
    </CardContent>
  </Card>
);

export const CardEpisodeSkeleton = () => (
  <Card sx={{ height: percent(100) }}>
    <Grid container>
      <Grid item xs={12} sm={4}>
        <Skeleton
          variant="rectangular"
          sx={{ width: percent(100), height: px(200) }}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <CardContent>
          <Skeleton variant="text" width="30%" sx={{ fontSize: px(16) }} />
          <Skeleton variant="text" width="100%" sx={{ fontSize: px(13) }} />
          <Skeleton variant="text" width="100%" sx={{ fontSize: px(13) }} />
          <Skeleton variant="text" width="100%" sx={{ fontSize: px(13) }} />
          <Skeleton variant="text" width="15%" sx={{ fontSize: px(13) }} />
        </CardContent>
      </Grid>
    </Grid>
  </Card>
);

export const EpisodeSkeleton = () => (
  <>
    <Grid item xs={12} sm={3}>
      <Skeleton
        variant="rectangular"
        sx={{ width: percent(100), height: px(150) }}
      />
    </Grid>
    <Grid item xs={12} sm={9}>
      <Skeleton width="40%" />
      <Skeleton width="100%" />
      <Skeleton width="100%" />
      <Skeleton width="20%" />
    </Grid>
  </>
);

export const NavigateEpisodeSkeleton = () => (
  <Skeleton
    variant="rectangular"
    sx={{ width: percent(100), height: px(30) }}
  />
);

export const PhotoSkeleton = () => (
  <Skeleton
    variant="rectangular"
    sx={{ width: percent(100), height: px(150) }}
  />
);

export const VideoSkeleton = () => (
  <Skeleton
    variant="rectangular"
    sx={{ width: percent(100), height: px(480) }}
  />
);

interface PropsChip {
  width?: number;
  height?: number;
}

export const ChipSkeleton = ({ width = 80, height = 32 }: PropsChip) => (
  <Skeleton
    variant="rectangular"
    sx={{ width: px(width), height: px(height), borderRadius: px(16) }}
  />
);

export const CardSkeleton = () => (
  <Card sx={{ height: percent(100) }}>
    <Skeleton
      variant="rectangular"
      sx={{ width: percent(100), height: px(250) }}
    />
    <CardContent>
      <Skeleton width="60%" />
      <Skeleton width="20%" />
    </CardContent>
  </Card>
);

export const CardFriendSkeleton = () => (
  <Card>
    <CardContent>
      <Grid
        container
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
      >
        <Grid item>
          <Skeleton variant="circular" width={80} height={80} />
        </Grid>
        <Grid item>
          <Skeleton width={150} height={15} />
          <Skeleton width={80} height={15} />
        </Grid>
        <Grid item>
          <Skeleton width={110} height={15} />
          <Skeleton width={65} height={15} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export const CardHorizontalSkeleton = () => (
  <Card>
    <CardContent>
      <Grid container flexDirection="row" alignItems="center" spacing={4}>
        <Grid item>
          <Skeleton variant="circular" width={80} height={80} />
        </Grid>
        <Grid item>
          <Skeleton width={150} height={15} />
          <Skeleton width={80} height={15} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export const NotificationSkeleton = () => (
  <Grid
    container
    justifyContent="space-between"
    flexDirection="row"
    alignItems="center"
    spacing={2}
    sx={{ p: 2 }}
  >
    <Grid item>
      <Skeleton variant="circular" width={45} height={45} />
    </Grid>
    <Grid item>
      <Skeleton width={80} height={20} />
      <Skeleton width={150} height={15} />
    </Grid>
  </Grid>
);

export const BadgeAccountSkeleton = () => (
  <Grid container spacing={2} alignItems="center" sx={{ ml: px(2) }}>
    <Grid item>
      <Skeleton
        width={50}
        height={20}
        sx={{ display: { xs: "none", md: "flex" } }}
      />
    </Grid>
    <Grid item>
      <Skeleton variant="circular" width={30} height={30} />
    </Grid>
  </Grid>
);

export const ItemAccountSkeleton = () => (
  <Grid container alignItems="center">
    <Grid item xs={3}>
      <Skeleton variant="circular" width={50} height={50} />
    </Grid>
    <Grid item xs={9}>
      <Skeleton width={150} height={15} />
      <Skeleton width={80} height={15} />
    </Grid>
  </Grid>
);

export const ReviewSkeleton = () => (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        <Skeleton variant="circular" width={50} height={50} />
      </Grid>
      <Grid item>
        <Skeleton width={150} height={20} />
        <Skeleton width={400} height={15} />
        <Skeleton width={200} height={15} />
      </Grid>
    </Grid>
  </Paper>
);
