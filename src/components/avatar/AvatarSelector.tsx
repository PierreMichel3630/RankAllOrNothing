import { Avatar, Grid } from "@mui/material";
import { AVATARS } from "./Avatar";
import { useAuth } from "src/context/AuthProviderSupabase";

interface Props {
  selected: string | null;
  onSelect: (value: string | null) => void;
}

export const AvatarSelector = ({ selected, onSelect }: Props) => {
  const { user } = useAuth();

  const avatarExternal =
    user && user.user_metadata.avatar_url
      ? user.user_metadata.avatar_url
      : undefined;

  return (
    <Grid container spacing={1}>
      {avatarExternal && (
        <Grid item>
          <Avatar
            sx={{
              cursor: "pointer",
              border: selected === null ? "5px solid green" : "none",
              width: selected === null ? 55 : 50,
              height: selected === null ? 55 : 50,
            }}
            src={avatarExternal}
            onClick={() => onSelect(null)}
          />
        </Grid>
      )}
      {AVATARS.map((avatar, index) => {
        const stringIndex = index.toString();
        return (
          <Grid item key={index}>
            <Avatar
              sx={{
                cursor: "pointer",
                border: selected === stringIndex ? "5px solid green" : "none",
                width: selected === stringIndex ? 55 : 50,
                height: selected === stringIndex ? 55 : 50,
              }}
              src={avatar}
              onClick={() => onSelect(stringIndex)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
