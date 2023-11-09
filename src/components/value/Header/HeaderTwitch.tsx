import { Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  getBadgesChannelTwitch,
  getScheduleChannelTwitch,
  getUserTwitchInformation,
} from "src/api/supabase/edgefunctions/twitchapi";
import { Loading } from "src/components/commun/Loading";
import { StatsValue } from "src/models/Value";
import {
  TwitchBadges,
  TwitchResult,
  TwitchResults,
  TwitchSchedule,
  TwitchSegment,
  TwitchUser,
  VersionTwitch,
} from "src/models/external/Twitch";
import { style } from "typestyle";

import logopartner from "../../../assets/certifTwitch.png";
import { NextStream } from "src/components/twitch/ScheduleTwitch";
import { openInNewTab } from "src/utils/navigation";
import { BadgesTwitch } from "src/components/twitch/BadgesTwitch";

const imageCss = style({
  maxWidth: percent(100),
  borderRadius: px(15),
  maxHeight: px(400),
});

const partnerLogoCss = style({
  width: px(30),
  height: px(30),
});

interface Props {
  onChangeTitle: (value: string) => void;
  stats?: StatsValue;
}

export const HeaderTwitch = ({ onChangeTitle, stats }: Props) => {
  let { id } = useParams();
  const { t } = useTranslation();

  const [user, setUser] = useState<TwitchUser | undefined>(undefined);
  const [badges, setBadges] = useState<Array<VersionTwitch>>([]);
  const [schedule, setSchedule] = useState<Array<TwitchSegment>>([]);

  const getUser = async () => {
    const { data } = await getUserTwitchInformation(Number(id));
    const res = data as TwitchResults<TwitchUser>;
    if (res.data.length > 0) {
      setUser(res.data[0]);
      onChangeTitle(res.data[0].display_name);
    }
  };

  const getSchedule = async () => {
    const { data } = await getScheduleChannelTwitch(Number(id));
    const res = data as TwitchResult<TwitchSchedule>;
    setSchedule(res.data.segments);
  };

  const getBadge = async () => {
    const { data } = await getBadgesChannelTwitch(Number(id));
    const res = data as TwitchResults<TwitchBadges>;
    setBadges(
      res.data.reduce(
        (acc, el) => [...acc, ...el.versions],
        [] as Array<VersionTwitch>
      )
    );
  };

  useEffect(() => {
    getUser();
    getBadge();
    getSchedule();
  }, [id]);

  const goTo = () => {
    if (user) {
      const urlTwitch = `https://www.twitch.tv/${user.login}`;
      openInNewTab(urlTwitch);
    }
  };

  return (
    <Grid container spacing={1}>
      {user ? (
        <>
          <Grid
            item
            xs={12}
            sm={5}
            md={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <img src={user.profile_image_url} className={imageCss} />
          </Grid>
          <Grid item xs={12} sm={7} md={8}>
            <Grid container spacing={1}>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", gap: 2, alignItems: "center" }}
              >
                <Typography
                  variant="h1"
                  sx={{ cursor: "pointer" }}
                  onClick={() => goTo()}
                >
                  {user.display_name}
                </Typography>
                {user.broadcaster_type === "partner" && (
                  <img src={logopartner} className={partnerLogoCss} />
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">{user.description}</Typography>
              </Grid>
              {schedule.length > 0 && (
                <Grid item xs={12}>
                  <NextStream segment={schedule[0]} />
                </Grid>
              )}
              <Grid item xs={12}>
                <BadgesTwitch badges={badges} />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", gap: 2, alignItems: "center" }}
              >
                <Typography variant="body1">{t("commun.avgrank")}</Typography>

                {stats && stats.avg_rank !== null ? (
                  <>
                    <Typography variant="h4">
                      {stats.avg_rank.toFixed(2)}
                    </Typography>
                    <Typography variant="caption">
                      ({stats.ranks.length} {t("commun.ranks")})
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h4">--</Typography>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", gap: 2, alignItems: "center" }}
              >
                <Typography variant="body1">
                  {t("commun.avgnotation")}
                </Typography>
                {stats && stats.avg_notation !== null ? (
                  <>
                    <Typography variant="h4">
                      {stats.avg_notation.toFixed(2)}
                    </Typography>
                    <Typography variant="caption">
                      ({stats.notations.filter((el) => el !== null).length}{" "}
                      {t("commun.notations")})
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h4">--</Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <Loading />
        </Grid>
      )}
    </Grid>
  );
};
