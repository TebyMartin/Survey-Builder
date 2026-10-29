import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import TableViewIcon from "@mui/icons-material/TableView";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TodayIcon from "@mui/icons-material/Today";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";

import Grid from "@mui/material/Grid";

import { useReportDashboard } from "../../hooks/useReportDashboard";

import ResponsesChart from "../../components/reports/ResponsesChart";
import KpiCard from "../../components/reports/KpiCard";
import QuestionReportCard from "../../components/reports/QuestionReportCard";
import LocationMap from "../../components/reports/LocationMap";

import type { QuestionSummary } from "../../types/report";

import { generateReportPdf } from "../../utils/pdf/generateReportPdf";
import { generateReportExcel } from "../../utils/reports/generateReportExcel";
import { downloadSubmissionCsv } from "../../service/reports.service";
import { toast } from "react-hot-toast";

export default function ReportDashboard() {
  const { surveyId } = useParams();

  const { data, isLoading } = useReportDashboard(surveyId!);
  const [exportingCsv, setExportingCsv] = useState(false);

  const handleCsvExport = async () => {
    if (!surveyId) {
      return;
    }

    setExportingCsv(true);
    try {
      await downloadSubmissionCsv(surveyId);
      toast.success("CSV de entrevistas descargado");
    } catch (error: unknown) {
      console.error("No se pudo exportar el CSV:", error);
      toast.error(
        error instanceof Error ? error.message : "No se pudo exportar el CSV.",
      );
    } finally {
      setExportingCsv(false);
    }
  };

  const formatAverageTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No se encontraron datos.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1600,
        mx: "auto",
        px: {
          xs: 1.5,
          sm: 2.5,
          md: 4,
        },
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          borderRadius: {
            xs: 3,
            md: 4,
          },
          p: {
            xs: 2.5,
            sm: 3.5,
            md: 5,
          },
          mb: {
            xs: 3,
            md: 5,
          },
          boxShadow: 4,
        }}
      >
        <Stack
          spacing={{
            xs: 2.5,
            md: 3,
          }}
          alignItems="center"
          textAlign="center"
        >
          {/* TÍTULO */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: {
                xs: 1,
                sm: 1.5,
              },
              width: "100%",
            }}
          >
            <DescriptionIcon
              sx={{
                fontSize: {
                  xs: 32,
                  sm: 38,
                  md: 42,
                },
                flexShrink: 0,
              }}
            />

            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "1.4rem",
                  sm: "1.8rem",
                  md: "2.4rem",
                },
                lineHeight: 1.2,
                overflowWrap: "anywhere",
              }}
            >
              {data.survey.title}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.85,
              maxWidth: 700,
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
            }}
          >
            Reporte general de la encuesta
          </Typography>

          {/* BOTONES */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
            justifyContent="center"
            alignItems="stretch"
            width="100%"
            maxWidth={720}
          >
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<PictureAsPdfIcon />}
              onClick={() => generateReportPdf(data)}
              sx={{
                borderRadius: 3,
                py: {
                  xs: 1.3,
                  sm: 1.4,
                },
                fontWeight: 600,
                boxShadow: 3,
              }}
            >
              Exportar PDF
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<TableViewIcon />}
              onClick={() => generateReportExcel(data)}
              sx={{
                borderRadius: 3,
                py: {
                  xs: 1.3,
                  sm: 1.4,
                },
                color: "white",
                borderColor: "rgba(255,255,255,.5)",

                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,.08)",
                },
              }}
            >
              Exportar Excel
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={
                exportingCsv ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <DownloadIcon />
                )
              }
              onClick={handleCsvExport}
              disabled={exportingCsv}
              sx={{
                borderRadius: 3,
                py: {
                  xs: 1.3,
                  sm: 1.4,
                },
                color: "white",
                borderColor: "rgba(255,255,255,.5)",

                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,.08)",
                },
              }}
            >
              CSV para QGIS
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <Stack
        spacing={{
          xs: 3,
          md: 5,
        }}
      >
        {/* =====================================================
            KPIs
        ===================================================== */}

        <Grid container spacing={{ xs: 1.5, sm: 2.5, md: 3 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <KpiCard
              title="Respuestas"
              value={data.stats.totalResponses}
              icon={<PeopleIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <KpiCard
              title="Completadas"
              value={data.stats.completed}
              icon={<AssignmentTurnedInIcon />}
              color="success.main"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <KpiCard
              title="Tiempo promedio"
              value={formatAverageTime(data.stats.averageTime)}
              icon={<ScheduleIcon />}
              color="warning.main"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <KpiCard
              title="Última respuesta"
              value={data.stats.lastResponse ?? "-"}
              icon={<TodayIcon />}
              color="secondary.main"
            />
          </Grid>
        </Grid>

        {/* =====================================================
            GRÁFICO
        ===================================================== */}

        <Box sx={{ width: "100%", minWidth: 0 }}>
          <ResponsesChart data={data.responsesPerDay} />
        </Box>

        {/* =====================================================
            MAPA
        ===================================================== */}

        <Box sx={{ width: "100%", minWidth: 0 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={{
              xs: 1.5,
              md: 2,
            }}
            sx={{
              fontSize: {
                xs: "1.2rem",
                sm: "1.4rem",
                md: "1.5rem",
              },
            }}
          >
            Ubicación de las entrevistas
          </Typography>

          <Box
            sx={{
              width: "100%",
              overflow: "hidden",
              borderRadius: 3,
            }}
          >
            <LocationMap locations={data.locations} />
          </Box>
        </Box>

        {/* =====================================================
            PREGUNTAS
        ===================================================== */}

        <Box
          sx={{
            width: "100%",
            minWidth: 0,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
            sx={{
              fontSize: {
                xs: "1.2rem",
                sm: "1.4rem",
                md: "1.5rem",
              },
            }}
          >
            Resumen de respuestas
          </Typography>

          <Stack spacing={{ xs: 2, md: 3 }}>
            {data.questionSummaries
              .filter((question: QuestionSummary) => {
                if (
                  question.type === "COMPOSITE" &&
                  question.isRepeatable
                ) {
                  return (question.responses?.length ?? 0) > 0;
                }

                return question.answers.length > 0;
              })
              .map((question: QuestionSummary) => (
                <QuestionReportCard key={question.id} question={question} />
              ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
