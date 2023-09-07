import { Tooltip, Typography } from "@mui/material";
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
  height: px(48),
  width: px(48),
});

interface Props {
  value: number | null;
  tooltip?: string;
}

export const VoteBadge = ({ value, tooltip }: Props) => {
  let rating = "0";
  let ratingNumber = 0;
  let percent = 0;

  if (value !== null) {
    rating = Number(value).toFixed(2);
    ratingNumber = Number(rating);
    percent = value / 10;
  }

  let color: string = Colors.green;
  if (ratingNumber < 8) {
    color = Colors.yellow;
  }
  if (ratingNumber < 6) {
    color = Colors.orange;
  }
  if (ratingNumber < 4) {
    color = Colors.red;
  }

  return tooltip ? (
    <Tooltip title={tooltip}>
      <div className={divCss}>
        <div>
          <CircleArc percent={percent} fill="none" size={40} color={color} />
        </div>
        <Typography
          variant="body2"
          sx={{ position: "absolute", color: "white" }}
        >
          {value !== null ? rating : "-.--"}
        </Typography>
      </div>
    </Tooltip>
  ) : (
    <div className={divCss}>
      <div>
        <CircleArc percent={percent} fill="none" size={40} color={color} />
      </div>
      <Typography variant="body2" sx={{ position: "absolute", color: "white" }}>
        {value !== null ? rating : "-.--"}
      </Typography>
    </div>
  );
};
