import {
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { viewHeight } from "csx";
import { useTranslation } from "react-i18next";
import { style } from "typestyle";

import { LoginForm } from "src/components/form/authentification/LoginForm";

import logo from "../assets/ranking.png";
import { Link } from "react-router-dom";
import { GoogleButton } from "src/components/button/GoogleButton";
import { signUpWithGoogle } from "src/api/supabase";

const cardCss = style({
  padding: 16,
});
export const LoginPage = () => {
  const { t } = useTranslation();

  const connectGoogle = async () => {
    await signUpWithGoogle();
  };

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
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Typography variant="h2">{t("form.login.connect")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <GoogleButton
              label={t("form.login.connectgoogle")}
              onClick={connectGoogle}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
            <Divider>
              <Chip label={t("commun.or")} />
            </Divider>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">{t("form.login.connectmail")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <LoginForm />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", gap: 1, justifyContent: "center" }}
          >
            <Typography variant="body1">
              {t("form.login.haveaccount")}
            </Typography>
            <Link to="/register">
              <Typography variant="body1" sx={{ textDecoration: "underline" }}>
                {t("form.login.createaccount")}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};
