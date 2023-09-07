import {
  Alert,
  Chip,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { SeeMoreButton } from "./button/Button";
import { getBreakpoint } from "src/utils/mediaQuery";
import { ImageDialog } from "./commun/dialog/ImageDialog";
import { Image } from "src/models/tmdb/commun/Image";
import { PhotoSkeleton } from "./commun/skeleton/Skeleton";

enum Filter {
  all = "all",
  poster = "poster",
  logo = "logo",
  backdrop = "backdrop",
  profile = "profile",
}

interface Props {
  images: Array<Image>;
  hasFilter?: boolean;
  name?: string;
  isLoading?: boolean;
}

export const PhotosBlock = ({
  name,
  images,
  hasFilter = false,
  isLoading = false,
}: Props) => {
  const PERSEEMORE = 36;
  const NUMBERLINESHOW = 2;
  const FILTERFALSE = {
    all: false,
    poster: false,
    logo: false,
    backdrop: false,
    profile: false,
  };

  const { t } = useTranslation();

  const [seeMore, setSeeMore] = useState(false);
  const [seeMoreNumber, setSeeMoreNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | undefined>(
    undefined
  );
  const [filter, setFilter] = useState({
    all: true,
    poster: false,
    logo: false,
    backdrop: false,
    profile: false,
  });

  const breakpoint = getBreakpoint();
  const cols = {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 3,
  }[breakpoint];
  const itemPerLine = cols * NUMBERLINESHOW;

  const filterPhotos = (a: Image) => {
    let res = false;
    if (filter[Filter.all]) {
      res = true;
    } else if (filter[Filter.backdrop]) {
      res = a.type === Filter.backdrop.toString();
    } else if (filter[Filter.logo]) {
      res = a.type === Filter.logo.toString();
    } else if (filter[Filter.poster]) {
      res = a.type === Filter.poster.toString();
    }
    return res;
  };

  const selectImage = (value: Image) => {
    setSelectedImage(value);
    setOpen(true);
  };

  const selectFilter = (value: Filter) => {
    setSeeMoreNumber(0);
    setFilter({ ...FILTERFALSE, [value]: !filter[value] });
  };

  const imagesFilter = images.filter(filterPhotos);

  const imagesDisplay = imagesFilter.slice(
    0,
    itemPerLine + seeMoreNumber * PERSEEMORE
  );

  const onClickSeeMore = () => {
    const newSeeMoreNumber = seeMoreNumber + 1;
    const totalItemShowNext = itemPerLine + newSeeMoreNumber * PERSEEMORE;
    const isEnd = totalItemShowNext >= imagesFilter.length;
    setSeeMoreNumber(seeMore ? 0 : newSeeMoreNumber);
    setSeeMore(isEnd);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs="auto">
            <Typography variant="h2">{t("commun.photos")}</Typography>
          </Grid>
          {hasFilter && (
            <>
              <Grid item>
                <Chip
                  label={t("commun.all")}
                  variant={filter.all ? "filled" : "outlined"}
                  onClick={() => selectFilter(Filter.all)}
                />
              </Grid>
              <Grid item>
                <Chip
                  label={t("commun.backdrop")}
                  variant={filter.backdrop ? "filled" : "outlined"}
                  onClick={() => selectFilter(Filter.backdrop)}
                />
              </Grid>
              <Grid item>
                <Chip
                  label={t("commun.logo")}
                  variant={filter.logo ? "filled" : "outlined"}
                  onClick={() => selectFilter(Filter.logo)}
                />
              </Grid>
              <Grid item>
                <Chip
                  label={t("commun.poster")}
                  variant={filter.poster ? "filled" : "outlined"}
                  onClick={() => selectFilter(Filter.poster)}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
      {isLoading ? (
        Array.from(new Array(itemPerLine)).map((_, index) => (
          <Grid key={index} item xs={12 / cols}>
            <PhotoSkeleton />
          </Grid>
        ))
      ) : images.length > 0 ? (
        <>
          <Grid item xs={12}>
            <ImageList variant="woven" cols={cols} gap={5}>
              {imagesDisplay.map((image, index) => (
                <ImageListItem
                  key={index}
                  onClick={() => selectImage(image)}
                  sx={{ cursor: "pointer" }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                    srcSet={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
          {imagesFilter.length > cols * NUMBERLINESHOW && (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SeeMoreButton seeMore={seeMore} onClick={onClickSeeMore} />
            </Grid>
          )}
          {selectedImage && (
            <ImageDialog
              onClose={() => {
                setOpen(false);
                setSelectedImage(undefined);
              }}
              open={open}
              images={imagesFilter}
              selected={selectedImage}
              name={name ?? ""}
            />
          )}
        </>
      ) : (
        <Grid item xs={12} sx={{ marginTop: 2 }}>
          <Alert severity="warning">{t("commun.noresultimage")}</Alert>
        </Grid>
      )}
    </Grid>
  );
};
