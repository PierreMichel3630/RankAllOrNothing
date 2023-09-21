import {
  Alert,
  AlertColor,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseInput } from "src/components/commun/Input";
import { useAuth } from "src/context/AuthProviderSupabase";

import DoneIcon from "@mui/icons-material/Done";
import { updateProfil } from "src/api/supabase/profile";
import { MessageSnackbar } from "src/components/commun/Snackbar";
import { Profile } from "src/models/Profile";
import { updateUser } from "src/api/supabase/user";
import { AvatarSelector } from "src/components/avatar/AvatarSelector";

export const ParameterPage = () => {
  const { t } = useTranslation();
  const { user, profile, setProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
    }
  }, [profile]);

  const changeUsername = async () => {
    if (user) {
      const newProfil = { id: user.id, username };
      const { data, error } = await updateProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateusernamesuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email ?? "");
    }
  }, [user]);

  const changeEmail = async () => {
    if (user) {
      const newUser = { email };
      const { error } = await updateUser(newUser);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateemailsuccess"));
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  useEffect(() => {
    if (profile) {
      setAvatar(profile.avatar);
    }
  }, [profile]);

  const changeAvatar = async (value: string | null) => {
    if (user) {
      const newProfil = { id: user.id, avatar: value };
      const { data, error } = await updateProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateavatarsuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{t("commun.myparameters")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h4">{t("commun.username")}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <BaseInput
                value={username}
                clear={() => setUsername("")}
                onChange={(value) => setUsername(value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<DoneIcon />}
                fullWidth
                onClick={() => changeUsername()}
                color="secondary"
                size="small"
              >
                {t("commun.validate")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h4">{t("commun.avatar")}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <AvatarSelector selected={avatar} onSelect={changeAvatar} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h4">{t("commun.email")}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <BaseInput
                value={email}
                clear={() => setEmail("")}
                onChange={(value) => setEmail(value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<DoneIcon />}
                fullWidth
                onClick={() => changeEmail()}
                color="secondary"
                size="small"
              >
                {t("commun.validate")}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">{t("pages.parameters.infoemail")}</Alert>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <MessageSnackbar
        autoHideDuration={600000}
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
        severity={severity}
      />
    </Container>
  );
};
