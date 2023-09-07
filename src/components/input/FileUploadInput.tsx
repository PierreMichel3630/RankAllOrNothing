import { FormControl, FormHelperText } from "@mui/material";
import { DropDragFile } from "./DropDragFile";

interface Props {
  formik: any;
}

export const FileUploadInput = ({ formik }: Props) => (
  <FormControl
    fullWidth
    error={Boolean(formik.touched.image && formik.errors.image)}
  >
    <DropDragFile
      file={formik.values.image}
      onDrop={(file) => formik.setFieldValue("image", file)}
    />
    <FormHelperText error id="error-image">
      {formik.errors.image}
    </FormHelperText>
  </FormControl>
);
