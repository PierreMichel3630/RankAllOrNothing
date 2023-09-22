import { Avatar, AvatarGroup } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "src/App";
import { BUCKET_LANGUAGE, getUrlPublic } from "src/api/supabase/storage";
import { JsonLanguage } from "src/models/Language";

interface PropsAvatarGroupFlag {
  json: JsonLanguage;
}
export const AvatarGroupFlag = ({ json }: PropsAvatarGroupFlag) => {
  const { languages } = useContext(UserContext);
  const isoLanguages = Object.getOwnPropertyNames(json);

  const filterLanguages = [...languages].filter((el) =>
    isoLanguages.includes(el.iso)
  );

  return (
    <AvatarGroup
      max={3}
      sx={{
        "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 15 },
      }}
    >
      {filterLanguages.map((language) => (
        <Avatar
          key={language.id}
          alt={language.name}
          src={getUrlPublic(BUCKET_LANGUAGE, language.image)}
          sx={{ width: 24, height: 24 }}
        />
      ))}
    </AvatarGroup>
  );
};
