import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useAssignment } from "../../hooks/useAssigments";
import {
  useCompleteSubmission,
  useCreateSubmission,
  useSaveAnswers,
} from "../../hooks/useSubmissions";

import { toast } from "react-hot-toast";
import SurveyRenderer from "../surveys/SurveyRenderer";

export default function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useAssignment(id!);

  const createSubmission = useCreateSubmission();
  const saveAnswers = useSaveAnswers();
  const completeSubmission = useCompleteSubmission();

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submissionId, setSubmissionId] = useState("");

  const [locationGranted, setLocationGranted] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [starting, setStarting] = useState(false);

  /*
   * Verificamos si ya tenemos la asignación.
   */
  useEffect(() => {
    if (!data) return;

    setLocationError("");
  }, [data]);

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
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No se encontró la asignación.</Typography>
      </Box>
    );
  }

  /*
   * Obtiene la ubicación del navegador y crea la Submission.
   */
  const handleStart = () => {
    setLocationError("");
    setStarting(true);

    if (!navigator.geolocation) {
      setLocationError("Tu navegador no permite obtener la ubicación.");
      setStarting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const submission = await createSubmission.mutateAsync({
            surveyId: data.survey.id,
            assignmentId: data.id,
            latitude,
            longitude,
          });

          setSubmissionId(submission.id);
          setLocationGranted(true);

          toast.success("Entrevista iniciada");
        } catch (error: any) {
          setLocationError(
            error?.response?.data?.message ??
              "No se pudo iniciar la entrevista.",
          );
        } finally {
          setStarting(false);
        }
      },

      (error) => {
        console.error("🔴 ERROR GEOLOCALIZACIÓN:", error);

        console.log("Código:", error.code);
        console.log("Mensaje:", error.message);

        let message = "No pudimos obtener tu ubicación.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "Necesitamos permiso para acceder a tu ubicación para iniciar la entrevista.";
            break;

          case error.POSITION_UNAVAILABLE:
            message =
              "No fue posible determinar tu ubicación. Verificá que la ubicación esté activada.";
            break;

          case error.TIMEOUT:
            message =
              "La ubicación está tardando demasiado. Intentá nuevamente.";
            break;
        }

        setLocationError(message);
        setStarting(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 60000,
      },
    );
  };
  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleFinish = async () => {
    if (!submissionId) {
      toast.error("No se pudo identificar la entrevista.");
      return;
    }

    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, value]) => {
          // MATRIZ
          if (value && typeof value === "object" && !Array.isArray(value)) {
            const question = data.survey.sections
              .flatMap((section: any) => section.questions)
              .find((q: any) => q.id === questionId);

            // COMPOSITE
            if (question?.type === "COMPOSITE") {
              return {
                questionId,
                composite: Object.entries(value).map(
                  ([fieldId, fieldValue]) => {
                    // Checkbox dentro de un Composite
                    if (
                      fieldValue &&
                      typeof fieldValue === "object" &&
                      !Array.isArray(fieldValue) &&
                      "options" in fieldValue
                    ) {
                      return {
                        fieldId,
                        value: JSON.stringify(fieldValue),
                      };
                    }

                    // Multiselect dentro de un Composite
                    if (Array.isArray(fieldValue)) {
                      return {
                        fieldId,
                        value: JSON.stringify(fieldValue),
                      };
                    }

                    // Campos simples
                    return {
                      fieldId,
                      value: String(fieldValue ?? ""),
                    };
                  },
                ),
              };
            }

            // MATRIX
            return {
              questionId,
              matrix: Object.entries(value).map(([rowId, rowValue]) => ({
                rowId,
                value: String(rowValue ?? ""),
              })),
            };
          }

          // CHECKBOX / MULTISELECT
          if (Array.isArray(value)) {
            return {
              questionId,
              options: value,
            };
          }

          // TEXTO / NUMBER / ETC.
          return {
            questionId,
            value: value?.toString() ?? "",
          };
        }),
      };
      console.log("🚨 PAYLOAD FINAL:", JSON.stringify(payload, null, 2));

      await saveAnswers.mutateAsync({
        submissionId,
        ...payload,
      });

      await completeSubmission.mutateAsync(submissionId);

      toast.success("Encuesta enviada correctamente");

      setTimeout(() => {
        navigate("/interviewer");
      }, 1000);
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message ?? "Ocurrió un error");
    }
  };

  /*
   * Antes de comenzar la entrevista.
   */
  if (!locationGranted) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 4,
            p: {
              xs: 3,
              sm: 5,
            },
            textAlign: "center",
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.50",
                color: "primary.main",
              }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 40 }} />
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Iniciar entrevista
              </Typography>

              <Typography color="text.secondary">
                Para registrar correctamente esta entrevista necesitamos acceder
                a tu ubicación.
              </Typography>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                {data.survey.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Tu ubicación se asociará únicamente a esta entrevista.
              </Typography>
            </Box>

            {locationError && (
              <Alert
                severity="warning"
                sx={{
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {locationError}
              </Alert>
            )}

            <Button
              fullWidth
              size="large"
              variant="contained"
              startIcon={
                starting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <LocationOnOutlinedIcon />
                )
              }
              endIcon={!starting ? <ArrowForwardIcon /> : undefined}
              onClick={handleStart}
              disabled={starting}
              sx={{
                borderRadius: 3,
                py: 1.5,
              }}
            >
              {starting
                ? "Obteniendo ubicación..."
                : "Permitir ubicación y comenzar"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  /*
   * Una vez creada la Submission mostramos la encuesta.
   */
  return (
    <SurveyRenderer
      survey={data.survey}
      answers={answers}
      onAnswer={handleAnswer}
      onFinish={handleFinish}
      loading={
        createSubmission.isPending ||
        saveAnswers.isPending ||
        completeSubmission.isPending
      }
    />
  );
}
