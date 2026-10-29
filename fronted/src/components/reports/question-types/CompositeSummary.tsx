import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import type { QuestionSummary } from "../../../types/report";

interface Props {
  question: QuestionSummary;
}

export default function CompositeSummary({ question }: Props) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* TÍTULO */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.15rem",
              },
            }}
          >
            {question.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {question.answered} respuesta
            {question.answered !== 1 ? "s" : ""}
          </Typography>
        </Box>

        <Stack spacing={3}>
          {(question.answers ?? []).map((field: any) => {
            const values = field.values ?? [];

            return (
              <Box key={field.id}>
                {/* NOMBRE DEL CAMPO */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                      wordBreak: "break-word",
                    }}
                  >
                    {field.label}
                  </Typography>

                  <Chip
                    label={`${field.answered ?? 0} respuesta${
                      field.answered !== 1 ? "s" : ""
                    }`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      flexShrink: 0,
                    }}
                  />
                </Stack>

                {/* ============================
                    NUMBER
                ============================ */}

                {field.type === "NUMBER" && (
                  <Stack spacing={2}>
                    {/* ESTADÍSTICAS GENERALES */}
                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      spacing={2}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          p: 2,
                          bgcolor: "primary.50",
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Promedio
                        </Typography>

                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="primary.main"
                        >
                          {field.average !== undefined
                            ? Number(field.average).toFixed(1)
                            : "-"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          p: 2,
                          bgcolor: "grey.100",
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Mínimo
                        </Typography>

                        <Typography variant="h5" fontWeight="bold">
                          {field.min ?? "-"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          p: 2,
                          bgcolor: "grey.100",
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Máximo
                        </Typography>

                        <Typography variant="h5" fontWeight="bold">
                          {field.max ?? "-"}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* VALORES INGRESADOS */}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{ mb: 1.5 }}
                      >
                        Valores ingresados
                      </Typography>

                      <Box
                        sx={{
                          maxHeight: 300,
                          overflowY: "auto",
                          pr: 1,
                        }}
                      >
                        <Stack spacing={1}>
                          {Array.from(new Set<number>(field.values ?? []))
                            .sort((a, b) => a - b)
                            .map((value) => {
                              const count = (field.values ?? []).filter(
                                (item: number) => item === value,
                              ).length;

                              return (
                                <Stack
                                  key={value}
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  sx={{
                                    px: 2,
                                    py: 1,
                                    bgcolor: "grey.100",
                                    borderRadius: 2,
                                  }}
                                >
                                  <Typography variant="body2">
                                    {value}
                                  </Typography>

                                  <Chip
                                    label={`${count} persona${
                                      count !== 1 ? "s" : ""
                                    }`}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Stack>
                              );
                            })}
                        </Stack>
                      </Box>
                    </Box>
                  </Stack>
                )}

                {/* ============================
                    OPCIONES
                ============================ */}

                {(field.type === "SELECT" ||
                  field.type === "RADIO" ||
                  field.type === "SCALE" ||
                  field.type === "CHECKBOX" ||
                  field.type === "MULTISELECT") && (
                  <Stack spacing={1.5}>
                    {values.length > 0 ? (
                      values.map((item: any) => {
                        const percentage = (item.percentage ?? 0) * 100;

                        return (
                          <Box key={item.value}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              spacing={2}
                              sx={{ mb: 0.5 }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  wordBreak: "break-word",
                                }}
                              >
                                {item.value}
                              </Typography>

                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="text.secondary"
                              >
                                {item.count} ({percentage.toFixed(0)}%)
                              </Typography>
                            </Stack>

                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                height: 7,
                                borderRadius: 10,
                              }}
                            />
                          </Box>
                        );
                      })
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin respuestas.
                      </Typography>
                    )}
                  </Stack>
                )}

                {/* ============================
                    TEXTO
                ============================ */}

                {[
                  "SHORT_TEXT",
                  "LONG_TEXT",
                  "EMAIL",
                  "PHONE",
                  "TIME",
                  "DATETIME",
                ].includes(field.type) && (
                  <Stack spacing={1}>
                    {values.length > 0 ? (
                      values.map((value: string, index: number) => (
                        <Box
                          key={`${value}-${index}`}
                          sx={{
                            p: 2,
                            bgcolor: "grey.100",
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {value}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin respuestas.
                      </Typography>
                    )}
                  </Stack>
                )}

                {/* ============================
                    FECHA
                ============================ */}

                {field.type === "DATE" && (
                  <Stack spacing={1}>
                    {values.length > 0 ? (
                      values.map((value: string, index: number) => (
                        <Box
                          key={`${value}-${index}`}
                          sx={{
                            p: 1.5,
                            bgcolor: "grey.100",
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body2">{value}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin respuestas.
                      </Typography>
                    )}
                  </Stack>
                )}

                <Divider sx={{ mt: 3 }} />
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
