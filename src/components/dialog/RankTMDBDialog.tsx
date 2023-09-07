import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { style } from "typestyle";
import { ItemToRank } from "src/pages/tmdb/HomeMoviesPage";
import { RankTMDBForm } from "../form/RankTMDBForm";
import { getRanksByIdExtern } from "src/api/supabase/rank";
import { useEffect, useState } from "react";
import { Rank } from "src/models/Rank";
import { THEMETMDB } from "src/routes/movieRoutes";

const imageCss = style({
  maxWidth: percent(100),
  maxHeight: px(350),
});

interface Props {
  open: boolean;
  close: () => void;
  value: ItemToRank;
  validate: (id: number) => void;
}

export const RankTMDBDialog = ({ open, close, value, validate }: Props) => {
  const [rank, setRank] = useState<undefined | Rank>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const getRank = async () => {
    const { data } = await getRanksByIdExtern(value.id, THEMETMDB, value.type);
    setRank(data as Rank);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getRank();
  }, [value]);

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <img src={value.image} title={value.name} className={imageCss} />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h4">{value.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{value.description}</Typography>
          </Grid>
          {!isLoading && (
            <Grid item xs={12}>
              <RankTMDBForm
                id_extern={value.id.toString()}
                type={value.type.toString()}
                id_theme={THEMETMDB}
                validate={() => validate(value.id)}
                rank={rank}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
