import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ThemeForm } from "../form/ThemeForm";

interface Props {
  open: boolean;
  close: () => void;
}

export const CreateThemeDialog = ({ open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">{t("commun.addtheme")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <ThemeForm />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
