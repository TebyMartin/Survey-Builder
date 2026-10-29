import {
  Chip,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";
import ReportCard from "../ReportCard";
interface Props {
  question: {
    title: string;
    answers: number[];
  };
}

export default function NpsSummary({ question }: Props) {
  const values = question.answers.map(Number);

  const total = values.length;

  const promoters = values.filter((v: number) => v >= 9).length;

  const passives = values.filter((v: number) => v >= 7 && v <= 8).length;

  const detractors = values.filter((v: number) => v <= 6).length;

  const promoterPercent = total === 0 ? 0 : (promoters / total) * 100;

  const detractorPercent = total === 0 ? 0 : (detractors / total) * 100;

  const nps = Math.round(promoterPercent - detractorPercent);

  return (
    <ReportCard title={question.title}>
      <Chip color="primary" label={`${total} respuestas`} sx={{ mb: 3 }} />
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={4}>
          {question.title}
        </Typography>

        <Typography variant="h2" align="center" color="primary" mb={4}>
          {nps}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 4 }}>
            <Typography color="error">Detractores</Typography>

            <Typography variant="h5">{detractors}</Typography>

            <LinearProgress
              color="error"
              variant="determinate"
              value={total === 0 ? 0 : (detractors / total) * 100}
            />
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Typography color="warning.main">Pasivos</Typography>

            <Typography variant="h5">{passives}</Typography>

            <LinearProgress
              color="warning"
              variant="determinate"
              value={total === 0 ? 0 : (passives / total) * 100}
            />
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Typography color="success.main">Promotores</Typography>

            <Typography variant="h5">{promoters}</Typography>

            <LinearProgress
              color="success"
              variant="determinate"
              value={total === 0 ? 0 : (promoters / total) * 100}
            />
          </Grid>
        </Grid>
      </CardContent>
    </ReportCard>
  );
}
