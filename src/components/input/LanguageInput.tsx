import { Autocomplete, Box, TextField } from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { UserContext } from "src/App";

interface Props {
  formik: any;
}

export const LanguageInput = ({ formik }: Props) => {
  const { t } = useTranslation();
  const { languages } = useContext(UserContext);

  return (
    <Autocomplete
      id="language-input"
      options={languages}
      onChange={(e, value) => formik.setFieldValue("language", value)}
      autoHighlight
      getOptionLabel={(option) => option.name}
      value={formik.values.language}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={option.image}
            srcSet={option.image}
            alt=""
          />
          {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          error={Boolean(formik.touched.language && formik.errors.language)}
          helperText={formik.touched.language && formik.errors.language}
          onBlur={formik.handleBlur}
          label={t("form.createtheme.language")}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
        />
      )}
    />
  );
};
