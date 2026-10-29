import { Typography, Stack, LinearProgress, Box, Chip } from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import ReportCard from "../ReportCard";
import type { NpsQuestionSummary } from "../../../types/report";

export default function RatingSummary({
  question,
}: {
  question: NpsQuestionSummary;
}) {
  const values = question.answers.map(Number);

  const total = values.length;

  const average =
    total === 0 ? 0 : values.reduce((a, b) => a + b, 0) / total;

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: values.filter((value) => value === star).length,
  }));

  return (
    <ReportCard title={question.title}>
      <Chip
        color="primary"
        size="small"
        label={`${total} respuesta${total !== 1 ? "s" : ""}`}
        sx={{ mb: 3 }}
      />
      <Typography variant="h6" fontWeight="bold">
        {question.title}
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={4}
        mb={4}
      >
        <Typography variant="h2" mr={2}>
          {average.toFixed(1)}
        </Typography>

        <StarIcon
          sx={{
            fontSize: 45,
            color: "#FFC107",
          }}
        />
      </Box>

      <Stack spacing={2}>
        {counts.map((item) => (
          <Box key={item.star}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>{"★".repeat(item.star)}</Typography>

              <Typography>{item.count}</Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={total === 0 ? 0 : (item.count / total) * 100}
              sx={{
                height: 8,
                borderRadius: 5,
              }}
            />
          </Box>
        ))}
      </Stack>
    </ReportCard>
  );
}
