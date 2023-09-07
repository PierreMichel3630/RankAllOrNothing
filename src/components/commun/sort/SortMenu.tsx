import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";

import SortIcon from "@mui/icons-material/Sort";
import { useState } from "react";
import { SortImdb } from "src/models/tmdb/enum";
import { useTranslation } from "react-i18next";
import { Filter } from "src/models/tmdb/commun/Filter";

interface Sort {
  name: string;
  value: SortImdb;
}

interface Props {
  onSubmit: (filter: Filter) => void;
  filter: Filter;
}

export const SortMenu = ({ filter, onSubmit }: Props) => {
  const { t } = useTranslation();

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const SORTS = [
    { name: t("sort.popularityDesc"), value: SortImdb.popularityDesc },
    { name: t("sort.popularityAsc"), value: SortImdb.popularityAsc },
    {
      name: t("sort.primaryreleasedateDesc"),
      value: SortImdb.primaryreleasedateDesc,
    },
    {
      name: t("sort.primaryreleasedateAsc"),
      value: SortImdb.primaryreleasedateAsc,
    },
    { name: t("sort.voteaverageDesc"), value: SortImdb.voteaverageDesc },
    { name: t("sort.voteaverageAsc"), value: SortImdb.voteaverageAsc },
    { name: t("sort.titleAsc"), value: SortImdb.titleAsc },
    { name: t("sort.titleDesc"), value: SortImdb.titleDesc },
  ];

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const selectSort = (sort: Sort) => {
    const newFilter: Filter = {
      ...filter,
      sort: sort.value,
    };
    onSubmit(newFilter);
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  return (
    <Box>
      <Tooltip title={t("commun.sort")}>
        <IconButton aria-label="sort" color="inherit" onClick={handleOpenMenu}>
          <SortIcon />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchor}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchor)}
        onClose={handleCloseMenu}
      >
        {SORTS.map((sort) => (
          <MenuItem key={sort.value} onClick={() => selectSort(sort)}>
            <Typography variant="body1">{sort.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
