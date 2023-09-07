import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface Props {
  seeMore: boolean;
  onClick: () => void;
}

export const SeeMoreButton = ({ seeMore, onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="text"
      onClick={() => onClick()}
      startIcon={seeMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      endIcon={seeMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      sx={{
        color: "inherit",
      }}
    >
      <Typography variant="h6">
        {seeMore ? t("commun.seeLess") : t("commun.seeMore")}
      </Typography>
    </Button>
  );
};
