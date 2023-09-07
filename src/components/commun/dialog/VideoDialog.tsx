import { Dialog } from "@mui/material";
import { Video } from "src/models/tmdb/commun/Video";

interface Props {
  videos: Array<Video>;
  open: boolean;
  onClose: () => void;
}

export const VideoDialog = ({ videos, open, onClose }: Props) => {
  return (
    <Dialog onClose={onClose} open={open} maxWidth="md" fullWidth>
      <iframe
        width="100%"
        height="480"
        src={`https://www.youtube.com/embed/${videos[0].key}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </Dialog>
  );
};
