import { CardContent, Chip, Stack, Typography, Box } from "@mui/material";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import ReportCard from "../ReportCard";

interface MatrixValueSummary {
  value: string;
  count: number;
  percentage: number;
}

interface MatrixRowSummary {
  id: string;
  label: string;
  answered: number;
  values: MatrixValueSummary[];
}

interface Props {
  question: {
    title: string;
    answers: MatrixRowSummary[];
  };
}

const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#9c27b0",
  "#d32f2f",
  "#0288d1",
  "#7b1fa2",
];

export default function MatrixSummary({ question }: Props) {
  return (
    <ReportCard title={question.title}>
      <Chip
        color="primary"
        label={`${question.answers.length} filas`}
        sx={{ mb: 3 }}
      />

      <CardContent>
        <Stack spacing={5}>
          {question.answers.map((row) => {
            const chartData = row.values.map((item) => ({
              name: item.value,
              value: item.count,
            }));

            return (
              <Box key={row.id}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  {row.label}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      md: "row",
                    },
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  {/* GRÁFICO */}
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 420,
                      height: 300,
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          label={({ name, percent }) =>
                            `${name} ${(percent! * 100).toFixed(0)}%`
                          }
                        >
                          {chartData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip formatter={(value) => [value, "Respuestas"]} />

                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>

                  {/* DETALLE */}
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 400,
                    }}
                  >
                    <Stack spacing={1.5}>
                      {row.values.map((item) => {
                        const percentage = item.percentage * 100;

                        return (
                          <Box
                            key={item.value}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: "action.hover",
                            }}
                          >
                            <Typography fontWeight={500}>
                              {item.value}
                            </Typography>

                            <Typography fontWeight="bold">
                              {item.count}{" "}
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                ({percentage.toFixed(1)}%)
                              </Typography>
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 2,
                      }}
                    >
                      {row.answered} respuestas
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </ReportCard>
  );
}
