import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";

interface Props {
  data: {
    date: string;
    count: number;
  }[];
}

export default function ResponsesChart({ data }: Props) {
  return (
    <Card
      id="responses-chart"
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        transition: ".25s",

        "&:hover": {
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ShowChartIcon />
            </Box>

            <Box>
              <Typography variant="h6" fontWeight="bold">
                Respuestas por día
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Evolución diaria de respuestas recibidas.
              </Typography>
            </Box>
          </Box>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const [day, month] = value.split("/");

                  const months = [
                    "ene",
                    "feb",
                    "mar",
                    "abr",
                    "may",
                    "jun",
                    "jul",
                    "ago",
                    "sep",
                    "oct",
                    "nov",
                    "dic",
                  ];

                  return `${Number(day)} ${months[Number(month) - 1]}`;
                }}
              />

              <YAxis allowDecimals={false} />

              <Tooltip
                formatter={(value) => [value, "Respuestas"]}
                labelFormatter={(label) => `Fecha: ${label}`}
              />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#1976d2"
                strokeWidth={4}
                dot={{
                  r: 5,
                }}
                activeDot={{
                  r: 8,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Stack>
      </CardContent>
    </Card>
  );
}
