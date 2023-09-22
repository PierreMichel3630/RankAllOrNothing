import { Alert, Container, Divider, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserContext } from "src/App";
import { getValuesByTheme } from "src/api/supabase/value";
import { CardValueTranslate } from "src/components/commun/Card";
import { CardSkeleton } from "src/components/commun/skeleton/Skeleton";
import { Theme } from "src/models/Theme";
import { useQuery } from "src/utils/hook";

export const TranslatePage = () => {
  const ITEMPERPAGE = 20;

  const { t } = useTranslation();
  const { language } = useContext(UserContext);

  const [search, setSearch] = useState("");
  const [values, setValues] = useState<Array<Theme>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const params = useQuery();
  const idTheme = params.has("theme")
    ? (params.get("theme") as string)
    : undefined;

  const getRanks = async () => {
    if (idTheme && language) {
      const { data } = await getValuesByTheme(
        Number(idTheme),
        search,
        language.iso
      );
      if (data) {
        setValues(data as Array<Theme>);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getRanks();
  }, [idTheme, search, language]);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{t("commun.translate")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {isLoading ? (
          Array.from(new Array(ITEMPERPAGE)).map((_, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3}>
              <CardSkeleton />
            </Grid>
          ))
        ) : values.length > 0 ? (
          values.map((value) => (
            <Grid key={value.id} item xs={12}>
              <CardValueTranslate value={value} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <Alert severity="warning">{t("commun.noresult")}</Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
