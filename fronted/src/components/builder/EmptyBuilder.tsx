import { Paper, Typography } from "@mui/material";

export default function EmptyBuilder() {
  return (
    <Paper
      sx={{
        p: 6,
        textAlign: "center",
      }}
    >
      <Typography variant="h6">
        La encuesta todavía no tiene preguntas.
      </Typography>

      <Typography color="text.secondary">
        Comenzá agregando una sección.
      </Typography>
    </Paper>
  );
}
