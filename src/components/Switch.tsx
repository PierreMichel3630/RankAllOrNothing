import { Switch, styled } from "@mui/material";
import { Colors } from "src/style/Colors";

import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
}

const VisibilityAccountSwitchStyle = styled(Switch)(({ theme }) => ({
  width: 80,
  height: 45,
  padding: 3,
  "& .MuiSwitch-switchBase": {
    padding: 3,
    transform: "translate(5px, 2px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translate(35px, 2px)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: Colors.green,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 50,
    height: 50,
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: Colors.red,
    borderRadius: 50,
  },
}));

export const VisibilityAccountSwitch = ({ value, onChange }: Props) => (
  <VisibilityAccountSwitchStyle
    icon={<LockIcon sx={{ width: 35, height: 35 }} />}
    checkedIcon={<LockOpenIcon sx={{ width: 35, height: 35 }} />}
    checked={value}
    onChange={(_, newValue) => onChange(newValue)}
  />
);
