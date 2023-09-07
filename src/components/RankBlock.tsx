import { Alert, Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "src/App";
import { deleteRank, getRankByUser, updateRank } from "src/api/supabase/rank";
import { CardRank } from "src/components/commun/Card";
import { MessageSnackbar } from "src/components/commun/Snackbar";
import { CardSkeleton } from "src/components/commun/skeleton/Skeleton";
import { RankDetailDialog } from "src/components/dialog/RankDetailDialog";
import { useAuth } from "src/context/AuthProviderSupabase";
import { RankDetail } from "src/models/Rank";
import { ThemeView } from "src/models/Theme";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Navigate } from "react-router-dom";

interface Props {
  theme: ThemeView;
}
export const RankBlock = ({ theme }: Props) => {
  const ITEMPERPAGE = 20;

  const { t } = useTranslation();
  const { language } = useContext(UserContext);
  const { user } = useAuth();

  const [rank, setRank] = useState<RankDetail | undefined>(undefined);
  const [ranks, setRanks] = useState<Array<RankDetail>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState("");
  const [openModalRate, setOpenModalRate] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getAllRanks = async () => {
    if (user && theme && language) {
      const { data } = await getRankByUser(user.id, theme.id, language.id);
      if (data) {
        setRanks(data as Array<RankDetail>);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getAllRanks();
  }, [user, theme, language]);

  const removeRank = async (rank: RankDetail) => {
    const { error } = await deleteRank(rank.id);
    if (error) {
      setMessage(t("commun.error"));
    } else {
      getAllRanks();
      setMessage("");
    }
  };

  const rateRank = async (rank: RankDetail) => {
    setRank(rank);
    setOpenModalRate(true);
  };

  const closeModalRank = () => {
    setOpenModalRate(false);
    setRank(undefined);
  };

  const refreshRank = () => {
    setOpenModalRate(false);
    getAllRanks();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.data.current && over && over.data.current) {
      const id = Number(active.id);
      const oldIndex = ranks.findIndex((el) => el.id === active.id);
      const newIndex = ranks.findIndex((el) => el.id === over.id);
      const newArray = arrayMove(ranks, oldIndex, newIndex);
      setRanks(newArray);
      const { error } = await updateRank({ id: id, rank: newIndex + 1 });
      if (error) {
        setMessage(t("commun.error"));
        getAllRanks();
      }
    }
  };

  return user !== null ? (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ranks} strategy={rectSortingStrategy}>
        <Grid container spacing={1}>
          {isLoading ? (
            Array.from(new Array(ITEMPERPAGE)).map((_, index) => (
              <Grid key={index} item xs={6} sm={6} md={4} lg={3} xl={3}>
                <CardSkeleton />
              </Grid>
            ))
          ) : ranks.length > 0 ? (
            ranks.map((rank, index) => (
              <Grid key={rank.id} item xs={6} sm={6} md={4} lg={3} xl={3}>
                <CardRank
                  index={index}
                  rank={rank}
                  rate={() => rateRank(rank)}
                  remove={() => removeRank(rank)}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <Alert severity="warning">{t("commun.noresult")}</Alert>
            </Grid>
          )}
          <MessageSnackbar
            open={message !== ""}
            handleClose={() => setMessage("")}
            message={message}
          />
          {rank && (
            <RankDetailDialog
              open={openModalRate}
              close={closeModalRank}
              rank={rank}
              validate={refreshRank}
            />
          )}
        </Grid>
      </SortableContext>
    </DndContext>
  ) : (
    <Navigate replace to="/login" />
  );
};
