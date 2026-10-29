import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";
import {
  useApproveSubmissionReview,
  useRequestSubmissionReview,
  useSubmissionsForReview,
} from "../hooks/useSubmissionReviews";
import type {
  ReviewAnswer,
  SubmissionForReview,
} from "../types/submissionReview";

function getAnswerLines(answer: ReviewAnswer): string[] {
  const lines: string[] = [];

  if (answer.options.length) {
    for (const selected of answer.options) {
      const option = selected.questionOption;
      lines.push(
        option?.isOther
          ? `Otro: ${selected.value ?? ""}`
          : option?.label ?? selected.value ?? "",
      );
    }
  } else if (answer.value) {
    const option = answer.question.options.find(
      (item) => item.id === answer.value,
    );
    lines.push(option?.label ?? answer.value);
  }

  for (const matrixAnswer of answer.matrixAnswers) {
    lines.push(`${matrixAnswer.row.label}: ${matrixAnswer.value ?? ""}`);
  }

  for (const compositeAnswer of answer.compositeAnswers) {
    lines.push(`${compositeAnswer.field.label}: ${compositeAnswer.value ?? ""}`);
  }

  return lines.length ? lines : ["Sin respuesta"];
}

function getReviewStatus(submission: SubmissionForReview) {
  const latestReview = submission.reviews[0];
  if (!latestReview) {
    return { label: "Sin revisar", color: "default" as const };
  }

  if (latestReview.status === "CHANGES_REQUESTED") {
    return { label: "Corrección solicitada", color: "warning" as const };
  }
  if (latestReview.status === "UPDATED") {
    return { label: "Modificada · revisar", color: "info" as const };
  }
  return { label: "Aprobada", color: "success" as const };
}

export default function SubmissionReviews() {
  const { data: submissions = [], isLoading, isError } = useSubmissionsForReview();
  const requestReview = useRequestSubmissionReview();
  const approveReview = useApproveSubmissionReview();
  const [selected, setSelected] = useState<SubmissionForReview | null>(null);
  const [comment, setComment] = useState("");

  const handleRequestChanges = async () => {
    if (!selected || !comment.trim()) {
      toast.error("Escribí qué debe corregirse.");
      return;
    }

    try {
      await requestReview.mutateAsync({
        submissionId: selected.id,
        comment: comment.trim(),
      });
      setComment("");
      toast.success("Se solicitó la corrección al encuestador.");
    } catch (error) {
      console.error("No se pudo solicitar la corrección:", error);
      toast.error("No se pudo solicitar la corrección.");
    }
  };

  const handleApprove = async () => {
    const review = selected?.reviews[0];
    if (!review || review.status !== "UPDATED") return;

    try {
      await approveReview.mutateAsync(review.id);
      toast.success("Entrevista aprobada.");
    } catch (error) {
      console.error("No se pudo aprobar la entrevista:", error);
      toast.error("No se pudo aprobar la entrevista.");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">No se pudieron cargar las entrevistas.</Alert>;
  }

  const currentSubmission =
    submissions.find((item) => item.id === selected?.id) ?? selected;
  const currentReview = currentSubmission?.reviews[0];
  const isPendingCorrection =
    currentReview?.status === "CHANGES_REQUESTED";

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Revisión de entrevistas
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Revisá las respuestas completadas y pedí correcciones cuando sea
        necesario.
      </Typography>

      {submissions.length ? (
        <Stack spacing={2}>
          {submissions.map((submission) => {
            const reviewStatus = getReviewStatus(submission);
            return (
              <Card key={submission.id} variant="outlined">
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h6">
                        {submission.survey.title} · Formulario N.º{" "}
                        {submission.formNumber}
                      </Typography>
                      <Typography color="text.secondary">
                        Encuestador/a:{" "}
                        {submission.interviewer
                          ? `${submission.interviewer.firstName} ${submission.interviewer.lastName}`
                          : "No identificado"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {submission.completedAt
                          ? new Date(submission.completedAt).toLocaleString(
                              "es-AR",
                            )
                          : "Fecha no disponible"}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={reviewStatus.label}
                        color={reviewStatus.color}
                        size="small"
                      />
                      <Button
                        variant="contained"
                        onClick={() => {
                          setSelected(submission);
                          setComment("");
                        }}
                      >
                        Ver respuestas
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      ) : (
        <Alert severity="info">
          Todavía no hay entrevistas completadas para revisar.
        </Alert>
      )}

      <Dialog
        open={Boolean(currentSubmission)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="md"
      >
        {currentSubmission && (
          <>
            <DialogTitle>
              {currentSubmission.survey.title} · Formulario N.º{" "}
              {currentSubmission.formNumber}
            </DialogTitle>
            <DialogContent dividers>
              <Typography color="text.secondary" mb={2}>
                Encuestador/a:{" "}
                {currentSubmission.interviewer
                  ? `${currentSubmission.interviewer.firstName} ${currentSubmission.interviewer.lastName}`
                  : "No identificado"}
                {" · "}
                {currentSubmission.completedAt
                  ? new Date(currentSubmission.completedAt).toLocaleString(
                      "es-AR",
                    )
                  : "Fecha no disponible"}
              </Typography>

              <Stack spacing={2}>
                {currentSubmission.answers.map((answer) => (
                  <Box key={answer.id}>
                    <Typography fontWeight="bold">
                      {answer.question.title}
                    </Typography>
                    {getAnswerLines(answer).map((line, index) => (
                      <Typography key={`${answer.id}-${index}`}>
                        {line}
                      </Typography>
                    ))}
                    <Divider sx={{ mt: 1.5 }} />
                  </Box>
                ))}
              </Stack>

              <Typography variant="h6" mt={3} mb={1}>
                Seguimiento
              </Typography>
              {currentSubmission.reviews.map((review) => (
                <Alert
                  key={review.id}
                  severity={
                    review.status === "CHANGES_REQUESTED"
                      ? "warning"
                      : review.status === "UPDATED"
                        ? "info"
                        : "success"
                  }
                  sx={{ mb: 1 }}
                >
                  <strong>
                    {review.status === "CHANGES_REQUESTED"
                      ? "Corrección solicitada"
                      : review.status === "UPDATED"
                        ? "Encuestador/a modificó la entrevista"
                        : "Entrevista aprobada"}
                  </strong>
                  {": "}
                  {review.comment}
                </Alert>
              ))}

              {!isPendingCorrection && (
                <Stack spacing={1} mt={2}>
                  <TextField
                    label="Observación para el encuestador/a"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                    inputProps={{ maxLength: 2000 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleRequestChanges}
                    disabled={requestReview.isPending || !comment.trim()}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    {requestReview.isPending
                      ? "Enviando..."
                      : "Solicitar modificación"}
                  </Button>
                </Stack>
              )}
            </DialogContent>
            <DialogActions>
              {currentReview?.status === "UPDATED" && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  disabled={approveReview.isPending}
                >
                  {approveReview.isPending ? "Aprobando..." : "Aprobar entrevista"}
                </Button>
              )}
              <Button onClick={() => setSelected(null)}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
