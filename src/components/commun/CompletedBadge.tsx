import { Typography } from "@mui/material";
import { Colors } from "src/style/Colors";
import { percent, px } from "csx";
import { style } from "typestyle";
import { CircleArc } from "./svg/CircleArc";

const divCss = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: Colors.black,
  borderRadius: percent(50),
  height: px(65),
  width: px(65),
});

interface Props {
  value: number;
  total: number;
}

export const CompletedBadge = ({ value, total }: Props) => {
  let percent = total !== 0 ? value / total : 0;

  let color: string = Colors.green;
  if (percent < 0.8) {
    color = Colors.yellow;
  }
  if (percent < 0.6) {
    color = Colors.orange;
  }
  if (percent < 0.4) {
    color = Colors.red;
  }

  const percentText = Number(percent * 100).toFixed(2);

  return (
    <div className={divCss}>
      <div>
        <CircleArc percent={percent} fill="none" size={65} color={color} />
      </div>
      <div
        style={{
          position: "absolute",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">{percentText}%</Typography>
        <Typography variant="body2">
          {value} / {total}
        </Typography>
      </div>
    </div>
  );
};
