import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useAssignment } from "../../hooks/useAssigments";
import {
  useCompleteSubmission,
  useCreateSubmission,
  useSaveAnswers,
} from "../../hooks/useSubmissions";

import { toast } from "react-hot-toast";
import SurveyRenderer from "../surveys/SurveyRenderer";
import type { SurveySection } from "../../types/surveys";

interface AssignmentSurvey {
  id: string;
  title: string;
  publicToken: string;
  status: string;
  sections: SurveySection[];
}

interface StoredAnswer {
  questionId: string;
  value: string | null;
  options: {
    questionOptionId: string;
    value: string | null;
  }[];
  matrixAnswers: {
    rowId: string;
    value: string | null;
  }[];
  compositeAnswers: {
    fieldId: string;
    value: string | null;
  }[];
}

interface CompletedSubmission {
  id: string;
  formNumber: number;
  completedAt: string | null;
  answers: StoredAnswer[];
  reviews: {
    id: string;
    status: "CHANGES_REQUESTED" | "UPDATED" | "APPROVED";
    comment: string;
    requestedAt: string;
  }[];
}

interface AssignmentDetailData {
  id: string;
  status: string;
  targetResponses: number;
  completedResponses: number;
  survey: AssignmentSurvey;
  submissions?: CompletedSubmission[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getApiErrorMessage(error: unknown) {
  if (!isRecord(error) || !isRecord(error.response)) {
    return undefined;
  }

  const responseData = error.response.data;
  if (!isRecord(responseData) || typeof responseData.message !== "string") {
    return undefined;
  }

  return responseData.message;
}

function getStoredValue(value: string | null) {
  if (value === null) {
    return "";
  }

  if (!value.startsWith("{") && !value.startsWith("[")) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function getAnswersForEditor(
  submission: CompletedSubmission,
  survey: AssignmentSurvey,
): Record<string, unknown> {
  const questions = survey.sections.flatMap((section) => section.questions);

  return submission.answers.reduce(
    (result: Record<string, unknown>, answer) => {
      const question = questions.find((item) => item.id === answer.questionId);

      if (!question) {
        return result;
      }

      if (question.type === "COMPOSITE") {
        result[question.id] = Object.fromEntries(
          answer.compositeAnswers.map((item) => [
            item.fieldId,
            getStoredValue(item.value),
          ]),
        );
      } else if (question.type === "MATRIX") {
        result[question.id] = Object.fromEntries(
          answer.matrixAnswers.map((item) => [item.rowId, item.value ?? ""]),
        );
      } else if (question.type === "CHECKBOX") {
        result[question.id] = {
          options: answer.options.map((item) => item.questionOptionId),
          otherText:
            answer.options.find((item) =>
              question.options?.some(
                (option) =>
                  option.id === item.questionOptionId && option.isOther,
              ),
            )?.value ?? "",
        };
      } else if (question.type === "MULTISELECT") {
        result[question.id] = answer.options.map((item) => item.questionOptionId);
      } else {
        result[question.id] =
          answer.options[0]?.questionOptionId ?? answer.value ?? "";
      }

      return result;
    },
    {},
  );
}

export default function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const assignmentQuery = useAssignment(id!);
  const data = assignmentQuery.data as AssignmentDetailData | undefined;
  const { isLoading } = assignmentQuery;

  const createSubmission = useCreateSubmission();
  const saveAnswers = useSaveAnswers();
  const completeSubmission = useCompleteSubmission();

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [initializedSubmissionId, setInitializedSubmissionId] = useState("");
  const [submissionId, setSubmissionId] = useState("");

  const [locationError, setLocationError] = useState("");

  const [starting, setStarting] = useState(false);
  const selectedSubmissionId = searchParams.get("submissionId");
  const selectedSubmission = data?.submissions?.find(
    (submission) => submission.id === selectedSubmissionId,
  );
  const activeSubmissionId = selectedSubmission?.id ?? submissionId;
  const locationGranted = Boolean(activeSubmissionId);
  const answersForRender =
    selectedSubmission &&
    initializedSubmissionId !== selectedSubmission.id
      ? getAnswersForEditor(selectedSubmission, data!.survey)
      : answers;

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

  const handleStart = () => {
    setLocationError("");
    setStarting(true);
    setAnswers({});
    setInitializedSubmissionId("");

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
          toast.success("Entrevista iniciada");
        } catch (error: unknown) {
          setLocationError(
            getApiErrorMessage(error) ??
              (error instanceof Error
                ? error.message
                : "No se pudo iniciar la entrevista."),
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
  const handleAnswer = (questionId: string, value: unknown) => {
    setAnswers((prev) => {
      const currentAnswers =
        selectedSubmission &&
        initializedSubmissionId !== selectedSubmission.id &&
        data
          ? getAnswersForEditor(selectedSubmission, data.survey)
          : prev;

      return {
        ...currentAnswers,
        [questionId]: value,
      };
    });
    setInitializedSubmissionId(selectedSubmission?.id ?? "");
  };

  const handleFinish = async () => {
    if (!activeSubmissionId) {
      toast.error("No se pudo identificar la entrevista.");
      return;
    }

    try {
      const payload = {
        answers: Object.entries(answersForRender).map(([questionId, value]) => {
          const question = data.survey.sections
            .flatMap((section) => section.questions)
            .find((item) => item.id === questionId);

          if (question?.type === "COMPOSITE") {
            return {
              questionId,
              composite: Object.entries(isRecord(value) ? value : {}).map(
                ([fieldId, fieldValue]) => ({
                  fieldId,
                  value:
                    fieldValue && typeof fieldValue === "object"
                      ? JSON.stringify(fieldValue)
                      : String(fieldValue ?? ""),
                }),
              ),
            };
          }

          if (question?.type === "MATRIX") {
            return {
              questionId,
              matrix: Object.entries(isRecord(value) ? value : {}).map(
                ([rowId, rowValue]) => ({
                  rowId,
                  value: String(rowValue ?? ""),
                }),
              ),
            };
          }

          if (question?.type === "CHECKBOX") {
            const checkboxValue = isRecord(value) ? value : {};
            return {
              questionId,
              options: Array.isArray(checkboxValue.options)
                ? checkboxValue.options.filter(
                    (option): option is string => typeof option === "string",
                  )
                : [],
              value:
                typeof checkboxValue.otherText === "string"
                  ? checkboxValue.otherText
                  : "",
            };
          }

          if (question?.type === "MULTISELECT") {
            return {
              questionId,
              options: Array.isArray(value) ? value : [],
            };
          }

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

      await saveAnswers.mutateAsync({
        submissionId: activeSubmissionId,
        ...payload,
      });

      await completeSubmission.mutateAsync(activeSubmissionId);

      toast.success(
        selectedSubmission
          ? "Cambios guardados correctamente"
          : "Encuesta enviada correctamente",
      );

      setTimeout(() => {
        navigate(
          selectedSubmission
            ? `/interviewer/assignments/${id}`
            : "/interviewer",
        );
      }, 1000);
    } catch (error: unknown) {
      console.error(error);

      toast.error(
        getApiErrorMessage(error) ??
          (error instanceof Error ? error.message : "Ocurrió un error"),
      );
    }
  };

  if (!locationGranted) {
    return (
      <Stack spacing={3} sx={{ maxWidth: 850, mx: "auto", py: 4, px: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {data.survey.title}
          </Typography>
          <Typography color="text.secondary">
            {data.completedResponses} de {data.targetResponses} entrevistas
            realizadas
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight="bold">
                Entrevistas completadas
              </Typography>
              {data.submissions?.length ? (
                data.submissions.map((submission) => (
                  <Paper
                    key={submission.id}
                    variant="outlined"
                    sx={{ p: 2, display: "flex", justifyContent: "space-between", gap: 2 }}
                  >
                    <Box>
                      <Typography fontWeight="medium">
                        Formulario N.º {submission.formNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {submission.completedAt
                          ? new Date(submission.completedAt).toLocaleString(
                              "es-AR",
                            )
                          : "Fecha no disponible"}
                      </Typography>
                      {submission.reviews[0] && (
                        <Stack spacing={0.5} mt={1}>
                          <Chip
                            size="small"
                            color={
                              submission.reviews[0].status ===
                              "CHANGES_REQUESTED"
                                ? "warning"
                                : submission.reviews[0].status === "UPDATED"
                                  ? "info"
                                  : "success"
                            }
                            label={
                              submission.reviews[0].status ===
                              "CHANGES_REQUESTED"
                                ? "Corrección solicitada"
                                : submission.reviews[0].status === "UPDATED"
                                  ? "Modificada · pendiente de revisión"
                                  : "Aprobada"
                            }
                          />
                          {submission.reviews[0].status ===
                            "CHANGES_REQUESTED" && (
                            <Alert severity="warning" sx={{ py: 0 }}>
                              {submission.reviews[0].comment}
                            </Alert>
                          )}
                        </Stack>
                      )}
                    </Box>
                    <Button
                      startIcon={<EditOutlinedIcon />}
                      onClick={() =>
                        setSearchParams({ submissionId: submission.id })
                      }
                    >
                      Editar respuestas
                    </Button>
                  </Paper>
                ))
              ) : (
                <Typography color="text.secondary">
                  Todavía no hay entrevistas completadas para esta asignación.
                </Typography>
              )}
              {data.status !== "COMPLETED" && (
                <Button
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
                  sx={{ alignSelf: "flex-start", borderRadius: 3, py: 1.3 }}
                >
                  {starting
                    ? "Obteniendo ubicación..."
                    : "Iniciar nueva entrevista"}
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {locationError && (
          <Alert severity="warning">
            {locationError}
          </Alert>
        )}

        {!selectedSubmissionId && data.status !== "COMPLETED" && (
          <Paper
          sx={{
            p: 2,
          }}
        >
            Para iniciar una entrevista nueva se solicitará tu ubicación.
          </Paper>
        )}
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {selectedSubmissionId && (
        <Button
          onClick={() => {
            setSearchParams({});
            setSubmissionId("");
            setInitializedSubmissionId("");
            setAnswers({});
          }}
          sx={{ alignSelf: "flex-start", mt: 2, ml: 2 }}
        >
          Volver a las entrevistas
        </Button>
      )}
      <SurveyRenderer
        survey={data.survey}
        answers={answersForRender}
        onAnswer={handleAnswer}
        onFinish={handleFinish}
        loading={
          createSubmission.isPending ||
          saveAnswers.isPending ||
          completeSubmission.isPending
        }
      />
    </Stack>
  );
}
