import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { CompositeQuestionSummary } from "../../../types/report";

interface Props {
  question: CompositeQuestionSummary;
}

interface CompositeChoiceValue {
  value: string;
  count: number;
  percentage?: number;
}

function isCompositeChoiceValue(
  value: unknown,
): value is CompositeChoiceValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "value" in value &&
    typeof value.value === "string" &&
    "count" in value &&
    typeof value.count === "number"
  );
}

export default function CompositeSummary({ question }: Props) {
  if (question.isRepeatable) {
    return (
      <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            {question.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {question.answered} entrevista
            {question.answered !== 1 ? "s" : ""} con integrantes registrados
          </Typography>

          <Stack spacing={3}>
            {(question.responses ?? []).map((response, responseIndex) => (
              <Box key={`${response.interviewNumber}-${responseIndex}`}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  Entrevista N.º {response.interviewNumber ?? "sin número"}
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        {question.repeatableFields?.map((field) => (
                          <TableCell key={field.id}>{field.label}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {response.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          <TableCell>{rowIndex + 1}</TableCell>
                          {question.repeatableFields?.map((field) => (
                            <TableCell key={field.id}>
                              {row[field.id] ?? ""}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
            {!question.responses?.length && (
              <Typography color="text.secondary">
                Todavía no hay integrantes registrados.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

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
          {question.answers.map((field) => {
            const values = field.values;

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
                          {Array.from(
                            new Set(
                              values.filter(
                                (value): value is number =>
                                  typeof value === "number",
                              ),
                            ),
                          )
                            .sort((a, b) => a - b)
                            .map((value) => {
                              const count = values.filter(
                                (item) => item === value,
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
                    {values.some(isCompositeChoiceValue) ? (
                      values.filter(isCompositeChoiceValue).map((item) => {
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
                    {values.some(
                      (value): value is string => typeof value === "string",
                    ) ? (
                      values
                        .filter(
                          (value): value is string =>
                            typeof value === "string",
                        )
                        .map((value, index) => (
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
                    {values.some(
                      (value): value is string => typeof value === "string",
                    ) ? (
                      values
                        .filter(
                          (value): value is string =>
                            typeof value === "string",
                        )
                        .map((value, index) => (
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
