import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { BUCKET_VALUE, getUrlPublic } from "src/api/supabase/storage";
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
  rank: Rank;
  validate: () => void;
}

export const RankDetailDialog = ({ open, validate, close, rank }: Props) => {
  const { language } = useContext(UserContext);

  const nameLocalLanguage = rank.value.name[language.iso];
  const nameEnglish = rank.value.name[DEFAULT_ISO_LANGUAGE];
  const name = nameLocalLanguage ? nameLocalLanguage : nameEnglish;

  const descriptionLocalLanguage = rank.value.description[language.iso];
  const descriptionEnglish = rank.value.description[DEFAULT_ISO_LANGUAGE];
  const description = descriptionLocalLanguage
    ? descriptionLocalLanguage
    : descriptionEnglish;

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={getUrlPublic(BUCKET_VALUE, rank.value.image)}
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
            <RankForm
              validate={validate}
              idValue={rank.value.id}
              rank={rank}
              idTheme={rank.value.theme}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
