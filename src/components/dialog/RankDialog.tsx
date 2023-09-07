import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { BUCKET_VALUE, getUrlPublic } from "src/api/supabase/storage";
import { ValueView } from "src/models/Value";
import { style } from "typestyle";
import { RankForm } from "../form/RankForm";
import { Rank } from "src/models/Rank";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { UserContext } from "src/App";
import { useContext } from "react";

const imageCss = style({
  maxWidth: percent(100),
  maxHeight: px(350),
});

interface Props {
  open: boolean;
  close: () => void;
  value: ValueView;
  ranks: Array<Rank>;
  validate: () => void;
}

export const RankDialog = ({ open, validate, close, value, ranks }: Props) => {
  const { language } = useContext(UserContext);

  const tradLocalLanguage = value.trads.find((el) => el.iso === language.iso);
  const tradEnglish = value.trads.find((el) => el.iso === DEFAULT_ISO_LANGUAGE);

  const trad = tradLocalLanguage ? tradLocalLanguage : tradEnglish;
  const name = trad ? trad.name : "---";
  const description = trad ? trad.description : "---";
  const rank = ranks.find((el) => value.id === el.value.id);
  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={getUrlPublic(BUCKET_VALUE, value.image)}
              title={name}
              className={imageCss}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">{name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <RankForm validate={validate} idvalue={value.id} rank={rank} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
