import { useParams } from "react-router-dom";
import { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Button,
  Alert,
} from "@mui/material";

import { usePublicSurvey } from "../../hooks/usePublicSurvey";

import {
  useStartSubmission,
  useSaveAnswers,
  useCompleteSubmission,
} from "../../hooks/usePublicSubmission";

import PublicQuestion from "../../components/public/PublicQuestion";
import { validateQuestion } from "../../utils/validateQuestion";
import type { SurveyQuestion } from "../../types/surveys";
import type { SubmissionAnswerInput } from "../../types/submission";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default function PublicSurvey() {
  const { token } = useParams();

  console.log("Token capturado de la URL:", token);

  const { data: survey, isLoading } = usePublicSurvey(token!);

  const startSubmission = useStartSubmission();
  const saveAnswers = useSaveAnswers();
  const completeSubmission = useCompleteSubmission();

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // =========================================================
  // GUARDAR RESPUESTA
  // =========================================================

  function handleAnswer(questionId: string, value: unknown) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  }

  // =========================================================
  // LÓGICA DE PREGUNTAS CONDICIONALES
  // =========================================================

  const shouldShowQuestion = (question: SurveyQuestion) => {
    // Si no tiene condición, siempre se muestra
    if (!question.showWhenQuestionId) {
      return true;
    }

    // Buscamos la respuesta de la pregunta que controla
    const controllingAnswer = answers[question.showWhenQuestionId];

    // Si todavía no respondió la pregunta controladora
    if (
      controllingAnswer === undefined ||
      controllingAnswer === null ||
      controllingAnswer === ""
    ) {
      return false;
    }

    // =====================================================
    // RADIO / SELECT
    // =====================================================

    if (typeof controllingAnswer === "string") {
      return controllingAnswer === question.showWhenValue;
    }

    // =====================================================
    // CHECKBOX / MULTISELECT
    // =====================================================

    if (Array.isArray(controllingAnswer)) {
      return controllingAnswer.includes(question.showWhenValue);
    }

    return false;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // =========================================================
  // ENCUESTA NO ENCONTRADA
  // =========================================================

  if (!survey) {
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        Encuesta no encontrada.
      </Typography>
    );
  }

  // =========================================================
  // ENVIAR ENCUESTA
  // =========================================================

  async function handleSubmit() {
    if (!token) return;

    try {
      const validationErrors: Record<string, string> = {};

      // =====================================================
      // VALIDAR SOLAMENTE PREGUNTAS VISIBLES
      // =====================================================

      survey.sections.forEach((section) => {
        section.questions
          ?.filter(shouldShowQuestion)
          .forEach((question) => {
            console.log("🔎 VALIDANDO:", {
              pregunta: question.title,
              type: question.type,
              required: question.required,
              respuesta: answers[question.id],
            });

            const error = validateQuestion(question, answers[question.id]);

            if (error) {
              validationErrors[question.id] = error;
            }
          });
      });

      // =====================================================
      // SI HAY ERRORES
      // =====================================================

      if (Object.keys(validationErrors).length > 0) {
        console.log("❌ ERRORES DE VALIDACIÓN:", validationErrors);

        setErrors(validationErrors);

        return;
      }

      console.log("✅ Validación correcta");

      // =====================================================
      // CREAR SUBMISSION
      // =====================================================

      console.log("1 - Iniciando submission");

      const submission = await startSubmission.mutateAsync(token);

      console.log("2 - Submission creada", submission);

      // =====================================================
      // PREPARAR RESPUESTAS
      // =====================================================

      const formattedAnswers: SubmissionAnswerInput[] = Object.entries(answers).map(
        ([questionId, value]) => {
          // =====================================================
          // MATRIX / COMPOSITE
          // =====================================================

          if (
            isRecord(value) &&
            !Array.isArray(value.options)
          ) {
            const question = survey.sections
              .flatMap((section) => section.questions)
              .find((item) => item.id === questionId);

            // ===================================================
            // COMPOSITE
            // ===================================================

            if (question?.type === "COMPOSITE") {
              return {
                questionId,
                composite: Object.entries(value).map(
                  ([fieldId, fieldValue]) => {
                    // Checkbox dentro de Composite
                    if (
                      isRecord(fieldValue) &&
                      Array.isArray(fieldValue.options)
                    ) {
                      return {
                        fieldId,
                        value: JSON.stringify(fieldValue),
                      };
                    }

                    // Multiselect dentro de Composite
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

            // ===================================================
            // MATRIX
            // ===================================================

            return {
              questionId,
              matrix: Object.entries(value).map(([rowId, rowValue]) => ({
                rowId,
                value: String(rowValue ?? ""),
              })),
            };
          }
          // =====================================================
          // CHECKBOX CON "OTRO"
          // =====================================================

          if (
            isRecord(value) &&
            Array.isArray(value.options)
          ) {
            return {
              questionId,
              options: value.options.filter(
                (option): option is string =>
                  typeof option === "string",
              ),
              value:
                typeof value.otherText === "string"
                  ? value.otherText.trim() || undefined
                  : undefined,
            };
          }

          // =====================================================
          // CHECKBOX / MULTISELECT NORMAL
          // =====================================================

          if (Array.isArray(value)) {
            return {
              questionId,
              options: value.filter(
                (option): option is string => typeof option === "string",
              ),
            };
          }

          // =====================================================
          // RESPUESTAS NORMALES
          // =====================================================

          return {
            questionId,
            value: value != null ? String(value) : undefined,
          };
        },
      );

      // =====================================================
      // GUARDAR RESPUESTAS
      // =====================================================

      await saveAnswers.mutateAsync({
        submissionId: submission.id,
        answers: formattedAnswers,
      });

      // =====================================================
      // COMPLETAR SUBMISSION
      // =====================================================

      await completeSubmission.mutateAsync(submission.id);

      setCompleted(true);
    } catch (error) {
      console.error("ERROR:", error);

      alert("Ocurrió un error al enviar la encuesta.");
    }
  }

  // =========================================================
  // ENCUESTA COMPLETADA
  // =========================================================

  if (completed) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f0ebf8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            maxWidth: 650,
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: 10,
              backgroundColor: "#4caf50",
            }}
          />

          <Box
            sx={{
              p: 6,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: 70,
              }}
            >
              🎉
            </Typography>

            <Typography variant="h4" fontWeight="bold" mt={2} gutterBottom>
              ¡Gracias por responder!
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 2,
                fontSize: 18,
              }}
            >
              Tus respuestas fueron enviadas correctamente.
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
              }}
            >
              Agradecemos el tiempo que dedicaste a completar esta encuesta.
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="body2" color="text.secondary">
              Ya puedes cerrar esta ventana.
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  // =========================================================
  // ENCUESTA PÚBLICA
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0ebf8",
        py: 6,
        px: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          maxWidth: 850,
          mx: "auto",
          borderRadius: 3,
          overflow: "hidden",
          p: 4,
        }}
      >
        {/* BARRA SUPERIOR */}

        <Box
          sx={{
            height: 10,
            backgroundColor: "#673ab7",
            mb: 3,
            mx: -4,
            mt: -4,
          }}
        />

        {/* TÍTULO */}

        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {survey.title}
        </Typography>

        {/* DESCRIPCIÓN */}

        <Typography color="text.secondary" mb={2}>
          {survey.description}
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* =====================================================
            SECCIONES
        ===================================================== */}

        {survey.sections?.map((section) => (
          <Box key={section.id} mb={5}>
            {/* TÍTULO DE SECCIÓN */}

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {section.title}
            </Typography>

            {/* DESCRIPCIÓN DE SECCIÓN */}

            <Typography color="text.secondary" mb={3}>
              {section.description}
            </Typography>

            {/* =================================================
                PREGUNTAS
            ================================================= */}

            {section.questions
              ?.filter(shouldShowQuestion)
              .map((question) => (
                <PublicQuestion
                  key={question.id}
                  question={question}
                  value={answers[question.id]}
                  error={errors[question.id]}
                  onChange={(value) => handleAnswer(question.id, value)}
                />
              ))}
          </Box>
        ))}

        {/* =====================================================
            MENSAJE DE ERROR
        ===================================================== */}

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Hay preguntas obligatorias o con errores. Revísalas antes de enviar
            la encuesta.
          </Alert>
        )}

        {/* =====================================================
            BOTÓN ENVIAR
        ===================================================== */}

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={
              startSubmission.isPending ||
              saveAnswers.isPending ||
              completeSubmission.isPending
            }
          >
            {startSubmission.isPending ||
            saveAnswers.isPending ||
            completeSubmission.isPending
              ? "Enviando..."
              : "Enviar respuestas"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
