import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Rank, RankDetail, RankInsert, RankUpdate } from "src/models/Rank";
import * as Yup from "yup";
import { MessageSnackbar } from "../commun/Snackbar";
import {
  calculationRank,
  countRanksByTheme,
  insertRank,
  updateRank,
} from "src/api/supabase/rank";

interface Props {
  idValue: number;
  validate: () => void;
  rank?: Rank | RankDetail;
  idTheme: number;
}

export const RankForm = ({ idTheme, idValue, validate, rank }: Props) => {
  const MAX_NOTATION = 10;
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [max, setMax] = useState(100);
  const min = 1;

  const initialValue: {
    notation: number;
    opinion: string;
    rank: number;
  } = {
    notation: rank && rank.notation !== null ? rank.notation : 5,
    opinion: rank && rank.opinion !== null ? rank.opinion : "",
    rank: rank && rank.rank !== null ? rank.rank : 1,
  };

  const validationSchema = Yup.object().shape({
    notation: Yup.number().required(t("form.rate.requiredrate")),
    rank: Yup.number()
      .required(t("form.rate.requiredrank"))
      .test({
        name: "isBetweenMinMax",
        exclusive: false,
        params: {},
        message: t("form.rate.minmaxrank", { min: min, max: max }),
        test: (value) => {
          return value <= max && value >= min;
        },
      }),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (rank) {
          const rankUpdate: RankUpdate = {
            id: rank.id,
            notation: values.notation,
            rank: values.rank,
            value: idValue,
            opinion: values.opinion,
            theme: idTheme,
          };
          const { error } = await updateRank(rankUpdate);
          if (error) {
            setMessage(t("commun.error"));
          } else {
            validate();
          }
        } else {
          const rankInsert: RankInsert = {
            notation: values.notation,
            rank: values.rank,
            value: idValue,
            opinion: values.opinion,
            theme: idTheme,
          };
          const { error } = await insertRank(rankInsert);
          if (error) {
            setMessage(t("commun.error"));
          } else {
            validate();
          }
        }
      } catch (e) {
        setMessage(t("commun.error"));
      }
    },
  });

  const getCalculationRank = async () => {
    const res = await calculationRank(idTheme, formik.values.notation);
    const newRank = res.count !== null ? res.count + 1 : 1;
    formik.setFieldValue("rank", newRank);
  };

  useEffect(() => {
    getCalculationRank();
  }, [formik.values.notation]);

  const getMax = async () => {
    const res = await countRanksByTheme(
      Number(idTheme),
      rank ? rank.type : null
    );
    const newMax =
      res.count !== null ? (rank ? res.count : res.count + 1) : 100;
    setMax(newMax);
  };

  useEffect(() => {
    getMax();
  }, [idValue, idTheme, rank]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Rating
            name="notation"
            value={formik.values.notation}
            size="large"
            max={MAX_NOTATION}
            onChange={(_, newValue) => {
              formik.setFieldValue(
                "notation",
                newValue === null ? 0 : newValue
              );
            }}
            precision={0.5}
          />
        </Grid>
        <Grid item xs={12}>
          {formik.touched.notation && formik.errors.notation && (
            <FormHelperText error id="error-notation">
              {formik.errors.notation}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h1">{`${formik.values.notation} / ${MAX_NOTATION}`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.rank && formik.errors.rank)}
          >
            <TextField
              variant="outlined"
              id="rank-input"
              type="number"
              value={formik.values.rank}
              name="rank"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.rate.rank")}
              InputLabelProps={{ shrink: true }}
              inputProps={{}}
              error={Boolean(formik.touched.rank && formik.errors.rank)}
            />
            {formik.touched.rank && formik.errors.rank && (
              <FormHelperText error id="rank-error">
                {formik.errors.rank}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            error={Boolean(formik.touched.opinion && formik.errors.opinion)}
          >
            <InputLabel htmlFor="opinion-input">
              {t("form.rate.opinion")}
            </InputLabel>
            <OutlinedInput
              id="opinion-input"
              type="text"
              value={formik.values.opinion}
              name="opinion"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              label={t("form.rate.opinion")}
              inputProps={{}}
              multiline
              minRows={2}
              maxRows={4}
            />
            {formik.touched.opinion && formik.errors.opinion && (
              <FormHelperText error id="opinion-error">
                {formik.errors.opinion}
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
            {t("commun.validate")}
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
