import { Typography, Stack, Chip, Box } from "@mui/material";
import ReportCard from "../ReportCard";

export default function DateSummary({ question }: any) {
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
          {question.answers.map((date: string, index: number) => (
            <Typography key={index}>
              {new Date(date).toLocaleDateString("es-AR")}
            </Typography>
          ))}
        </Stack>
      </Box>
    </ReportCard>
  );
}
