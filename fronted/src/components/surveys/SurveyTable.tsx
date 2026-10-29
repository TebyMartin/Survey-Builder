import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
} from "@mui/material";

import SurveyRowActions from "./SurveyRowActions";
import StatusChip from "./StatusChip";
import { useSurveys } from "../../hooks/useSurvey";

interface Props {
  status: string;
  search: string;
}

export default function SurveyTable({ status, search }: Props) {
  const { data, isLoading } = useSurveys();

  const surveys = data
    ?.filter((survey) => (status === "ALL" ? true : survey.status === status))
    .filter((survey) =>
      survey.title.toLowerCase().includes(search.toLowerCase()),
    );

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!surveys || surveys.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          No hay encuestas
        </Typography>

        <Typography color="text.secondary">
          No existen encuestas para el filtro seleccionado.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 700,
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
              <TableCell>Título</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Versión</TableCell>
              <TableCell>Publicada</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {surveys.map((survey) => (
              <TableRow
                key={survey.id}
                hover
                sx={{
                  "& td": {
                    py: 2,
                  },
                }}
              >
                <TableCell
                  sx={{
                    minWidth: 250,
                    maxWidth: 400,
                  }}
                >
                  <Typography
                    fontWeight={600}
                    noWrap
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {survey.title}
                  </Typography>
                </TableCell>

                <TableCell>
                  <StatusChip status={survey.status} />
                </TableCell>

                <TableCell>
                  <Typography fontWeight={600}>
                    v{(survey as any).version}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography fontWeight={600} noWrap>
                    {survey.publishedAt
                      ? new Date(survey.publishedAt).toLocaleDateString("es-AR")
                      : "-"}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <SurveyRowActions survey={survey} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
