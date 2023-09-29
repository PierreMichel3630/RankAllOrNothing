import { Alert, Grid } from "@mui/material";
import { uniqBy } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRanksByUserAndThemeAndType } from "src/api/supabase/rank";
import { Profile } from "src/models/Profile";
import { Rank, RankCompareExtern } from "src/models/Rank";
import { MediaType } from "src/models/tmdb/enum";
import { THEMETMDB } from "src/routes/movieRoutes";
import { sortByDiff } from "src/utils/sort";
import { FilterTmdb } from "../FilterTmdb";
import { CardSkeleton } from "../commun/skeleton/Skeleton";
import { CardRankTmdbCompare } from "./CardRankTmdbCompare";

interface Props {
  user1?: Profile;
  user2?: Profile;
}

export const CompareTMDBRankBlock = ({ user1, user2 }: Props) => {
  const ITEMPERPAGE = 10;
  const { t } = useTranslation();

  const [ranksUser2, setRanksUser2] = useState<Array<Rank>>([]);
  const [isLoadingRankUser2, setIsLoadingRankUser2] = useState<boolean>(true);

  const [ranksUser1, setRanksUser1] = useState<Array<Rank>>([]);
  const [isLoadingRankUser1, setIsLoadingRankUser1] = useState<boolean>(true);

  const [filter, setFilter] = useState<MediaType>(MediaType.movie);

  const getAllRanks = async (
    id: string,
    set: (value: Array<Rank>) => void,
    loading: (value: boolean) => void
  ) => {
    const { data } = await getRanksByUserAndThemeAndType(
      THEMETMDB,
      id,
      filter.toString()
    );
    if (data) {
      set(data as Array<Rank>);
      loading(false);
    }
  };

  useEffect(() => {
    setIsLoadingRankUser1(true);
    if (user1) {
      getAllRanks(user1.id, setRanksUser1, setIsLoadingRankUser1);
    }
  }, [user1, filter]);

  useEffect(() => {
    setIsLoadingRankUser2(true);
    if (user2) {
      getAllRanks(user2.id, setRanksUser2, setIsLoadingRankUser2);
    }
  }, [user2, filter]);

  const values = uniqBy([...ranksUser1, ...ranksUser2], "id_extern");

  const ranksCompare: Array<RankCompareExtern> = values
    .map((value) => {
      const rankUser1 = ranksUser1.find(
        (el) => el.id_extern === value.id_extern
      );
      const rankUser2 = ranksUser2.find(
        (el) => el.id_extern === value.id_extern
      );

      const diff =
        rankUser1 &&
        rankUser2 &&
        rankUser1.rank !== null &&
        rankUser2.rank !== null
          ? rankUser1.rank - rankUser2.rank
          : null;

      return {
        id: value.id_extern!,
        type: value.type !== null ? value.type : "",
        rankUser1,
        rankUser2,
        diff,
      };
    })
    .sort(sortByDiff);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FilterTmdb value={filter} select={(el) => setFilter(el)} />
      </Grid>
      {isLoadingRankUser1 || isLoadingRankUser2 ? (
        Array.from(new Array(ITEMPERPAGE)).map((_, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <CardSkeleton />
          </Grid>
        ))
      ) : ranksCompare.length > 0 ? (
        ranksCompare.map((rank) => (
          <Grid key={rank.id} item xs={12} sm={6} md={4}>
            {user1 && user2 && (
              <CardRankTmdbCompare rank={rank} user1={user1} user2={user2} />
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
