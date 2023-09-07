import { Button } from "@mui/material";
import logo from "../../assets/social-google.svg";

interface Props {
  label: string;
  onClick: () => void;
}

export const GoogleButton = ({ label, onClick }: Props) => (
  <Button
    color="inherit"
    variant="outlined"
    startIcon={<img src={logo} />}
    onClick={onClick}
  >
    {label}
  </Button>
);
