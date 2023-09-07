import { Button, Dialog, Divider, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { Filter } from "src/models/tmdb/commun/Filter";
import { RuntimeFilter } from "../filter/RuntimeFilter";
import { GenreFilter } from "../filter/GenreFilter";
import { YearFilter } from "../filter/YearFilter";
import { OriginCountryFilter } from "../filter/OriginCountryFilter";
import { ActorsFilter } from "../filter/ActorsFilter";
import { VoteFilter } from "../filter/VoteFilter";
import { MediaTypeFilter } from "../filter/MediaTypeFilter";
import { MediaType } from "src/models/tmdb/enum";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (filter: Filter) => void;
  filter: Filter;
}

export const FilterDialog = ({ filter, open, onClose, onSubmit }: Props) => {
  const { t } = useTranslation();

  const [newFilter, setNewFilter] = useState<Filter>(filter);

  useEffect(() => {
    setNewFilter(filter);
  }, [open]);

  const onChange = (filter: Filter) => {
    setNewFilter(filter);
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="lg">
      <Grid container spacing={1} alignItems="center" sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <MediaTypeFilter onChange={onChange} filter={newFilter} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <GenreFilter onChange={onChange} filter={newFilter} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <GenreFilter onChange={onChange} filter={newFilter} without />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <RuntimeFilter onChange={onChange} filter={newFilter} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <YearFilter onChange={onChange} filter={newFilter} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {newFilter.type === MediaType.movie && (
          <>
            <Grid item xs={12}>
              <ActorsFilter onChange={onChange} filter={newFilter} />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <OriginCountryFilter onChange={onChange} filter={newFilter} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <VoteFilter onChange={onChange} filter={newFilter} />
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            startIcon={<CloseIcon />}
            fullWidth
            onClick={() => onClose()}
            color="error"
          >
            {t("commun.cancel")}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            startIcon={<FilterAltIcon />}
            fullWidth
            onClick={() => onSubmit(newFilter)}
            color="secondary"
          >
            {t("commun.filter")}
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};
