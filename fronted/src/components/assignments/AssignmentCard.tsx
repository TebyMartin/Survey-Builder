import {
  Card,
  CardContent,
  Alert,
  Typography,
  Stack,
  Button,
  Divider,
  Box,
} from "@mui/material";
import { LinearProgress } from "@mui/material";
import { Avatar } from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { useNavigate } from "react-router-dom";
import AssignmentStatusChip from "./AssignmentStatusChip";

interface Props {
  assignment: {
    id: string;
    status: string;
    completedResponses: number;
    targetResponses: number;
    reviewRequestsCount?: number;
    survey: {
      title: string;
    };
  };
}

export default function AssignmentCard({ assignment }: Props) {
  const navigate = useNavigate();

  const completed = assignment.completedResponses;
  const total = assignment.targetResponses;

  const progress =
    total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  const remaining = Math.max(total - completed, 0);

  const buttonText =
    assignment.status === "COMPLETED"
      ? "Ver / editar entrevistas"
      : assignment.completedResponses === 0
        ? "Comenzar"
        : "Nueva entrevista";
  const progressColor =
    progress === 100
      ? "success"
      : progress >= 70
      ? "primary"
      : progress >= 30
      ? "warning"
      : "error";
  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 5,
        transition: ".25s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,

          bgcolor:
            assignment.status === "COMPLETED"
              ? "success.main"
              : assignment.completedResponses > 0
              ? "primary.main"
              : "warning.main",
        }}
      />
      <CardContent>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor:
                    assignment.status === "COMPLETED"
                      ? "success.main"
                      : "primary.main",
                  width: 52,
                  height: 52,
                  boxShadow: 3,
                }}
              >
                <DescriptionOutlinedIcon />
              </Avatar>

              <Stack spacing={0.5}>
                <Typography variant="h6" fontWeight="bold">
                  {assignment.survey.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Encuesta asignada para completar
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Divider />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <AssignmentStatusChip status={assignment.status} />
          </Stack>
          {(assignment.reviewRequestsCount ?? 0) > 0 && (
            <Alert severity="warning">
              Tenés {assignment.reviewRequestsCount} entrevista
              {assignment.reviewRequestsCount === 1 ? "" : "s"} para corregir.
              Revisá las observaciones antes de modificar las respuestas.
            </Alert>
          )}
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                bgcolor: "grey.100",
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography fontWeight="bold">Objetivo</Typography>

              <Typography color="primary" fontWeight="bold">
                {total} entrevistas
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={progress}
              color={progressColor}
              sx={{
                height: 10,
                borderRadius: 999,
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                },
              }}
            />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" fontWeight="bold">
                {completed} / {total} entrevistas
              </Typography>

              <Typography variant="body2" color="primary" fontWeight="bold">
                {progress}%
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Te quedan {remaining} entrevistas
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() =>
                navigate(`/interviewer/assignments/${assignment.id}`)
              }
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.2,
                minWidth: 180,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 3,
                transition: ".25s",

                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 6,
                },
              }}
            >
              {buttonText}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
