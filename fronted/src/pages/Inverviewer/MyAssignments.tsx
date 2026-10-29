import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import AssignmentCard from "../../components/assignments/AssignmentCard";
import { useMyAssignments } from "../../hooks/useAssigments";
import { Card, CardContent } from "@mui/material";
import { useMe } from "../../hooks/useUsers";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PollIcon from "@mui/icons-material/Poll";
import { LinearProgress } from "@mui/material";

interface AssignmentProgress {
  id: string;
  status: string;
  targetResponses: number;
  completedResponses: number;
  reviewRequestsCount?: number;
  survey: {
    title: string;
  };
}

export default function MyAssignments() {
  const { data: user } = useMe();
  const { data = [], isLoading } = useMyAssignments();
  const assignments = data as AssignmentProgress[];

  const pending = assignments.filter(
    (assignment) => assignment.status === "PENDING",
  ).length;

  const completedAssignments = assignments.filter(
    (assignment) => assignment.status === "COMPLETED",
  ).length;

  const totalResponses = assignments.reduce(
    (acc, assignment) => acc + (assignment.completedResponses ?? 0),
    0,
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  const totalTargetResponses = assignments.reduce(
    (acc, assignment) => acc + (assignment.targetResponses ?? 0),
    0,
  );

  const completedResponses = assignments.reduce(
    (acc, assignment) => acc + (assignment.completedResponses ?? 0),
    0,
  );

  const progress =
    totalTargetResponses > 0
      ? Math.min(
          100,
          Math.round((completedResponses / totalTargetResponses) * 100),
        )
      : 0;
  const remainingResponses = Math.max(
    totalTargetResponses - completedResponses,
    0,
  );

  return (
    <>
      <Box mb={5}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            mb: 1,
          }}
        >
          Hola, {user?.firstName} 👋
        </Typography>

        <Typography variant="h6" color="text.secondary">
          Bienvenido nuevamente.
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          Estas son las encuestas que tenés asignadas para completar.
        </Typography>
      </Box>
      <Card
        sx={{
          mb: 5,
          borderRadius: 4,
          boxShadow: 2,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight="bold">
              Progreso general
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 12,
                borderRadius: 999,
              }}
            />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {completedResponses} de {totalTargetResponses} entrevistas
              </Typography>

              <Typography variant="body2" color="primary" fontWeight="bold">
                {progress}%
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Faltan {remainingResponses} entrevistas para alcanzar el objetivo.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Grid container spacing={3} mb={5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2,
              transition: ".25s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <AssignmentTurnedInIcon
                  sx={{
                    fontSize: 40,
                    color: "#f59e0b",
                  }}
                />

                <Typography color="text.secondary">Pendientes</Typography>

                <Typography variant="h3" fontWeight="bold">
                  {pending}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Asignaciones pendientes
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2,
              transition: ".25s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: 40,
                    color: "#10b981",
                  }}
                />

                <Typography color="text.secondary">Completadas</Typography>

                <Typography variant="h3" fontWeight="bold">
                  {completedAssignments}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Asignaciones finalizadas
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 2,
              transition: ".25s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <PollIcon
                  sx={{
                    fontSize: 40,
                    color: "#2563eb",
                  }}
                />

                <Typography color="text.secondary">
                  Entrevistas realizadas
                </Typography>

                <Typography variant="h3" fontWeight="bold">
                  {totalResponses}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Entrevistas individuales completadas
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack spacing={3}>
        {assignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </Stack>
    </>
  );
}
