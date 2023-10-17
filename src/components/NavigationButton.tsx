import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const ReturnArrow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate(-1)}
      sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 1 }}
    >
      <ArrowBackIosIcon />
      <Typography variant="h2">{t("commun.return")}</Typography>
    </Box>
  );
};
