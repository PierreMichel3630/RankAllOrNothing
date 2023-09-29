import { Grid, Typography } from "@mui/material";
import padlock from "../assets/padlock.png";

interface Props {
  text?: string;
}
export const UnauthorizedBlock = ({ text }: Props) => (
  <Grid container justifyContent="center">
    <Grid item>
      <img src={padlock} width={150} />
    </Grid>
    <Grid item xs={12} sx={{ textAlign: "center" }}>
      <Typography variant="h4">{text}</Typography>
    </Grid>
  </Grid>
);
