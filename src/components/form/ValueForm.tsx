import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "src/App";
import { BUCKET_VALUE, storeFile } from "src/api/supabase/storage";
import { insertValue, nextIdValue } from "src/api/supabase/value";
import { Language } from "src/models/Language";
import { ValueInsert } from "src/models/Value";
import * as Yup from "yup";
import { MessageSnackbar } from "../commun/Snackbar";
import { FileUploadInput } from "../input/FileUploadInput";
import { LanguageInput } from "../input/LanguageInput";

interface Props {
  idTheme: number;
  validate: () => void;
}

export const ValueForm = ({ idTheme, validate }: Props) => {
  const { t } = useTranslation();
  const { language } = useContext(UserContext);

  const [message, setMessage] = useState("");

  const initialValue: {
    name: string;
    language: null | Language;
    description: string;
    image: null | File;
  } = {
    name: "",
    language: language,
    description: "",
    image: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("form.createvalue.requiredname")),
    language: Yup.object().required(t("form.createvalue.requiredlanguage")),
    image: Yup.mixed().required(t("form.createvalue.requiredimage")),
    description: Yup.string(),
  });

  const getNextId = async () => {
    const { data } = await nextIdValue();
    return data !== null ? data.id + 1 : undefined;
  };

  const storeImage = async (name: string, image: File) => {
    const { data } = await storeFile(BUCKET_VALUE, name, image);
    return data;
  };

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const nextId = await getNextId();
        if (nextId) {
          if (values.language !== null) {
            const name = `theme-${idTheme}-value-${nextId}`;
            const image = await storeImage(
              name,
              values.image as unknown as File
            );
            if (image !== null) {
              const value: ValueInsert = {
                image: image.path,
                theme: idTheme,
                description: {
                  [values.language.iso]: values.description,
                },
                name: {
                  [values.language.iso]: values.name,
                },
              };
              const { error } = await insertValue(value);
              if (error) {
                setMessage(t("commun.error"));
              } else {
                validate();
              }
            } else {
              setMessage(t("commun.error"));
            }
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
