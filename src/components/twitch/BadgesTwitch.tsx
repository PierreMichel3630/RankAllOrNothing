import { Grid, Tooltip } from "@mui/material";
import { VersionTwitch } from "src/models/external/Twitch";

interface Props {
  badges: Array<VersionTwitch>;
}

export const BadgesTwitch = ({ badges }: Props) => (
  <Grid container spacing={1}>
    {badges.map((badge) => (
      <Grid item>
        <Tooltip title={badge.title}>
          <img src={badge.image_url_2x} />
        </Tooltip>
      </Grid>
    ))}
  </Grid>
);
