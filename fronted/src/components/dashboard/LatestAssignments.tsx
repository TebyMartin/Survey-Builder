import {
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  Chip,
} from "@mui/material";

interface Props {
  assignments: any[];
}

function translateStatus(status: string) {
  const translations: Record<string, string> = {
    PENDING: "PENDIENTE",
    IN_PROGRESS: "EN PROGRESO",
    COMPLETED: "COMPLETADA",
    CANCELLED: "CANCELADA",
  };

  return translations[status] || status;
}

function getStatusColor(
  status: string,
): "success" | "warning" | "error" | "default" | "info" {
  switch (status) {
    case "COMPLETED":
      return "success";

    case "IN_PROGRESS":
      return "info";

    case "PENDING":
      return "warning";

    case "CANCELLED":
      return "error";

    default:
      return "default";
  }
}

export default function LatestAssignments({ assignments }: Props) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          📋 Últimas asignaciones
        </Typography>

        <Stack spacing={2}>
          {assignments.map((assignment) => (
            <Stack key={assignment.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack spacing={0.5}>
                  <Typography fontWeight={600}>
                    {assignment.survey.title}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {assignment.user.firstName} {assignment.user.lastName}
                  </Typography>
                </Stack>

                <Chip
                  label={translateStatus(assignment.status)}
                  color={getStatusColor(assignment.status)}
                  size="small"
                />
              </Stack>

              <Divider sx={{ mt: 2 }} />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
