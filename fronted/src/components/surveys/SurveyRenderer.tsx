import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import QuestionRenderer from "../interviewer/QuestionRenderer";
import type { Survey } from "../../types/surveys";

interface Props {
  survey: Survey;
  answers: Record<string, unknown>;
  onAnswer: (questionId: string, value: unknown) => void;
  onFinish?: () => void;
  loading?: boolean;
}

export default function SurveyRenderer({
  survey,
  answers,
  onAnswer,
  onFinish,
  loading,
}: Props) {
  const shouldShowQuestion = (question: Survey["sections"][number]["questions"][number]) => {
    if (!question.showWhenQuestionId) {
      return true;
    }

    const controllingAnswer = answers[question.showWhenQuestionId];

    if (
      controllingAnswer === undefined ||
      controllingAnswer === null ||
      controllingAnswer === ""
    ) {
      return false;
    }

    // RADIO / SELECT
    if (typeof controllingAnswer === "string") {
      return controllingAnswer === question.showWhenValue;
    }

    // CHECKBOX / MULTISELECT
    if (Array.isArray(controllingAnswer)) {
      return controllingAnswer.includes(question.showWhenValue);
    }

    return false;
  };

  return (
    <Box
      sx={{
        maxWidth: 950,
        mx: "auto",
        py: 4,
        px: 2,
        bgcolor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <Card
        elevation={3}
        sx={{
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* CABECERA DE LA ENCUESTA */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 5,
              borderRadius: 3,
              mb: 4,
            }}
          >
            {/* TÍTULO */}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                mb: survey.description ? 1 : 0,
              }}
            >
              {survey.title}
            </Typography>

            {/* DESCRIPCIÓN */}
            {survey.description && (
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  lineHeight: 1.6,
                }}
              >
                {survey.description}
              </Typography>
            )}
          </Box>

          {/* SECCIONES DE LA ENCUESTA */}
          <Stack spacing={4}>
            {survey.sections?.map((section) => (
              <Card
                key={section.id}
                elevation={2}
                sx={{
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* TÍTULO DE LA SECCIÓN */}
                  <Typography variant="h5" fontWeight="bold" mb={3}>
                    {section.title}
                  </Typography>

                  {/* PREGUNTAS */}
                  <Stack spacing={4}>
                    {section.questions
                      ?.filter(shouldShowQuestion)
                      .map((question) => (
                        <QuestionRenderer
                          key={question.id}
                          question={question}
                          value={answers[question.id]}
                          onChange={onAnswer}
                        />
                      ))}
                  </Stack>

                  <Divider sx={{ mt: 5 }} />
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* BOTÓN FINALIZAR */}
          {onFinish && (
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 4 }}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={() => {
                  console.log("🔥 CLICK EN FINALIZAR");
                  onFinish();
                }}
                disabled={loading}
                sx={{
                  py: 1.8,
                  fontSize: 18,
                  fontWeight: "bold",
                  borderRadius: 3,
                }}
              >
                {loading ? "Finalizando..." : "Finalizar encuesta"}
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
