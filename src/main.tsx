import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <LocalizationProvider dateAdapter={AdapterMoment}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </LocalizationProvider>
);
