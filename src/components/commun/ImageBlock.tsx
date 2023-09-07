import ImageIcon from "@mui/icons-material/Image";
import { CSSProperties } from "react";
import { Colors } from "src/style/Colors";
import { style } from "typestyle";

interface Props {
  style?: CSSProperties;
}

const divCss = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: Colors.greyLightMode,
});
export const ImageNotFoundBlock = ({ style }: Props) => {
  return (
    <div className={divCss} style={style}>
      <ImageIcon sx={{ width: "30%", height: "30%", fill: "white" }} />
    </div>
  );
};
