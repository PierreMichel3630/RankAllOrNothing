import { Dialog, IconButton, ImageListItemBar, Skeleton } from "@mui/material";
import { saveAs } from "file-saver";
import { percent, viewHeight } from "csx";

import { Image } from "src/models/tmdb/commun/Image";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useEffect, useState } from "react";
import { getBreakpoint } from "src/utils/mediaQuery";

interface Props {
  images: Array<Image>;
  selected: Image;
  open: boolean;
  name: string;
  onClose: () => void;
}

export const ImageDialog = ({
  name,
  images,
  selected,
  open,
  onClose,
}: Props) => {
  const [index, setIndex] = useState<undefined | number>(
    images.findIndex((el) => el.file_path === selected.file_path)
  );
  const image = index !== undefined ? images[index] : undefined;
  const isMultipleImage = images.length > 1;

  useEffect(() => {
    setIndex(images.findIndex((el) => el.file_path === selected.file_path));
  }, [selected]);

  const imageName = image
    ? `${name ? `${name} - ` : ""} ${image.type.toString()} ${index}`
    : "";

  const downloadImage = () => {
    if (image) {
      saveAs(
        `https://image.tmdb.org/t/p/original${image.file_path}`,
        imageName
      );
    }
  };

  const navigateImage = (value: number) => {
    if (index !== undefined) {
      let newIndex = index + value;
      setIndex(
        newIndex >= images.length
          ? 0
          : newIndex < 0
          ? images.length - 1
          : newIndex
      );
    }
  };

  const breakpoint = getBreakpoint();
  const imageSize = {
    xs: 780,
    sm: 1280,
    md: 1280,
    lg: undefined,
    xl: undefined,
  }[breakpoint];

  const getSrcImage = (image: Image) => {
    const url = `https://image.tmdb.org/t/p/${
      imageSize ? `w${imageSize}` : "original"
    }${image.file_path}`;
    return url;
  };

  return (
    <Dialog
      onClose={() => {
        onClose();
        setIndex(undefined);
      }}
      open={open}
      maxWidth="lg"
    >
      {image ? (
        <>
          <div
            style={{
              position: "relative",
              maxHeight: viewHeight(80),
              display: "flex",
              maxWidth: percent(100),
              alignItems: "center",
            }}
          >
            {isMultipleImage && (
              <IconButton
                aria-label="previous image"
                sx={{ position: "absolute", left: 10 }}
                size="small"
                onClick={() => navigateImage(-1)}
              >
                <ArrowBackIosIcon fontSize="large" />
              </IconButton>
            )}
            <img
              src={getSrcImage(image)}
              style={{ maxHeight: viewHeight(80), maxWidth: percent(100) }}
              loading="lazy"
            />
            {isMultipleImage && (
              <IconButton
                aria-label="next image"
                sx={{ position: "absolute", right: 10 }}
                size="small"
                onClick={() => navigateImage(+1)}
              >
                <ArrowForwardIosIcon fontSize="large" />
              </IconButton>
            )}
          </div>
          <ImageListItemBar
            title={imageName}
            subtitle={`${image.width}px x ${image.height}px`}
            actionIcon={
              <IconButton
                aria-label="download image"
                size="large"
                sx={{ marginRight: 2 }}
                onClick={downloadImage}
              >
                <FileDownloadIcon />
              </IconButton>
            }
          />
        </>
      ) : (
        <Skeleton
          variant="rectangular"
          sx={{ width: percent(100), height: viewHeight(40) }}
        />
      )}
    </Dialog>
  );
};
