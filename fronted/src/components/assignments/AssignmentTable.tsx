import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  LinearProgress,
  Stack,
  Avatar,
} from "@mui/material";

import { useAssignments } from "../../hooks/useAssignments";
import AssignmentRowActions from "./AssignmentRowActions";
import AssignmentStatusChip from "./AssignmentStatusChip";
import type { SurveyAssignment } from "../../types/assignment";

interface Props {
  search: string;
}

export default function AssignmentTable({ search }: Props) {
  const { data = [], isLoading } = useAssignments();

  const assignments = (data as SurveyAssignment[]).filter((assignment) => {
    const text = search.toLowerCase();

    return (
      assignment.survey.title.toLowerCase().includes(text) ||
      assignment.user.firstName.toLowerCase().includes(text) ||
      assignment.user.lastName.toLowerCase().includes(text)
    );
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (assignments.length === 0) {
    return (
      <Paper
        sx={{
          p: {
            xs: 4,
            sm: 6,
          },
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h6">No hay asignaciones</Typography>

        <Typography color="text.secondary">
          No existen asignaciones registradas.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",

          "&::-webkit-scrollbar": {
            height: 8,
          },

          "&::-webkit-scrollbar-thumb": {
            borderRadius: 4,
            backgroundColor: "rgba(0,0,0,0.25)",
          },
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 900,
          }}
        >
          <TableHead
            sx={{
              "& .MuiTableCell-root": {
                bgcolor: "grey.100",
                fontWeight: 700,
                whiteSpace: "nowrap",
              },
            }}
          >
            <TableRow>
              <TableCell>Encuesta</TableCell>

              <TableCell>Encuestador</TableCell>

              <TableCell>Estado</TableCell>

              <TableCell>Progreso</TableCell>

              <TableCell>Asignada</TableCell>

              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {assignments.map((assignment) => {
              const percentage = assignment.targetResponses
                ? Math.round(
                    (assignment.completedResponses /
                      assignment.targetResponses) *
                      100,
                  )
                : 0;

              return (
                <TableRow
                  key={assignment.id}
                  hover
                  sx={{
                    "& td": {
                      py: 2,
                    },
                  }}
                >
                  {/* Encuesta */}
                  <TableCell>
                    <Typography
                      fontWeight={600}
                      noWrap
                      sx={{
                        maxWidth: 250,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {assignment.survey.title}
                    </Typography>
                  </TableCell>

                  {/* Usuario */}
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{
                        minWidth: 200,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        {assignment.user.firstName[0]}
                        {assignment.user.lastName[0]}
                      </Avatar>

                      <Stack spacing={0} minWidth={0}>
                        <Typography fontWeight={600} noWrap>
                          {assignment.user.firstName} {assignment.user.lastName}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          Entrevistador
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <AssignmentStatusChip status={assignment.status} />
                  </TableCell>

                  {/* Progreso */}
                  <TableCell
                    sx={{
                      width: 180,
                      minWidth: 180,
                    }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percentage, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 999,
                        mb: 1,
                      }}
                    />

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" fontWeight={600}>
                        {assignment.completedResponses}/
                        {assignment.targetResponses}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="primary"
                        fontWeight="bold"
                      >
                        {percentage}%
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Fecha */}
                  <TableCell>
                    <Typography fontWeight={600} noWrap>
                      {new Date(assignment.assignedAt).toLocaleDateString(
                        "es-AR",
                      )}
                    </Typography>
                  </TableCell>

                  {/* Acciones */}
                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 100,
                    }}
                  >
                    <AssignmentRowActions assignment={assignment} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
