import { Card, Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { style } from "typestyle";
import { viewHeight } from "csx";

import { ResetPasswordForm } from "src/components/form/authentification/ResetPasswordForm";

import logo from "../assets/ranking.png";
import { Helmet } from "react-helmet-async";

const cardCss = style({
  padding: 16,
});
export const ResetPasswordPage = () => {
  const { t } = useTranslation();

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: viewHeight(100), display: "flex", alignItems: "center" }}
    >
      <Helmet>
        <title>{`${t("pages.resetpassword.title")} - RankAllAndNothing`}</title>
      </Helmet>
      <Card variant="outlined" className={cardCss}>
        <Grid container spacing={1} sx={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <Link to="/">
              <img src={logo} width={50} />
            </Link>
          </Grid>
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Typography variant="h2">
              {t("form.resetpassword.resetpassword")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ResetPasswordForm />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", gap: 1, justifyContent: "center" }}
          >
            <Typography variant="body1">
              {t("form.register.alreadyaccount")}
            </Typography>
            <Link to="/login">
              <Typography variant="body1" sx={{ textDecoration: "underline" }}>
                {t("form.register.connect")}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};
