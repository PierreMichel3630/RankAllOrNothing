import {
  Avatar,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { PersonSearchElement } from "src/models/tmdb/person/PersonSearchElement";
import { Colors } from "src/style/Colors";
import { useContext } from "react";
import { UserContext } from "src/App";

interface PropsBaseInput {
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
}

export const BaseInput = ({ value, clear, onChange }: PropsBaseInput) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: percent(100),
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value !== "" && (
        <IconButton
          type="button"
          size="small"
          aria-label="clear"
          onClick={() => clear()}
        >
          <ClearIcon sx={{ width: 15, height: 15 }} />
        </IconButton>
      )}
    </Paper>
  );
};

interface PropsSearchInput {
  value: string;
  onChange: (value: string) => void;
  submit: () => void;
  clear: () => void;
}

export const SearchInput = ({
  value,
  clear,
  onChange,
  submit,
}: PropsSearchInput) => {
  const { t } = useTranslation();

  return (
    <Paper
      component="form"
      variant="outlined"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: percent(100),
      }}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={t("header.search.input")}
        inputProps={{ "aria-label": t("header.search.input") }}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value !== "" && (
        <IconButton
          type="button"
          size="small"
          aria-label="clear"
          onClick={() => clear()}
        >
          <ClearIcon sx={{ width: 15, height: 15 }} />
        </IconButton>
      )}
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={() => submit()}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

interface PropsBasicSearchInput {
  label: string;
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
}

export const BasicSearchInput = ({
  label,
  value,
  clear,
  onChange,
}: PropsBasicSearchInput) => (
  <Paper
    variant="outlined"
    sx={{
      p: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: percent(100),
    }}
  >
    <InputBase
      sx={{ ml: 1, flex: 1 }}
      placeholder={label}
      inputProps={{ "aria-label": label }}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    {value !== "" && (
      <IconButton
        type="button"
        size="small"
        aria-label="clear"
        onClick={() => clear()}
      >
        <ClearIcon sx={{ width: 15, height: 15 }} />
      </IconButton>
    )}
  </Paper>
);

interface PropsAutocompleteInput {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
  onSelect: (value: PersonSearchElement) => void;
  results: Array<PersonSearchElement>;
}

export const AutocompleteInputPerson = ({
  placeholder,
  value,
  clear,
  onChange,
  onSelect,
  results,
}: PropsAutocompleteInput) => {
  const { mode } = useContext(UserContext);
  return (
    <div style={{ position: "relative" }}>
      <Paper
        variant="outlined"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: percent(100),
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          inputProps={{ "aria-label": placeholder }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value !== "" && (
          <IconButton
            type="button"
            size="small"
            aria-label="clear"
            onClick={() => clear()}
          >
            <ClearIcon sx={{ width: 15, height: 15 }} />
          </IconButton>
        )}
      </Paper>
      {results.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            width: percent(100),
            zIndex: 2,
            flexDirection: "column",
            position: "absolute",
          }}
        >
          {results.slice(0, 5).map((el) => (
            <Grid
              container
              sx={{
                cursor: "pointer",
                p: 1,
                "&:hover": {
                  color:
                    mode === "dark" ? Colors.lightgrey : Colors.greyDarkMode,
                  backgroundColor:
                    mode === "dark" ? Colors.greyDarkMode : Colors.lightgrey,
                },
              }}
              alignItems="center"
              onClick={() => onSelect(el)}
              key={el.id}
            >
              <Grid item xs={3}>
                {el.profile_path && el.profile_path !== "" ? (
                  <Avatar
                    alt={el.name}
                    src={`https://image.tmdb.org/t/p/w45${el.profile_path}`}
                  />
                ) : (
                  <Avatar alt={el.name}>{el.name.charAt(0)}</Avatar>
                )}
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body1">{el.name}</Typography>
              </Grid>
            </Grid>
          ))}
        </Paper>
      )}
    </div>
  );
};
