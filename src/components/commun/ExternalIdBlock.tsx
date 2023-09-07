import { Grid, IconButton } from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { TikTokIcon } from "./icon/TikTokIcon";
import { openInNewTab } from "src/utils/navigation";

interface Props {
  externalId: ExternalId;
}

export const ExternalIdBlock = ({ externalId }: Props) => {
  return (
    <Grid container spacing={1} sx={{ width: "fit-content" }}>
      {externalId.instagram_id !== null && externalId.instagram_id !== "" && (
        <Grid item>
          <IconButton
            aria-label="instagram"
            size="medium"
            onClick={() =>
              openInNewTab(
                `https://www.instagram.com/${externalId.instagram_id}`
              )
            }
          >
            <InstagramIcon fontSize="medium" />
          </IconButton>
        </Grid>
      )}
      {externalId.facebook_id !== null && externalId.facebook_id !== "" && (
        <Grid item>
          <IconButton
            aria-label="facebook"
            size="medium"
            onClick={() =>
              openInNewTab(`https://www.facebook.com/${externalId.facebook_id}`)
            }
          >
            <FacebookIcon fontSize="medium" />
          </IconButton>
        </Grid>
      )}
      {externalId.twitter_id !== null && externalId.twitter_id !== "" && (
        <Grid item>
          <IconButton
            aria-label="twitter"
            size="medium"
            onClick={() =>
              openInNewTab(`https://twitter.com/${externalId.twitter_id}`)
            }
          >
            <TwitterIcon fontSize="medium" />
          </IconButton>
        </Grid>
      )}
      {externalId.youtube_id !== null && externalId.youtube_id !== "" && (
        <Grid item>
          <IconButton
            aria-label="youtube"
            size="medium"
            onClick={() =>
              openInNewTab(`https://www.youtube.com/${externalId.youtube_id}`)
            }
          >
            <YouTubeIcon fontSize="medium" />
          </IconButton>
        </Grid>
      )}
      {externalId.tiktok_id !== null && externalId.tiktok_id !== "" && (
        <Grid item>
          <IconButton
            aria-label="tiktok"
            size="medium"
            onClick={() =>
              openInNewTab(`https://tiktok.com/${externalId.tiktok_id}`)
            }
          >
            <TikTokIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};
