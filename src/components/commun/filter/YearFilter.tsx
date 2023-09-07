import {
  Button,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { DateField } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "src/models/tmdb/commun/Filter";
import { ChipYearFilter } from "../Chip";

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}
export const YearFilter = ({ filter, onChange }: Props) => {
  const { t } = useTranslation();

  const defaultMoment = moment().subtract(1, "years");
  const [type, setType] = useState<"before" | "after" | "exact">("after");
  const [year, setYear] = useState<Moment | null>(defaultMoment);

  const changeType = (event: SelectChangeEvent) => {
    setType(event.target.value as "before" | "after" | "exact");
  };

  const deleteYear = (value: "before" | "after" | number) => {
    let newFilter = { ...filter };
    if (value === "before") {
      newFilter = {
        ...filter,
        year: {
          ...filter.year,
          before: undefined,
        },
      };
    } else if (value === "after") {
      newFilter = {
        ...filter,
        year: {
          ...filter.year,
          after: undefined,
        },
      };
    } else {
      newFilter = {
        ...filter,
        year: {
          ...filter.year,
          exact: [...filter.year.exact.filter((el) => el !== Number(value))],
        },
      };
    }
    onChange(newFilter);
  };

  const onValid = () => {
    let newFilter = { ...filter };
    if (year !== null) {
      const yearNumber = Number(year.format("YYYY"));
      if (type === "before") {
        newFilter = {
          ...filter,
          year: {
            ...filter.year,
            before: yearNumber,
          },
        };
      } else if (type === "after") {
        newFilter = {
          ...filter,
          year: {
            ...filter.year,
            after: yearNumber,
          },
        };
      } else if (type === "exact") {
        newFilter = {
          ...filter,
          year: {
            ...filter.year,
            exact: filter.year.exact.includes(yearNumber)
              ? [...filter.year.exact]
              : [...filter.year.exact, yearNumber].sort(),
          },
        };
      }
    }

    onChange(newFilter);
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={3}>
        <Typography variant="h2">{t("commun.year")}</Typography>
      </Grid>
      <Grid item xs={12} md={9}>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={4}>
            <Select
              id="select-year-type"
              value={type}
              onChange={changeType}
              size="small"
              fullWidth
            >
              <MenuItem value="before">{t("commun.before")}</MenuItem>
              <MenuItem value="after">{t("commun.after")}</MenuItem>
              <MenuItem value="exact">{t("commun.exact")}</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6} sm={4}>
            <DateField
              value={year}
              onChange={(newValue) => setYear(newValue)}
              format="YYYY"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={onValid}
            >
              {t("commun.add")}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {(filter.year.after || filter.year.before || filter.year.exact) && (
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {filter.year.after && (
              <Grid item>
                <ChipYearFilter
                  year={filter.year.after}
                  type="after"
                  onDelete={() => deleteYear("after")}
                />
              </Grid>
            )}
            {filter.year.before && (
              <Grid item>
                <ChipYearFilter
                  year={filter.year.before}
                  type="before"
                  onDelete={() => deleteYear("before")}
                />
              </Grid>
            )}
            {filter.year.exact.length > 0 &&
              filter.year.exact.map((el) => (
                <Grid item key={el}>
                  <ChipYearFilter
                    year={el}
                    type="exact"
                    onDelete={() => deleteYear(el)}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
