import { Typography, Stack, LinearProgress, Box, Chip } from "@mui/material";

import ReportCard from "../ReportCard";
import PieAnswersChart from "../charts/PieAnswersChart";
import { COLORS } from "../charts/reportColors";
import type { ChoiceQuestionSummary } from "../../../types/report";

interface Props {
  question: ChoiceQuestionSummary;
}

export default function ChoiceSummary({ question }: Props) {
  const total = question.answers.reduce(
    (acc, answer) => acc + answer.count,
    0,
  );

  return (
    <ReportCard title={question.title}>
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Chip
          color="primary"
          size="small"
          label={`${question.answered} de ${question.total} respondieron`}
        />

        {question.answered < question.total && (
          <Chip color="default" size="small" label="Pregunta condicional" />
        )}
      </Stack>

      {question.answers.length > 1 && (
        <Box mb={4}>
          <PieAnswersChart data={question.answers} />
        </Box>
      )}

      <Stack spacing={3}>
        {question.answers.map((answer, index) => {
          const percent =
            total === 0 ? 0 : Math.round((answer.count / total) * 100);

          const answerColor = COLORS[index % COLORS.length];

          return (
            <Box key={answer.label}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography>{answer.label}</Typography>

                <Typography
                  fontWeight="bold"
                  sx={{
                    color: answerColor,
                  }}
                >
                  {percent}% ({answer.count})
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{
                  height: 12,
                  borderRadius: 10,
                  bgcolor: "grey.200",

                  "& .MuiLinearProgress-bar": {
                    borderRadius: 10,
                    backgroundColor: answerColor,
                  },
                }}
              />

              <Typography
                variant="caption"
                fontWeight="bold"
                sx={{
                  color: answerColor,
                }}
              >
                {percent}%
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </ReportCard>
  );
}
