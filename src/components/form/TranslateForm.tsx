import { useContext, useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { MessageSnackbar } from "../commun/Snackbar";
import { LanguageInput } from "../input/LanguageInput";
import { Language } from "src/models/Language";
import { TranslateValueInsert } from "src/models/Value";
import { insertTranslateValue } from "src/api/supabase/value";
import { UserContext } from "src/App";

interface Props {
  idValue: number;
  validate: () => void;
}

export const TranslateForm = ({ idValue, validate }: Props) => {
  const { t } = useTranslation();
  const { language } = useContext(UserContext);

  const [message, setMessage] = useState("");

  const initialValue: {
    name: string;
    language: null | Language;
    description: string;
  } = {
    name: "",
    language: language,
    description: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("form.createvalue.requiredname")),
    language: Yup.object().required(t("form.createvalue.requiredlanguage")),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.language !== null) {
          const translateValue: TranslateValueInsert = {
            name: values.name,
            description: values.description,
            language: values.language.id,
            value: idValue,
          };
          const { error } = await insertTranslateValue(translateValue);
          if (error) {
            setMessage(t("commun.error"));
          } else {
            validate();
          }
        } else {
          setMessage(t("commun.error"));
        }
      } catch (err) {
        setMessage(t("commun.error"));
      }
    },
  });

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
              {t("form.createvalue.name")}
            </InputLabel>
            <OutlinedInput
              id="name-input"
              type="text"
              value={formik.values.name}
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createvalue.name")}
              inputProps={{}}
            />
            {formik.touched.name && formik.errors.name && (
              <FormHelperText error id="error-name">
                {formik.errors.name}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(
              formik.touched.description && formik.errors.description
            )}
          >
            <InputLabel htmlFor="description-input">
              {t("form.createvalue.description")}
            </InputLabel>
            <OutlinedInput
              id="description-input"
              type="description"
              value={formik.values.description}
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.createvalue.description")}
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
