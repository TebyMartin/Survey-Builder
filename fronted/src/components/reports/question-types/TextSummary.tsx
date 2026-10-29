import { Typography, Chip, Stack, Box } from "@mui/material";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import ReportCard from "../ReportCard";
import type { TextQuestionSummary } from "../../../types/report";

export default function TextSummary({
  question,
}: {
  question: TextQuestionSummary;
}) {
  return (
    <ReportCard title={question.title}>
      <Chip
        color="primary"
        size="small"
        label={`${question.answers.length} respuesta${
          question.answers.length !== 1 ? "s" : ""
        }`}
        sx={{ mb: 3 }}
      />

      <Stack spacing={2}>
        {question.answers.map((answer, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "grey.100",
              border: "1px solid",
              borderColor: "grey.300",
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <ChatBubbleOutlineIcon fontSize="small" color="primary" />

              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
              >
                Respuesta {index + 1}
              </Typography>
            </Box>

            <Typography>{answer}</Typography>
          </Box>
        ))}
      </Stack>
    </ReportCard>
  );
}
