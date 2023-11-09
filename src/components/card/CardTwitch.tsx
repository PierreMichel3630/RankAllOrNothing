import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { padding, px } from "csx";
import ISO6391 from "iso-639-1";
import { Link } from "react-router-dom";
import { TwitchChannel } from "src/models/external/Twitch";
import { Colors } from "src/style/Colors";

interface Props {
  idtheme: string;
  value: TwitchChannel;
}

export const CardChannelTwitch = ({ idtheme, value }: Props) => {
  return (
    <Link to={`/external/theme/${idtheme}/value/${value.id}/statistic`}>
      <Card sx={{ position: "relative" }}>
        {value.is_live && (
          <Box
            sx={{
              backgroundColor: Colors.red,
              padding: padding(2, 10),
              width: "fit-content",
              borderRadius: px(5),
              position: "absolute",
              top: 5,
              right: 5,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 900 }}>
              LIVE
            </Typography>
          </Box>
        )}
        <CardContent>
          <Grid container alignItems="center" spacing={4}>
            <Grid item>
              <Avatar
                alt="Avatar"
                src={value.thumbnail_url}
                sx={{
                  width: 80,
                  height: 80,
                }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h2">{value.display_name}</Typography>
              <Typography variant="body1">
                {ISO6391.getNativeName(value.broadcaster_language)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};
