import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "src/App";
import { DEFAULT_ISO_LANGUAGE } from "src/api/supabase/language";
import { Theme } from "src/models/Theme";
import { style } from "typestyle";
import { AvatarGroupFlag } from "../commun/Avatar";

const cardCss = style({
  height: percent(100),
});

interface PropsCardTheme {
  value: Theme;
}

export const CardTheme = ({ value }: PropsCardTheme) => {
  const { language } = useContext(UserContext);

  const nameLocalLanguage = value.name[language.iso];
  const nameEnglish = value.name[DEFAULT_ISO_LANGUAGE];
  const name = nameLocalLanguage ? nameLocalLanguage : nameEnglish;

  const descriptionLocalLanguage = value.description[language.iso];
  const descriptionEnglish = value.description[DEFAULT_ISO_LANGUAGE];
  const description = descriptionLocalLanguage
    ? descriptionLocalLanguage
    : descriptionEnglish;

  return (
    <Link
      to={value.extern ? `/external/theme/${value.id}` : `/theme/${value.id}`}
    >
      <Card className={cardCss}>
        <CardMedia
          sx={{
            width: percent(100),
            aspectRatio: "auto",
            minHeight: px(250),
          }}
          image={value.image}
          title={name}
        />
        <CardContent sx={{ position: "relative" }}>
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                transform: "translate(0%,-50%)",
              }}
            >
              <AvatarGroupFlag json={value.name} />
            </div>
            <Typography variant="h4">{name}</Typography>
            <Typography
              variant="body1"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
              }}
            >
              {description}
            </Typography>
          </>
        </CardContent>
      </Card>
    </Link>
  );
};
