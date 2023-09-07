import { Card, Container, Grid, Typography } from "@mui/material";
import { viewHeight } from "csx";
import { useTranslation } from "react-i18next";
import { style } from "typestyle";

import logo from "../assets/ranking.png";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "src/components/form/authentification/ForgotPasswordForm";

const cardCss = style({
  padding: 16,
});
export const ForgotPasswordPage = () => {
  const { t } = useTranslation();

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: viewHeight(100), display: "flex", alignItems: "center" }}
    >
      <Card variant="outlined" className={cardCss}>
        <Grid container spacing={1} sx={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <Link to="/">
              <img src={logo} width={50} />
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2">
              {t("form.forgotpassword.forgotpassword")}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Typography variant="body1">
              {t("form.forgotpassword.modality")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ForgotPasswordForm />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", gap: 1, justifyContent: "center" }}
          >
            <Typography variant="body1">
              {t("form.forgotpassword.notforget")}
            </Typography>
            <Link to="/login">
              <Typography variant="body1" sx={{ textDecoration: "underline" }}>
                {t("form.forgotpassword.connection")}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};
