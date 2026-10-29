import { useState, useMemo } from "react";
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
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SendIcon from "@mui/icons-material/Send";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import HistoryIcon from "@mui/icons-material/History";
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
    const option = answer.question.options?.find(
      (item) => item.id === answer.value || (item as any).value === answer.value,
    );
    lines.push(option?.label ?? answer.value);
  }

  for (const matrixAnswer of answer.matrixAnswers) {
    lines.push(`${matrixAnswer.row?.label ?? "Fila"}: ${matrixAnswer.value ?? ""}`);
  }

  for (const compositeAnswer of answer.compositeAnswers) {
    lines.push(`${compositeAnswer.field?.label ?? "Campo"}: ${compositeAnswer.value ?? ""}`);
  }

  return lines.length ? lines : ["Sin respuesta"];
}

type StatusKey = "ALL" | "PENDING" | "UPDATED" | "CHANGES_REQUESTED" | "APPROVED";

function getReviewStatus(submission: SubmissionForReview) {
  const latestReview = submission.reviews?.[0];
  if (!latestReview) {
    return {
      key: "PENDING" as StatusKey,
      label: "Sin revisar",
      color: "default" as const,
      borderLeftColor: "#94a3b8",
      icon: <PendingActionsIcon fontSize="small" />,
    };
  }

  if (latestReview.status === "CHANGES_REQUESTED") {
    return {
      key: "CHANGES_REQUESTED" as StatusKey,
      label: "Corrección solicitada",
      color: "warning" as const,
      borderLeftColor: "#f59e0b",
      icon: <WarningAmberIcon fontSize="small" />,
    };
  }
  if (latestReview.status === "UPDATED") {
    return {
      key: "UPDATED" as StatusKey,
      label: "Modificada · revisar",
      color: "info" as const,
      borderLeftColor: "#3b82f6",
      icon: <EditNoteIcon fontSize="small" />,
    };
  }
  return {
    key: "APPROVED" as StatusKey,
    label: "Aprobada",
    color: "success" as const,
    borderLeftColor: "#10b981",
    icon: <CheckCircleIcon fontSize="small" />,
  };
}

