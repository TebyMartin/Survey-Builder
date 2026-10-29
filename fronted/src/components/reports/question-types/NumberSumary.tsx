import { Chip, CardContent, Typography, Grid } from "@mui/material";
import ReportCard from "../ReportCard";

export default function NumberSummary({ question }: any) {
  const values = question.answers.map(Number);

  const min = Math.min(...values);

  const max = Math.max(...values);

  const average =
    values.reduce((a: number, b: number) => a + b, 0) / values.length;

  return (
    <ReportCard title={question.title}>
      <Chip
        color="primary"
        label={`${values.length} respuestas`}
        sx={{ mb: 3 }}
      />
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          {question.title}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 4 }}>
            <Typography variant="caption">Promedio</Typography>

            <Typography variant="h5">{average.toFixed(1)}</Typography>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Typography variant="caption">Mínimo</Typography>

            <Typography variant="h5">{min}</Typography>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Typography variant="caption">Máximo</Typography>

            <Typography variant="h5">{max}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </ReportCard>
  );
}
