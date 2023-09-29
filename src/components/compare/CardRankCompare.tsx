import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { useContext } from "react";
import { UserContext } from "src/App";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { BUCKET_VALUE, getUrlPublic } from "src/api/supabase/storage";
import { Profile } from "src/models/Profile";
import { RankCompare } from "src/models/Rank";
import { style } from "typestyle";
import { CompareValueBlock } from "./CompareValueBlock";

const cardCss = style({
  height: percent(100),
  display: "flex",
  flexDirection: "column",
});

interface Props {
  rank: RankCompare;
  user1: Profile;
  user2: Profile;
}

export const CardRankCompare = ({ rank, user1, user2 }: Props) => {
  const { language } = useContext(UserContext);
  const nameLocalLanguage = rank.value.name[language.iso];
  const nameEnglish = rank.value.name[DEFAULT_ISO_LANGUAGE];
  const name = nameLocalLanguage ? nameLocalLanguage : nameEnglish;

  const rankUser1 = rank.rankUser1 ? rank.rankUser1.rank : null;
  const rankUser2 = rank.rankUser2 ? rank.rankUser2.rank : null;

  const notationUser1 = rank.rankUser1 ? rank.rankUser1.notation : null;
  const notationUser2 = rank.rankUser2 ? rank.rankUser2.notation : null;

  return (
    <Card className={cardCss}>
      <CardMedia
        sx={{
          width: percent(100),
          aspectRatio: "auto",
          maxHeight: percent(100),
          minHeight: px(250),
        }}
        image={getUrlPublic(BUCKET_VALUE, rank.value.image)}
        title={name}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h4">{name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <CompareValueBlock
              user1={user1}
              user2={user2}
              valueUser1={rankUser1}
              valueUser2={rankUser2}
              title={"Rank"}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <CompareValueBlock
              user1={user1}
              user2={user2}
              valueUser1={notationUser1}
              valueUser2={notationUser2}
              title={"Notation"}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
