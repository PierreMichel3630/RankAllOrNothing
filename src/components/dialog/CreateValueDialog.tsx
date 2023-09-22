import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ValueForm } from "../form/ValueForm";
import { Theme } from "src/models/Theme";

interface Props {
  open: boolean;
  close: () => void;
  theme: Theme;
  validate: () => void;
}

export const CreateValueDialog = ({ open, close, theme, validate }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">{t("commun.addvalue")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <ValueForm idTheme={theme.id} validate={validate} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
