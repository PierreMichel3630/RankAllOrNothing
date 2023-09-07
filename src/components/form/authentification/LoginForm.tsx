import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "src/context/AuthProviderSupabase";
import { MessageSnackbar } from "../../commun/Snackbar";

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [errorLogin, setErrorLogin] = useState("");

  const initialValue = {
    email: "",
    password: "",
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("form.login.formatmail"))
      .max(255)
      .required(t("form.login.requiredmail")),
    password: Yup.string().max(255).required(t("form.login.requiredpassword")),
  });

  const [checked, setChecked] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const {
          data: { user, session },
          error,
        } = await login(values.email, values.password);
        if (error) {
          if (error.message === "Invalid login credentials") {
            setErrorLogin(t("form.login.errorconnect"));
          } else {
            setErrorLogin(t("commun.error"));
          }
        }
        if (user && session) navigate("/");
      } catch (err) {
        setErrorLogin(t("commun.error"));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.email && formik.errors.email)}
          >
            <InputLabel htmlFor="login-email-input">
              {t("form.login.email")}
            </InputLabel>
            <OutlinedInput
              id="login-email-input"
              type="email"
              value={formik.values.email}
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.login.email")}
              inputProps={{}}
            />
            {formik.touched.email && formik.errors.email && (
              <FormHelperText error id="login-error-email">
                {formik.errors.email}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.password && formik.errors.password)}
          >
            <InputLabel htmlFor="login-password-input">
              {t("form.login.password")}
            </InputLabel>
            <OutlinedInput
              id="login-password-input"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label={t("form.login.password")}
              inputProps={{}}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText error id="login-error-password">
                {formik.errors.password}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "left" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
                name="checked"
                color="secondary"
              />
            }
            label={t("form.login.rememberme")}
          />
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Link to="/forgotpassword">
            <Typography variant="body1" sx={{ textDecoration: "underline" }}>
              {t("form.login.forgotpassword")}
            </Typography>
          </Link>
        </Grid>
        {formik.errors.submit && (
          <Grid item xs={12}>
            <FormHelperText error>{formik.errors.submit}</FormHelperText>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
          >
            {t("form.login.connect")}
          </Button>
        </Grid>
      </Grid>
      <MessageSnackbar
        open={errorLogin !== ""}
        handleClose={() => setErrorLogin("")}
        message={errorLogin}
      />
    </form>
  );
};
