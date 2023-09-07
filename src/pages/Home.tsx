import { Container, Fab, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ScrollTop } from "src/components/commun/ScrollTop";
import { Header } from "src/components/header/Header";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Footer } from "src/components/footer/Footer";

export const Home = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Container maxWidth="lg">
          <Header />
        </Container>
      </Grid>
      <Grid item xs={12} sx={{ marginBottom: 8 }}>
        <Outlet />
      </Grid>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      <Footer />
    </Grid>
  );
};
