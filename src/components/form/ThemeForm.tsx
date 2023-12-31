import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserContext } from "src/App";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { BUCKET_THEME, storeFile } from "src/api/supabase/storage";
import { getThemes, insertTheme } from "src/api/supabase/theme";
import { Language } from "src/models/Language";
import { Theme } from "src/models/Theme";
import * as Yup from "yup";
import { MessageSnackbar } from "../commun/Snackbar";
import { FileUploadInput } from "../input/FileUploadInput";
import { LanguageInput } from "../input/LanguageInput";

export const ThemeForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [englishThemes, setEnglishThemes] = useState<Array<Theme>>([]);

  const initialValue: {
    name: string;
    englishname: string;
    language: null | Language;
    description: string;
    image: null | File;
  } = {
    name: "",
    englishname: "",
    language: language,
    description: "",
    image: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("form.createtheme.requiredname")),
    englishname: Yup.string().test({
      name: "isNotEnglish",
      exclusive: false,
      params: {},
      message: t("form.createtheme.requiredenglishname"),
      test: (value, context) => {
        if (
          context.parent.language !== null &&
          context.parent.language.abbreviation !== "en"
        ) {
          return value && value !== "" ? true : false;
        }
        return true;
      },
    }),
    language: Yup.object().required(t("form.createtheme.requiredlanguage")),
    image: Yup.mixed().required(t("form.createtheme.requiredimage")),
    description: Yup.string(),
  });

  const uploadFile = async (bucket: string, name: string, file: File) => {
    const { data } = await storeFile(bucket, name, file);
    return data;
  };

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.language !== null) {
          const name =
            values.language.abbreviation !== "en"
              ? values.englishname
              : values.name; // ENGLISH NAME
          const file = await uploadFile(
            BUCKET_THEME,
            name,
            values.image as unknown as File
          );
          if (file !== null) {
            const { data, error } = await insertTheme({
              image: file.path,
              description: {
                [values.language.iso]: values.description,
              },
              name: {
                [values.language.iso]: values.name,
                DEFAULT_ISO_LANGUAGE: values.englishname,
              },
            });
            if (error) {
              setMessage(t("commun.error"));
            } else {
              navigate("/theme/" + data.id);
            }
          } else {
            setMessage(t("commun.error"));
          }
        }
      } catch (err) {
        setMessage(t("commun.error"));
      }
    },
  });

  const searchTheme = async (search: string) => {
    const { data } = await getThemes(search, DEFAULT_ISO_LANGUAGE, []);
    setEnglishThemes(data as Array<Theme>);
  };

  useEffect(() => {
    if (formik.values.englishname !== "") {
      const timeout = setTimeout(() => {
        searchTheme(formik.values.englishname);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [formik.values.englishname]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <LanguageInput formik={formik} />
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.name && formik.errors.name)}
          >
            <InputLabel htmlFor="name-input">
              {t("form.createtheme.name")}
            </InputLabel>
            <OutlinedInput
              id="name-input"
              type="text"
              value={formik.values.name}
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createtheme.name")}
              inputProps={{}}
            />
            {formik.touched.name && formik.errors.name && (
              <FormHelperText error id="error-name">
                {formik.errors.name}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        {formik.values.language !== null &&
          formik.values.language.abbreviation !== "en" && (
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={Boolean(
                  formik.touched.englishname && formik.errors.englishname
                )}
              >
                <InputLabel htmlFor="englishname-input">
                  {t("form.createtheme.englishname")}
                </InputLabel>
                <OutlinedInput
                  id="englishname-input"
                  type="text"
                  value={formik.values.englishname}
                  name="englishname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  label={t("form.createtheme.englishname")}
                  inputProps={{}}
                />
                {formik.touched.englishname && formik.errors.englishname && (
                  <FormHelperText error id="error-englishname">
                    {formik.errors.englishname}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}
        {englishThemes.length > 0 && (
          <Grid item xs={12}>
            <Alert severity="info">{t("form.createtheme.existtheme")}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.description && formik.errors.description
            )}
          >
            <InputLabel htmlFor="description-input">
              {t("form.createtheme.description")}
            </InputLabel>
            <OutlinedInput
              id="description-input"
              type="description"
              value={formik.values.description}
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createtheme.description")}
              inputProps={{}}
              multiline
              maxRows={5}
            />
            {formik.touched.description && formik.errors.description && (
              <FormHelperText error id="error-description">
                {formik.errors.description}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FileUploadInput formik={formik} />
        </Grid>
        <Grid item xs={12}>
          <Button
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
          >
            {t("commun.add")}
          </Button>
        </Grid>
      </Grid>
      <MessageSnackbar
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
      />
    </form>
  );
};
