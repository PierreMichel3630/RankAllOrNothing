import { Avatar, AvatarGroup } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "src/App";
import { BUCKET_LANGUAGE, getUrlPublic } from "src/api/supabase/storage";

interface PropsAvatarGroupFlag {
  ids?: Array<number>;
}
export const AvatarGroupFlag = ({ ids }: PropsAvatarGroupFlag) => {
  const { languages } = useContext(UserContext);
  const filterLanguages = ids
    ? [...languages].filter((el) => ids.includes(el.id))
    : [...languages];

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

interface AvatarAccountProps {
  picture: string;
  size?: number;
}

export const AvatarAccount = ({ picture, size }: AvatarAccountProps) => {
  const DEFAULT_SIZE = 35;

  const getPicture = () => {
    let src = "/src/assets/man-avatar.svg";
    if (picture === "1") {
      src = "/src/assets/man-avatar.svg";
    } else {
      src = picture;
    }
    return src;
  };

  return (
    <Avatar
      alt="Avatar"
      src={getPicture()}
      sx={{
        width: size ? size : DEFAULT_SIZE,
        height: size ? size : DEFAULT_SIZE,
      }}
    />
  );
};
