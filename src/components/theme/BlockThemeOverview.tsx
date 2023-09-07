import { Alert, Grid, IconButton, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "src/App";
import {
  countRanksByTheme,
  deleteRank,
  getRanksByTheme,
  insertCheck,
} from "src/api/supabase/rank";
import { countValueByTheme, getValuesByTheme } from "src/api/supabase/value";
import { CardValue } from "src/components/commun/Card";
import { BasicSearchInput } from "src/components/commun/Input";
import { CardSkeleton } from "src/components/commun/skeleton/Skeleton";
import { CreateValueDialog } from "src/components/dialog/CreateValueDialog";
import { Rank } from "src/models/Rank";
import { ThemeView } from "src/models/Theme";
import { ValueView } from "src/models/Value";

import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TranslateIcon from "@mui/icons-material/Translate";
import { RankDialog } from "../dialog/RankDialog";
import { MessageSnackbar } from "../commun/Snackbar";
import { sortByTrads } from "src/utils/sort";
import { CompletedBadge } from "../commun/CompletedBadge";
import { useAuth } from "src/context/AuthProviderSupabase";

interface Props {
  theme: ThemeView;
}
export const BlockThemeOverview = ({ theme }: Props) => {
  const ITEMPERPAGE = 20;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState<Array<ValueView>>([]);
  const [value, setValue] = useState<ValueView | undefined>(undefined);
  const [ranks, setRanks] = useState<Array<Rank>>([]);

  const [total, setTotal] = useState<number | null>(null);
  const [rankTotal, setRankTotal] = useState<number | null>(null);

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalRate, setOpenModalRate] = useState(false);

  const getRanks = async () => {
    const { data } = await getRanksByTheme(theme.id);
    if (data) {
      setRanks(data as Array<Rank>);
    }
  };

  useEffect(() => {
    getRanks();
  }, [theme]);

  useEffect(() => {
    setIsLoading(true);
    searchAll();
  }, [theme, search, language]);

  const searchAll = async () => {
    const { data } = await getValuesByTheme(theme.id, search, language.iso);
    setValues(data as Array<ValueView>);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      searchAll();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, language]);

  const validate = () => {
    setOpenModalAdd(false);
    searchAll();
  };

  const checkValue = async (value: ValueView) => {
    if (user !== null) {
      const { error } = await insertCheck({
        value: value.id,
        rank: ranks.length + 1,
        theme: theme.id,
      });
      if (error) {
        setMessage(t("commun.error"));
      } else {
        getRanks();
        getCompletion();
        setMessage("");
      }
    } else {
      navigate("/login");
    }
  };

  const removeRank = async (rank: Rank | undefined) => {
    if (rank) {
      const { error } = await deleteRank(rank.id);
      if (error) {
        setMessage(t("commun.error"));
      } else {
        getRanks();
        getCompletion();
        setMessage("");
      }
    }
  };

  const rateValue = (value: ValueView) => {
    if (user !== null) {
      setValue(value);
      setOpenModalRate(true);
    } else {
      navigate("/login");
    }
  };

  const addRank = () => {
    setOpenModalRate(false);
    setValue(undefined);
    getRanks();
    getCompletion();
  };

  const closeModalRank = () => {
    setOpenModalRate(false);
    setValue(undefined);
  };

  const getCountRank = async () => {
    const res = await countRanksByTheme(Number(theme.id));
    setRankTotal(res.count);
  };

  const getCountValue = async () => {
    const res = await countValueByTheme(Number(theme.id));
    setTotal(res.count);
  };

  const getCompletion = () => {
    setRankTotal(null);
    setTotal(null);
    getCountRank();
    getCountValue();
  };

  useEffect(() => {
    getCompletion();
  }, [theme]);

  return (
    <Grid container spacing={2} alignItems="center">
      <div style={{ position: "absolute", top: 25, right: 0 }}>
        {rankTotal !== null && total !== null && (
          <CompletedBadge value={rankTotal} total={total} />
        )}
      </div>
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item xs>
            <BasicSearchInput
              label={t("pages.theme.search")}
              onChange={(value) => setSearch(value)}
              value={search}
              clear={() => setSearch("")}
            />
          </Grid>
          {/*<Grid item>
            <Tooltip title={t("commun.addvalue")} placement="top">
              <IconButton
                type="button"
                size="large"
                aria-label={t("commun.addvalue")}
                onClick={() => setOpenModalAdd(true)}
              >
                <AddIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Link to={`/rank?theme=${theme.id}`}>
              <Tooltip title={t("commun.myrank")} placement="top">
                <IconButton
                  type="button"
                  size="large"
                  aria-label={t("commun.myrank")}
                >
                  <EmojiEventsIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
          <Grid item>
            <Link to={`/translate?theme=${theme.id}`}>
              <Tooltip title={t("commun.translate")} placement="top">
                <IconButton
                  type="button"
                  size="large"
                  aria-label={t("commun.translate")}
                >
                  <TranslateIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>*/}
        </Grid>
      </Grid>
      {isLoading ? (
        Array.from(new Array(ITEMPERPAGE)).map((_, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3}>
            <CardSkeleton />
          </Grid>
        ))
      ) : values.length > 0 ? (
        values
          .sort((a, b) => sortByTrads(a, b, language))
          .map((value) => (
            <Grid key={value.id} item xs={12} sm={6} md={4} lg={3} xl={3}>
              <CardValue
                value={value}
                check={() => checkValue(value)}
                rate={() => rateValue(value)}
                remove={removeRank}
                ranks={ranks}
              />
            </Grid>
          ))
      ) : (
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Alert severity="warning">{t("commun.noresult")}</Alert>
        </Grid>
      )}
      <CreateValueDialog
        open={openModalAdd}
        close={() => setOpenModalAdd(false)}
        theme={theme}
        validate={validate}
      />
      {value && (
        <RankDialog
          open={openModalRate}
          close={closeModalRank}
          value={value}
          ranks={ranks}
          validate={addRank}
        />
      )}
      <MessageSnackbar
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
      />
    </Grid>
  );
};