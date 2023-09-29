import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "src/App";
import { getMovieDetails } from "src/api/tmdb/movie";
import { getPersonDetails } from "src/api/tmdb/person";
import { getTvDetails } from "src/api/tmdb/tv";
import { Profile } from "src/models/Profile";
import { RankCompareExtern } from "src/models/Rank";
import { MediaType } from "src/models/tmdb/enum";
import { style } from "typestyle";
import { CompareValueBlock } from "./CompareValueBlock";
import { BASEURLMOVIE } from "src/routes/movieRoutes";
import { Link } from "react-router-dom";

const cardCss = style({
  height: percent(100),
  display: "flex",
  flexDirection: "column",
});

interface Value {
  name: string;
  image: string;
}

interface Props {
  rank: RankCompareExtern;
  user1: Profile;
  user2: Profile;
}

export const CardRankTmdbCompare = ({ rank, user1, user2 }: Props) => {
  const { language } = useContext(UserContext);

  const [value, setValue] = useState<undefined | Value>(undefined);
  const [loading, setLoading] = useState(true);

  const getItemTMDB = () => {
    const id = rank.id;
    if (language && id !== null) {
      switch (rank.type as MediaType) {
        case MediaType.tv:
          getTvDetails(Number(id), language.iso).then((res) => {
            setValue({
              name: res.name,
              image: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
            });
            setLoading(false);
          });
          break;
        case MediaType.movie:
          getMovieDetails(Number(id), language.iso).then((res) => {
            setValue({
              name: res.title,
              image: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
            });
            setLoading(false);
          });
          break;
        case MediaType.person:
          getPersonDetails(Number(id), language.iso).then((res) => {
            setValue({
              name: res.name,
              image: `https://image.tmdb.org/t/p/w500${res.profile_path}`,
            });
            setLoading(false);
          });
          break;
        default:
          getMovieDetails(Number(id), language.iso).then((res) => {
            setValue({
              name: res.title,
              image: `https://image.tmdb.org/t/p/w500${res.poster_path}`,
            });
            setLoading(false);
          });
          break;
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    getItemTMDB();
  }, [rank, language]);

  const rankUser1 = rank.rankUser1 ? rank.rankUser1.rank : null;
  const rankUser2 = rank.rankUser2 ? rank.rankUser2.rank : null;

  const notationUser1 = rank.rankUser1 ? rank.rankUser1.notation : null;
  const notationUser2 = rank.rankUser2 ? rank.rankUser2.notation : null;

  return (
    <Link to={`${BASEURLMOVIE}/${rank.type.toString()}/${rank.id}`}>
      <Card className={cardCss}>
        {loading || value === undefined ? (
          <>
            <Skeleton
              variant="rectangular"
              sx={{ width: percent(100), height: px(250) }}
            />
            <CardContent>
              <Skeleton width="60%" />
              <Skeleton width="20%" />
            </CardContent>
          </>
        ) : (
          <>
            <CardMedia
              sx={{
                width: percent(100),
                aspectRatio: "2/3",
                minHeight: px(300),
              }}
              image={value.image}
              title={value.name}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Typography variant="h4">{value.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <CompareValueBlock
                    user1={user1}
                    user2={user2}
                    valueUser1={rankUser1}
                    valueUser2={rankUser2}
                    title={"Rank"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <CompareValueBlock
                    user1={user1}
                    user2={user2}
                    valueUser1={notationUser1}
                    valueUser2={notationUser2}
                    title={"Notation"}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </>
        )}
      </Card>
    </Link>
  );
};
