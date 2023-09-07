import { Colors } from "src/style/Colors";

interface Props {
  percent: number;
  fill: string;
  size: number;
  color: string;
}
export const CircleArc = ({
  color = Colors.green,
  percent,
  fill,
  size,
}: Props) => {
  const strokeWidth = size / 10;
  const x = size / 2 + strokeWidth;
  const y = size / 2 + strokeWidth;
  const radius = size / 2;
  const startAngle = 0;
  const endAngle = percent < 1 ? percent * 360 : 359;
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return (
    <svg width={size + strokeWidth * 2} height={size + strokeWidth * 2}>
      <path stroke={color} strokeWidth={size / 10} d={d} fill={fill} />
    </svg>
  );
};

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};