export default function SubmissionReviews() {
  const { data: submissions = [], isLoading, isError } = useSubmissionsForReview();
  const requestReview = useRequestSubmissionReview();
  const approveReview = useApproveSubmissionReview();

  const [selected, setSelected] = useState<SubmissionForReview | null>(null);
  const [comment, setComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey>("ALL");

  // Estadísticas KPI
  const stats = useMemo(() => {
    let pending = 0;
    let updated = 0;
    let changesRequested = 0;
    let approved = 0;

    submissions.forEach((sub) => {
      const status = getReviewStatus(sub).key;
      if (status === "PENDING") pending++;
      else if (status === "UPDATED") updated++;
      else if (status === "CHANGES_REQUESTED") changesRequested++;
      else if (status === "APPROVED") approved++;
    });

    return {
      total: submissions.length,
      pending,
      updated,
      changesRequested,
      approved,
    };
  }, [submissions]);

  // Filtrado de entrevistas
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const reviewStatus = getReviewStatus(sub);

      if (statusFilter !== "ALL" && reviewStatus.key !== statusFilter) {
        return false;
      }

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const formStr = `formulario n.º ${sub.formNumber} ${sub.formNumber}`.toLowerCase();
        const surveyTitle = sub.survey?.title?.toLowerCase() ?? "";
        const interviewerName = sub.interviewer
          ? `${sub.interviewer.firstName} ${sub.interviewer.lastName}`.toLowerCase()
          : "";

        return (
          formStr.includes(query) ||
          surveyTitle.includes(query) ||
          interviewerName.includes(query)
        );
      }

      return true;
    });
  }, [submissions, statusFilter, searchTerm]);

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
    const review = selected?.reviews?.[0];
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
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        No se pudieron cargar las entrevistas para revisión.
      </Alert>
    );
  }

  const currentSubmission =
    submissions.find((item) => item.id === selected?.id) ?? selected;
  const currentReview = currentSubmission?.reviews?.[0];
  const isPendingCorrection = currentReview?.status === "CHANGES_REQUESTED";

  return (
    <Box sx={{ width: "100%", maxWidth: 1400, mx: "auto" }}>
      {/* =====================================================
          HEADER & KPI METRICS
         ===================================================== */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
          <Box
            sx={{
              bgcolor: "#4338ca",
              color: "white",
              p: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AssignmentIcon fontSize="medium" />
          </Box>
          <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">
            Revisión de entrevistas
          </Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ ml: { xs: 0, sm: 6 } }}>
          Revisá las respuestas completadas por los encuestadores y solicitá
          correcciones cuando sea necesario.
        </Typography>

        {/* Tarjetas de estadísticas */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: statusFilter === "ALL" ? "#4f46e5" : "divider",
                bgcolor: statusFilter === "ALL" ? "#eef2ff" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#4f46e5" },
              }}
              onClick={() => setStatusFilter("ALL")}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                TOTAL
              </Typography>
              <Typography variant="h4" fontWeight={800} color="#1e1b4b">
                {stats.total}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: statusFilter === "PENDING" ? "#64748b" : "divider",
                bgcolor: statusFilter === "PENDING" ? "#f1f5f9" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#64748b" },
              }}
              onClick={() => setStatusFilter("PENDING")}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                SIN REVISAR
              </Typography>
              <Typography variant="h4" fontWeight={800} color="#475569">
                {stats.pending}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: statusFilter === "UPDATED" ? "#2563eb" : "divider",
                bgcolor: statusFilter === "UPDATED" ? "#eff6ff" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#2563eb" },
              }}
              onClick={() => setStatusFilter("UPDATED")}
            >
              <Typography variant="caption" color="#2563eb" fontWeight={600}>
                MODIFICADAS
              </Typography>
              <Typography variant="h4" fontWeight={800} color="#1d4ed8">
                {stats.updated}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: statusFilter === "CHANGES_REQUESTED" ? "#d97706" : "divider",
                bgcolor: statusFilter === "CHANGES_REQUESTED" ? "#fffbeb" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#d97706" },
              }}
              onClick={() => setStatusFilter("CHANGES_REQUESTED")}
            >
              <Typography variant="caption" color="#d97706" fontWeight={600}>
                CORRECCIÓN PEDIDA
              </Typography>
              <Typography variant="h4" fontWeight={800} color="#b45309">
                {stats.changesRequested}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: statusFilter === "APPROVED" ? "#059669" : "divider",
                bgcolor: statusFilter === "APPROVED" ? "#ecfdf5" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#059669" },
              }}
              onClick={() => setStatusFilter("APPROVED")}
            >
              <Typography variant="caption" color="#059669" fontWeight={600}>
                APROBADAS
              </Typography>
              <Typography variant="h4" fontWeight={800} color="#047857">
                {stats.approved}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* =====================================================
          BUSCADOR Y FILTROS
         ===================================================== */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "white",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <TextField
            size="small"
            placeholder="Buscar por N.º formulario, encuesta o encuestador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: "100%", md: 450 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Tabs
            value={statusFilter}
            onChange={(_, val) => setStatusFilter(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 38,
              "& .MuiTab-root": {
                minHeight: 38,
                py: 0.5,
                px: 2,
                fontSize: "0.85rem",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
              },
            }}
          >
            <Tab value="ALL" label="Todas" />
            <Tab value="PENDING" label="Sin revisar" />
            <Tab value="UPDATED" label="Modificadas" />
            <Tab value="CHANGES_REQUESTED" label="Corrección solicitada" />
            <Tab value="APPROVED" label="Aprobadas" />
          </Tabs>
        </Stack>
      </Paper>

      {/* =====================================================
          LISTA DE ENTREVISTAS
         ===================================================== */}
      {filteredSubmissions.length ? (
        <Stack spacing={2}>
          {filteredSubmissions.map((submission) => {
            const reviewStatus = getReviewStatus(submission);
            const interviewerName = submission.interviewer
              ? `${submission.interviewer.firstName} ${submission.interviewer.lastName}`.trim()
              : "No identificado";

            return (
              <Card
                key={submission.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderLeft: `5px solid ${reviewStatus.borderLeftColor}`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                    borderColor: "rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={2}
                  >
                    {/* Info principal */}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        flexWrap="wrap"
                        sx={{ mb: 1 }}
                      >
                        <Chip
                          label={`Formulario N.º ${submission.formNumber}`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: "#e0e7ff",
                            color: "#3730a3",
                            borderRadius: "6px",
                          }}
                        />

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            fontSize: "1.05rem",
                            color: "#1e293b",
                          }}
                        >
                          {submission.survey?.title || "Encuesta"}
                        </Typography>
                      </Stack>

                      {/* Detalles secundarios */}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 1, sm: 3 }}
                        color="text.secondary"
                        sx={{ fontSize: "0.85rem" }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          <PersonIcon sx={{ fontSize: 18, color: "#64748b" }} />
                          <Typography variant="body2" color="text.secondary">
                            Encuestador/a: <strong>{interviewerName}</strong>
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, color: "#64748b" }} />
                          <Typography variant="body2" color="text.secondary">
                            {submission.completedAt
                              ? new Date(submission.completedAt).toLocaleString("es-AR")
                              : "Fecha no disponible"}
                          </Typography>
                        </Box>

                        {submission.reviews?.length > 0 && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <HistoryIcon sx={{ fontSize: 18, color: "#64748b" }} />
                            <Typography variant="body2" color="text.secondary">
                              {submission.reviews.length}{" "}
                              {submission.reviews.length === 1 ? "revisión" : "revisiones"}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>

                    {/* Acciones & Estado */}
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ width: { xs: "100%", md: "auto" }, justifyContent: "space-between" }}
                    >
                      <Chip
                        icon={reviewStatus.icon}
                        label={reviewStatus.label}
                        color={reviewStatus.color}
                        variant={reviewStatus.key === "PENDING" ? "outlined" : "filled"}
                        sx={{
                          fontWeight: 600,
                          borderRadius: "8px",
                          px: 0.5,
                        }}
                      />

                      <Button
                        variant="contained"
                        startIcon={<VisibilityIcon />}
                        onClick={() => {
                          setSelected(submission);
                          setComment("");
                        }}
                        sx={{
                          bgcolor: "#4f46e5",
                          "&:hover": { bgcolor: "#4338ca" },
                          borderRadius: 2,
                          px: 2.5,
                          fontWeight: 600,
                          textTransform: "none",
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
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "white",
          }}
        >
          <AssignmentIcon sx={{ fontSize: 50, color: "#cbd5e1", mb: 1.5 }} />
          <Typography variant="h6" color="text.secondary" fontWeight={600}>
            No se encontraron entrevistas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {searchTerm || statusFilter !== "ALL"
              ? "Probá cambiando los filtros o el texto de búsqueda."
              : "Todavía no hay entrevistas completadas para revisar."}
          </Typography>
        </Paper>
      )}

      {/* =====================================================
          MODAL DETALLE Y REVISIÓN
         ===================================================== */}
      <Dialog
        open={Boolean(currentSubmission)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        {currentSubmission && (
          <>
            <DialogTitle
              sx={{
                bgcolor: "#1e1b4b",
                color: "white",
                py: 2.5,
                px: 3,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    <Chip
                      label={`Formulario N.º ${currentSubmission.formNumber}`}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 700,
                        borderRadius: "6px",
                      }}
                    />
                    <Typography variant="h6" fontWeight={700}>
                      {currentSubmission.survey?.title}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    Encuestador/a:{" "}
                    <strong>
                      {currentSubmission.interviewer
                        ? `${currentSubmission.interviewer.firstName} ${currentSubmission.interviewer.lastName}`
                        : "No identificado"}
                    </strong>
                    {" · "}
                    {currentSubmission.completedAt
                      ? new Date(currentSubmission.completedAt).toLocaleString("es-AR")
                      : "Fecha no disponible"}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => setSelected(null)}
                  sx={{ color: "rgba(255,255,255,0.8)", "&:hover": { color: "white" } }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
              {/* HISTORIAL DE REVISIONES */}
              {currentSubmission.reviews?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1}>
                    SEGUIMIENTO DE LA REVISIÓN
                  </Typography>
                  <Stack spacing={1.5}>
                    {currentSubmission.reviews.map((rev) => (
                      <Alert
                        key={rev.id}
                        severity={
                          rev.status === "CHANGES_REQUESTED"
                            ? "warning"
                            : rev.status === "UPDATED"
                              ? "info"
                              : "success"
                        }
                        sx={{
                          borderRadius: 2,
                          "& .MuiAlert-message": { width: "100%" },
                        }}
                      >
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          spacing={1}
                        >
                          <Typography variant="body2">
                            <strong>
                              {rev.status === "CHANGES_REQUESTED"
                                ? "Corrección solicitada"
                                : rev.status === "UPDATED"
                                  ? "Encuestador/a modificó la entrevista"
                                  : "Entrevista aprobada"}
                            </strong>
                            : {rev.comment}
                          </Typography>
                          {rev.requestedAt && (
                            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                              {new Date(rev.requestedAt).toLocaleString("es-AR")}
                            </Typography>
                          )}
                        </Stack>
                      </Alert>
                    ))}
                  </Stack>
                  <Divider sx={{ my: 3 }} />
                </Box>
              )}

              {/* LISTA DE RESPUESTAS */}
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={2}>
                RESPUESTAS DEL FORMULARIO
              </Typography>

              <Stack spacing={2.5}>
                {currentSubmission.answers.map((answer, index) => {
                  const answerLines = getAnswerLines(answer);

                  return (
                    <Box
                      key={answer.id}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: "#f8fafc",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                        <Chip
                          label={index + 1}
                          size="small"
                          sx={{
                            height: 22,
                            width: 22,
                            fontWeight: 700,
                            bgcolor: "#e2e8f0",
                            color: "#475569",
                            fontSize: "0.75rem",
                          }}
                        />
                        <Typography fontWeight={700} color="#1e293b" sx={{ fontSize: "0.95rem" }}>
                          {answer.question?.title || "Pregunta"}
                        </Typography>
                      </Stack>

                      <Box sx={{ pl: 3.5 }}>
                        <Stack spacing={0.5}>
                          {answerLines.map((line, lIndex) => (
                            <Typography
                              key={`${answer.id}-${lIndex}`}
                              variant="body2"
                              sx={{
                                color: "#334155",
                                fontWeight: 500,
                                bgcolor: "white",
                                p: 1,
                                borderRadius: 1.5,
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              {line}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>

              {/* ÁREA DE ACCIÓN DEL SUPERVISOR */}
              <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
                {!isPendingCorrection ? (
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                      OBSERVACIÓN PARA EL ENCUESTADOR/A
                    </Typography>
                    <TextField
                      placeholder="Escribí detalladamente qué pregunta debe corregirse o verificarse..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      multiline
                      minRows={3}
                      fullWidth
                      inputProps={{ maxLength: 2000 }}
                      sx={{
                        bgcolor: "white",
                        borderRadius: 2,
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        {comment.length} / 2000 caracteres
                      </Typography>
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<SendIcon />}
                        onClick={handleRequestChanges}
                        disabled={requestReview.isPending || !comment.trim()}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        {requestReview.isPending
                          ? "Enviando..."
                          : "Solicitar corrección"}
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    Esta entrevista ya tiene una corrección pendiente en manos del encuestador/a.
                  </Alert>
                )}
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                borderTop: "1px solid",
                borderColor: "divider",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={() => setSelected(null)}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#64748b",
                  borderColor: "#cbd5e1",
                }}
              >
                Cerrar
              </Button>

              {currentReview?.status === "UPDATED" && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ThumbUpAltIcon />}
                  onClick={handleApprove}
                  disabled={approveReview.isPending}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    px: 3,
                  }}
                >
                  {approveReview.isPending ? "Aprobando..." : "Aprobar entrevista"}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
