import { Typography } from "@mui/material";
import { px } from "csx";
import { useContext } from "react";
import {
  Cell,
  Label,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { UserContext } from "src/App";
import { Colors } from "src/style/Colors";

export interface DataDonut {
  name: string;
  value: number;
  color: string;
}
interface Props {
  title: string;
  data: Array<DataDonut>;
}
export const DonutChart = ({ data, title }: Props) => {
  const { mode } = useContext(UserContext);

  const getTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: payload[0].payload.payload.color,
            borderRadius: px(5),
            padding: px(5),
            display: "flex",
            gap: px(10),
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Typography variant="body1">{payload[0].name} :</Typography>
          <Typography variant="h4">{payload[0].value}</Typography>
        </div>
      );
    }

    return null;
  };
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          stroke="none"
          innerRadius={70}
          paddingAngle={5}
        >
          {data.map((el, index) => (
            <Cell key={`cell-${index}`} fill={el.color} />
          ))}
          <LabelList dataKey="name" position="outside" />
          <Label
            value={title}
            position="center"
            fontSize="18px"
            fill={mode === "dark" ? Colors.white : Colors.black}
            fontWeight="700"
          />
        </Pie>
        <Tooltip content={getTooltip} />
      </PieChart>
    </ResponsiveContainer>
  );
};
