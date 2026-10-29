import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  TextField,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

import { Grid } from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSurveys } from "../../hooks/useSurvey";

import InputAdornment from "@mui/material/InputAdornment";

export default function Reports() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const { data: surveys = [], isLoading } = useSurveys();

  if (isLoading) {
    return (
      <Box
        sx={{
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  const filteredReports = surveys.filter((survey: any) => {
    const text = search.toLowerCase();

    return (
      survey.title.toLowerCase().includes(text) ||
      (survey.description ?? "").toLowerCase().includes(text)
    );
  });

  const hasSurveys = surveys.length > 0;
  const hasResults = filteredReports.length > 0;

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          ENCABEZADO
      ====================================================== */}

      <Box
        mb={7}
        display="flex"
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        flexDirection={{
          xs: "column",
          md: "row",
        }}
        gap={3}
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "2.4rem",
                md: "3rem",
              },
            }}
          >
            📊 Reportes
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Visualizá, analizá y exportá los resultados de tus encuestas.
          </Typography>
        </Box>

        <TextField
          placeholder="Buscar reporte..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: {
              xs: "100%",
              md: 350,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* =====================================================
          SIN ENCUESTAS
      ====================================================== */}

      {!hasSurveys && (
        <Box
          sx={{
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",

            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",

            bgcolor: "background.paper",

            px: {
              xs: 3,
              sm: 6,
            },

            py: 7,

            boxShadow: 1,
          }}
        >
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "50%",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              bgcolor: "action.hover",

              mb: 3,
            }}
          >
            <AssessmentOutlinedIcon
              sx={{
                fontSize: 48,
                color: "text.disabled",
              }}
            />
          </Box>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            No hay reportes disponibles
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 550,
              lineHeight: 1.7,
            }}
          >
            Todavía no tenés ninguna encuesta creada en tu organización. Cuando
            crees una encuesta y comience a recibir respuestas, vas a poder
            consultar sus reportes acá.
          </Typography>
        </Box>
      )}

      {/* =====================================================
          SIN RESULTADOS DE BÚSQUEDA
      ====================================================== */}

      {hasSurveys && !hasResults && (
        <Box
          sx={{
            minHeight: 350,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",

            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",

            bgcolor: "background.paper",

            px: 3,
            py: 6,
          }}
        >
          <SearchIcon
            sx={{
              fontSize: 64,
              color: "text.disabled",
              mb: 2,
            }}
          />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            No encontramos resultados
          </Typography>

          <Typography color="text.secondary">
            No hay encuestas que coincidan con "{search}".
          </Typography>

          <Button
            variant="outlined"
            sx={{
              mt: 3,
              borderRadius: 3,
            }}
            onClick={() => setSearch("")}
          >
            Limpiar búsqueda
          </Button>
        </Box>
      )}

      {/* =====================================================
          LISTADO DE REPORTES
      ====================================================== */}

      {hasResults && (
        <Grid
          container
          spacing={3}
          sx={{
            mt: 2,
          }}
        >
          {filteredReports.map((survey: any) => (
            <Grid
              key={survey.id}
              size={{
                xs: 12,
                md: 6,
                lg: 4,
              }}
            >
              <Card
                sx={{
                  minHeight: 300,
                  borderRadius: 4,
                  overflow: "hidden",

                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",

                  transition: ".25s",

                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 8,
                  },
                }}
              >
                {/* Barra superior */}

                <Box
                  sx={{
                    height: 8,
                    bgcolor: "primary.main",
                  }}
                />

                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack
                    spacing={2}
                    sx={{
                      flex: 1,
                    }}
                  >
                    {/* Título */}

                    <Stack direction="row" spacing={1} alignItems="center">
                      <DescriptionIcon color="primary" />

                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                        }}
                      >
                        {survey.title}
                      </Typography>
                    </Stack>

                    {/* Descripción */}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.5,

                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",

                        minHeight: "4.5em",
                      }}
                    >
                      {survey.description || "Sin descripción"}
                    </Typography>

                    {/* Información */}

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip color="success" size="small" label="Publicada" />

                      <Chip size="small" icon={<BarChartIcon />} label="0" />

                      <Chip
                        size="small"
                        icon={<CalendarMonthIcon />}
                        label="Jul 2026"
                      />
                    </Stack>
                  </Stack>

                  {/* Botón */}

                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 3,
                      borderRadius: 2,
                    }}
                    onClick={() => navigate(`/dashboard/reports/${survey.id}`)}
                  >
                    Ver reporte
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
