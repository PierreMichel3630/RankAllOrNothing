import { Grid, IconButton, InputBase, Paper, Typography } from "@mui/material";
import { percent } from "csx";
import moment from "moment";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "src/App";
import { Profile } from "src/models/Profile";
import { AvatarAccount } from "../avatar/AvatarAccount";

import ClearIcon from "@mui/icons-material/Clear";
import { Colors } from "src/style/Colors";
import { normalizeString } from "src/utils/string";
import { ItemAccountSkeleton } from "../commun/skeleton/Skeleton";

interface PropsAutocompleteInput {
  isLoading: boolean;
  profile?: Profile;
  placeholder: string;
  onSelect: (value: Profile | undefined) => void;
  results: Array<Profile>;
}

export const ProfileAutocomplete = ({
  isLoading,
  profile,
  placeholder,
  onSelect,
  results,
}: PropsAutocompleteInput) => {
  const { mode } = useContext(UserContext);
  const { t } = useTranslation();

  const [value, setValue] = useState("");

  const resultsFilter = results.filter((el) =>
    normalizeString(el.username).includes(normalizeString(value))
  );

  return isLoading ? (
    <ItemAccountSkeleton />
  ) : (
    <>
      {profile ? (
        <Grid
          container
          sx={{ cursor: "pointer" }}
          onClick={() => onSelect(undefined)}
        >
          <Grid item xs={3}>
            <AvatarAccount avatar={profile.avatar} size={50} />
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h2">{profile.username}</Typography>
            <Typography variant="caption">
              {t("commun.createdthe", {
                value: moment(profile.created_at).format("DD MMMM YYYY"),
              })}
            </Typography>
          </Grid>
        </Grid>
      ) : (
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
              onChange={(event) => setValue(event.target.value)}
            />
            {value !== "" && (
              <IconButton
                type="button"
                size="small"
                aria-label="clear"
                onClick={() => setValue("")}
              >
                <ClearIcon sx={{ width: 15, height: 15 }} />
              </IconButton>
            )}
          </Paper>
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
            {resultsFilter.map((el) => (
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
                onClick={(event) => {
                  event.preventDefault();
                  setValue("");
                  onSelect(el);
                }}
                key={el.id}
              >
                <Grid item xs={3}>
                  <AvatarAccount avatar={el.avatar} size={50} />
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="h2">{el.username}</Typography>
                  <Typography variant="caption">
                    {t("commun.createdthe", {
                      value: moment(el.created_at).format("DD MMMM YYYY"),
                    })}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Paper>
        </div>
      )}
    </>
  );
};
