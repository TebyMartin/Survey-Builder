import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useMediaQuery, useTheme } from "@mui/material";
import type { ChoiceAnswer } from "../../../types/report";
import { COLORS } from "./reportColors";

interface PieLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  value?: number;
  index?: number;
}

interface Props {
  data: ChoiceAnswer[];
}

export default function PieAnswersChart({ data }: Props) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const total = data.reduce((acc, item) => acc + item.count, 0);

  // ==========================================
  // LABEL PERSONALIZADO
  // ==========================================

  const renderCustomizedLabel = (props: PieLabelProps) => {
    const cx = props.cx ?? 0;
    const cy = props.cy ?? 0;
    const midAngle = props.midAngle ?? 0;
    const outerRadius = props.outerRadius ?? 0;
    const value = props.value ?? 0;
    const index = props.index ?? 0;

    const RADIAN = Math.PI / 180;

    const radius = outerRadius + 20;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);

    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontWeight="bold"
      >
        {percentage}%
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy={isMobile ? "50%" : "45%"}
          outerRadius={isMobile ? 65 : 90}
          label={!isMobile ? renderCustomizedLabel : false}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
