import { Grid, Paper, Typography } from "@mui/material";
import { TwitchSegment } from "src/models/external/Twitch";
import moment from "moment";
import { useTranslation } from "react-i18next";

interface Props {
  segment: TwitchSegment;
}

export const NextStream = ({ segment }: Props) => {
  const { t } = useTranslation();
  const isCurrentDate = moment(segment.start_time).isSame(new Date(), "day");
  return (
    <Paper elevation={3} sx={{ padding: 2, width: "fit-content" }}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4">
            {isCurrentDate
              ? t("commun.today")
              : moment(segment.start_time).format("DD/MM/YYYY")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">
            {`${moment(segment.start_time).format("HH:mm")} - ${moment(
              segment.end_time
            ).format("HH:mm")}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{segment.title}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
