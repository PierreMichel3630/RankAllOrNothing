import { Chip, Grid } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "src/App";
import { CategoryLocalLanguage } from "src/models/Category";
import { ChipSkeleton } from "./commun/skeleton/Skeleton";
import { sortByName } from "src/utils/sort";

interface Props {
  selected: Array<CategoryLocalLanguage>;
  onChange: (value: Array<CategoryLocalLanguage>) => void;
}

export const CategoriesChips = ({ selected, onChange }: Props) => {
  const { language, categories } = useContext(UserContext);

  const select = (category: CategoryLocalLanguage) => {
    const isSelect = selected.some((el) => el.id === category.id);
    let newCategories = isSelect
      ? [...selected].filter((el) => el.id !== category.id)
      : [...selected, category];
    onChange(newCategories);
  };

  const categoriesLocal: Array<CategoryLocalLanguage> = categories.map(
    (category) => ({ id: category.id, name: category.name[language.iso] })
  );

  return (
    <Grid container spacing={1} justifyContent="center">
      {categories.length === 0
        ? Array.from(new Array(8)).map((_, index) => (
            <Grid item key={index}>
              <ChipSkeleton width={80} />
            </Grid>
          ))
        : categoriesLocal.sort(sortByName).map((category) => {
            const isSelect = selected.some((el) => el.id === category.id);
            return (
              <Grid item key={category.id}>
                <Chip
                  label={category.name}
                  variant={isSelect ? "filled" : "outlined"}
                  onClick={() => select(category)}
                />
              </Grid>
            );
          })}
    </Grid>
  );
};
