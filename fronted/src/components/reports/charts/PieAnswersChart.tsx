import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useMediaQuery, useTheme } from "@mui/material";

export const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#9c27b0",
  "#d32f2f",
  "#0288d1",
];

export default function PieAnswersChart({ data }: any) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const total = data.reduce((acc: number, item: any) => acc + item.count, 0);

  // ==========================================
  // LABEL PERSONALIZADO
  // ==========================================

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, value, index } = props;

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
          {data.map((_: any, index: number) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
