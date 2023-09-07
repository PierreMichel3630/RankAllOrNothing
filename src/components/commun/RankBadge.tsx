import { Typography } from "@mui/material";

import medal1 from "../../assets/rank/medal1.png";
import medal2 from "../../assets/rank/medal2.png";
import medal3 from "../../assets/rank/medal3.png";
import { style } from "typestyle";
import { Colors } from "src/style/Colors";
import { percent, px } from "csx";

const divCss = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: Colors.black,
  borderRadius: percent(50),
  height: px(35),
  width: px(35),
});

interface Props {
  rank: number;
}
export const RankBadge = ({ rank }: Props) => {
  const SIZE = 50;
  const getIcon = () => {
    let icon = (
      <div className={divCss}>
        <Typography variant="h2" sx={{ color: "white" }}>
          {rank}
        </Typography>
      </div>
    );
    switch (rank) {
      case 1:
        icon = <img src={medal1} width={SIZE} height={SIZE} />;
        break;
      case 2:
        icon = <img src={medal2} width={SIZE} height={SIZE} />;
        break;
      case 3:
        icon = <img src={medal3} width={SIZE} height={SIZE} />;
        break;
    }
    return icon;
  };

  return <>{getIcon()}</>;
};
