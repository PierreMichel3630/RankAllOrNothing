import { Box, Pagination, Paper, Typography } from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";
import { getBreakpoint } from "src/utils/mediaQuery";

interface Props {
  totalPage: number;
  page: number;
  totalResult?: number;
  onChange: (page: number) => void;
}

const MAXPAGE = 500;

export const FixedBottomPagination = ({
  totalPage,
  totalResult,
  page,
  onChange,
}: Props) => {
  const { t } = useTranslation();
  const breakpoint = getBreakpoint();
  return (
    <Paper
      sx={{
        position: "sticky",
        top: "0px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
        marginTop: 2,
        width: percent(100),
        zIndex: 100,
      }}
      elevation={3}
    >
      <Pagination
        count={totalPage > MAXPAGE ? MAXPAGE : totalPage}
        page={page}
        defaultPage={1}
        siblingCount={breakpoint === "xs" ? 0 : 1}
        boundaryCount={breakpoint === "xs" ? 1 : 2}
        onChange={(event, page) => onChange(page)}
        showFirstButton={breakpoint !== "xs"}
        showLastButton={breakpoint !== "xs"}
      />
      {totalResult && (
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: { md: "absolute" },
            right: { md: 10 },
          }}
        >
          <Typography variant="body1">
            {`${totalResult} ${t("commun.results")}`}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
