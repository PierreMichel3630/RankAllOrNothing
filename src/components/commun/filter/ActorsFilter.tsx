import { Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "src/models/tmdb/commun/Filter";
import { ChipActorFilter } from "../Chip";
import { searchPerson } from "src/api/tmdb/person";
import { PersonSearchElement } from "src/models/tmdb/person/PersonSearchElement";
import { UserContext } from "src/App";
import { AutocompleteInputPerson } from "../Input";

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}
export const ActorsFilter = ({ filter, onChange }: Props) => {
  const { t } = useTranslation();
  const { language } = useContext(UserContext);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Array<PersonSearchElement>>([]);

  useEffect(() => {
    if (search !== "") {
      searchPerson(search, language.iso, 1).then((res) => {
        setResults([...res.results]);
      });
    } else {
      setResults([]);
    }
  }, [search]);

  const deleteActor = (id: number) => {
    let newValue: Array<number> = [...filter.actors];
    newValue = newValue.filter((el) => el !== id);
    onChange({ ...filter, actors: newValue });
  };

  const onSelectActor = (value: PersonSearchElement) => {
    let newValue: Array<number> = [...filter.actors];
    if (!newValue.includes(value.id)) {
      newValue.push(value.id);
      onChange({ ...filter, actors: newValue });
    }
    setSearch("");
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm={3}>
        <Typography variant="h2">{t("commun.actors")}</Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
        <AutocompleteInputPerson
          clear={() => setSearch("")}
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder={t("commun.searchactor")}
          results={results}
          onSelect={(value) => onSelectActor(value)}
        />
      </Grid>

      {filter.actors.map((id) => (
        <Grid item key={id}>
          <ChipActorFilter id={id} onDelete={() => deleteActor(id)} />
        </Grid>
      ))}
    </Grid>
  );
};
