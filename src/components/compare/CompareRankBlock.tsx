import { Alert, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Rank, RankCompare } from "src/models/Rank";
import { CardSkeleton } from "../commun/skeleton/Skeleton";
import { CardRankCompare } from "./CardRankCompare";
import { uniqBy } from "lodash";
import { Profile } from "src/models/Profile";
import { sortByDiff } from "src/utils/sort";
import { useEffect, useState } from "react";
import { Theme } from "src/models/Theme";
import { getRankByUser } from "src/api/supabase/rank";

interface Props {
  user1?: Profile;
  user2?: Profile;
  theme?: Theme;
}

export const CompareRankBlock = ({ user1, user2, theme }: Props) => {
  const ITEMPERPAGE = 10;
  const { t } = useTranslation();

  const [ranksUser2, setRanksUser2] = useState<Array<Rank>>([]);
  const [isLoadingRankUser2, setIsLoadingRankUser2] = useState<boolean>(true);

  const [ranksUser1, setRanksUser1] = useState<Array<Rank>>([]);
  const [isLoadingRankUser1, setIsLoadingRankUser1] = useState<boolean>(true);

  const getAllRanks = async (
    id: string,
    idtheme: number,
    set: (value: Array<Rank>) => void,
    loading: (value: boolean) => void
  ) => {
    const { data } = await getRankByUser(id, idtheme);
    if (data) {
      set(data as Array<Rank>);
      loading(false);
    }
  };

  useEffect(() => {
    setIsLoadingRankUser1(true);
    if (user1 && theme) {
      getAllRanks(user1.id, theme.id, setRanksUser1, setIsLoadingRankUser1);
    }
  }, [user1, theme]);

  useEffect(() => {
    setIsLoadingRankUser2(true);
    if (user2 && theme) {
      getAllRanks(user2.id, theme.id, setRanksUser2, setIsLoadingRankUser2);
    }
  }, [user2, theme]);

  const values = uniqBy(
    [...ranksUser1, ...ranksUser2].map((el) => el.value),
    "id"
  );

  const ranksCompare: Array<RankCompare> = values
    .map((value) => {
      const rankUser1 = ranksUser1.find((el) => el.value.id === value.id);
      const rankUser2 = ranksUser2.find((el) => el.value.id === value.id);

      const diff =
        rankUser1 &&
        rankUser2 &&
        rankUser1.rank !== null &&
        rankUser2.rank !== null
          ? rankUser1.rank - rankUser2.rank
          : null;

      return { value, rankUser1, rankUser2, diff };
    })
    .sort(sortByDiff);

  return (
    <Grid container spacing={1}>
      {isLoadingRankUser1 || isLoadingRankUser2 ? (
        Array.from(new Array(ITEMPERPAGE)).map((_, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <CardSkeleton />
          </Grid>
        ))
      ) : ranksCompare.length > 0 ? (
        ranksCompare.map((rank) => (
          <Grid key={rank.value.id} item xs={12} sm={6} md={4}>
            {user1 && user2 && (
              <CardRankCompare rank={rank} user1={user1} user2={user2} />
            )}
          </Grid>
        ))
      ) : (
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Alert severity="warning">{t("commun.noresult")}</Alert>
        </Grid>
      )}
    </Grid>
  );
};
