import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { BUCKET_VALUE, getUrlPublic } from "src/api/supabase/storage";
import { style } from "typestyle";
import { RankForm } from "../form/RankForm";
import { RankDetail } from "src/models/Rank";

const imageCss = style({
  maxWidth: percent(100),
  maxHeight: px(350),
});

interface Props {
  open: boolean;
  close: () => void;
  rank: RankDetail;
  validate: () => void;
}

export const RankDetailDialog = ({ open, validate, close, rank }: Props) => {
  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={getUrlPublic(BUCKET_VALUE, rank.image)}
              title={rank.name}
              className={imageCss}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">{rank.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{rank.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <RankForm validate={validate} idvalue={rank.idvalue} rank={rank} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
