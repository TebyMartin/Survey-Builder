import { Typography, Stack, Chip, Box } from "@mui/material";
import ReportCard from "../ReportCard";
import type { TextQuestionSummary } from "../../../types/report";

export default function EmailSummary({
  question,
}: {
  question: TextQuestionSummary;
}) {
  return (
    <ReportCard title={question.title}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "grey.100",
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {question.title}
        </Typography>

        <Chip
          sx={{ mt: 1, mb: 2 }}
          size="small"
          label={`${question.answers.length} respuestas`}
        />

        <Stack spacing={1}>
          {question.answers.map((email, index) => (
            <Typography key={index}>{email}</Typography>
          ))}
        </Stack>
      </Box>
    </ReportCard>
  );
}
