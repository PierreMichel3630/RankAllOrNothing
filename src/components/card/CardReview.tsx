import { Box, Grid, Paper, Typography } from "@mui/material";
import { Review } from "src/models/Review";
import { AvatarAccount } from "../avatar/AvatarAccount";

import StarIcon from "@mui/icons-material/Star";
import { padding } from "csx";

interface Props {
  review: Review;
}

export const CardReview = ({ review }: Props) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <AvatarAccount avatar={review.user_uuid.avatar} size={50} />
        </Grid>
        <Grid item>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="h2">{review.user_uuid.username}</Typography>
            {review.notation !== null && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  padding: padding(1, 5),
                  alignItems: "center",
                  border: "2px solid",
                  borderRadius: 2,
                  borderColor: "secondary",
                  width: "fit-content",
                }}
              >
                <StarIcon fontSize="small" />
                <Typography variant="body1">
                  {review.notation.toFixed(1)}
                </Typography>
              </Box>
            )}
          </Box>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {review.opinion}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
