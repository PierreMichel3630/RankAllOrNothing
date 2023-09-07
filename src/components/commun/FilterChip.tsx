import { Grid } from "@mui/material";
import { useContext } from "react";
import { LANGUAGESORIGIN, LanguageOrigin } from "src/models/LanguageOrigin";
import { Filter } from "src/models/tmdb/commun/Filter";
import { Genre } from "src/models/tmdb/commun/Genre";
import { MediaType } from "src/models/tmdb/enum";
import { SearchContext } from "src/pages/tmdb/HomeMoviesPage";
import {
  ChipActorFilter,
  ChipGenreFilter,
  ChipLanguageOriginFilter,
  ChipMediaType,
  ChipRuntimeFilter,
  ChipVoteFilter,
  ChipYearFilter,
} from "./Chip";

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
  openFilter: () => void;
}

export const FilterChip = ({ filter, onChange, openFilter }: Props) => {
  const { genres } = useContext(SearchContext);

  const deleteActor = (id: number) => {
    let newValue: Array<number> = [...filter.actors];
    newValue = newValue.filter((el) => el !== id);
    onChange({ ...filter, actors: newValue });
  };

  const deleteWithGenre = (genre: Genre) => {
    let newGenres: Array<number> = [...filter.withgenres];
    newGenres = newGenres.filter((el) => el !== genre.id);
    onChange({ ...filter, withgenres: newGenres });
  };

  const deleteWithoutGenre = (genre: Genre) => {
    let newGenres: Array<number> = [...filter.withoutgenres];
    newGenres = newGenres.filter((el) => el !== genre.id);
    onChange({ ...filter, withoutgenres: newGenres });
  };

  const deleteOriginCountry = (value: LanguageOrigin) => {
    let newValues: Array<string> = [...filter.origincountry];
    newValues = newValues.filter((el) => el !== value.language);
    onChange({ ...filter, origincountry: newValues });
  };

  const deleteRuntime = (value: "over" | "under") => {
    let newFilter = { ...filter };
    if (value === "over") {
      newFilter = {
        ...filter,
        runtime: {
          ...filter.runtime,
          over: undefined,
        },
      };
    } else if (value === "under") {
      newFilter = {
        ...filter,
        runtime: {
          ...filter.runtime,
          under: undefined,
        },
      };
    }
    onChange(newFilter);
  };

  const deleteVote = (value: "over" | "under") => {
    let newFilter = { ...filter };
    if (value === "over") {
      newFilter = {
        ...filter,
        vote: {
          ...filter.vote,
          over: undefined,
        },
      };
    } else if (value === "under") {
      newFilter = {
        ...filter,
        vote: {
          ...filter.vote,
          under: undefined,
        },
      };
    }
    onChange(newFilter);
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

  return (
    <Grid container spacing={1}>
      <Grid item>
        <ChipMediaType
          active={false}
          onClick={() => openFilter()}
          type={filter.type}
        />
      </Grid>
      {filter.type === MediaType.movie &&
        filter.actors.map((id) => (
          <Grid item key={id}>
            <ChipActorFilter id={id} onDelete={() => deleteActor(id)} />
          </Grid>
        ))}
      {filter.withgenres.map((id) => {
        const genre = genres.find((el) => el.id === id);
        return (
          genre && (
            <Grid item key={genre.id}>
              <ChipGenreFilter
                genre={genre}
                onDelete={() => deleteWithGenre(genre)}
              />
            </Grid>
          )
        );
      })}
      {filter.withoutgenres.map((id) => {
        const genre = genres.find((el) => el.id === id);
        return (
          genre && (
            <Grid item key={genre.id}>
              <ChipGenreFilter
                genre={genre}
                onDelete={() => deleteWithoutGenre(genre)}
                without
              />
            </Grid>
          )
        );
      })}
      {filter.origincountry.map((id) => {
        const language = LANGUAGESORIGIN.find((el) => el.language === id);
        return (
          language && (
            <Grid item key={language.id}>
              <ChipLanguageOriginFilter
                value={language}
                onDelete={() => deleteOriginCountry(language)}
              />
            </Grid>
          )
        );
      })}
      {filter.vote.over && (
        <Grid item>
          <ChipVoteFilter
            value={filter.vote.over}
            type="over"
            onDelete={() => deleteVote("over")}
          />
        </Grid>
      )}
      {filter.vote.under && (
        <Grid item>
          <ChipVoteFilter
            value={filter.vote.under}
            type="under"
            onDelete={() => deleteVote("under")}
          />
        </Grid>
      )}
      {filter.runtime.over && (
        <Grid item>
          <ChipRuntimeFilter
            runtime={filter.runtime.over}
            type="over"
            onDelete={() => deleteRuntime("over")}
          />
        </Grid>
      )}
      {filter.runtime.under && (
        <Grid item>
          <ChipRuntimeFilter
            runtime={filter.runtime.under}
            type="under"
            onDelete={() => deleteRuntime("under")}
          />
        </Grid>
      )}
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
          <Grid item>
            <ChipYearFilter
              key={el}
              year={el}
              type="exact"
              onDelete={() => deleteYear(el)}
            />
          </Grid>
        ))}
    </Grid>
  );
};
