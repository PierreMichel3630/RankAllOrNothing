import { Grid, Typography } from "@mui/material";
import { Profile } from "src/models/Profile";
import { AvatarAccount } from "../avatar/AvatarAccount";
import { Colors } from "src/style/Colors";

interface Props {
  user1: Profile;
  user2: Profile;
  title: string;
  valueUser1: number | null;
  valueUser2: number | null;
}

export const CompareValueBlock = ({
  user1,
  user2,
  title,
  valueUser1,
  valueUser2,
}: Props) => {
  const diff =
    valueUser1 === null || valueUser2 === null ? null : valueUser1 - valueUser2;

  const getColorDiff = () => {
    let color = Colors.greyDarkMode;
    if (diff !== null) {
      if (diff > 0) {
        color = Colors.green;
      } else if (diff < 0) {
        color = Colors.red;
      }
    }
    return color;
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={9}>
        <Typography variant="h2">{title}</Typography>
      </Grid>
      <Grid item xs={3} sx={{ textAlign: "right" }}>
        <Typography variant="h2" sx={{ color: getColorDiff() }}>
          {diff !== null ? diff : "--"}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={2}>
            <AvatarAccount avatar={user1.avatar} size={30} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h4">{user1.username}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">
              {valueUser1 ? valueUser1 : "--"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={2}>
            <AvatarAccount avatar={user2.avatar} size={30} />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h4">{user2.username}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">
              {valueUser2 ? valueUser2 : "--"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
