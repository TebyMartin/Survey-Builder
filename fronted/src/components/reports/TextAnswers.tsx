import { Stack, Paper, Typography, Chip } from "@mui/material";

interface Props {
  answers: string[];
}

export default function TextAnswers({ answers }: Props) {
  if (answers.length === 0) {
    return (
      <Typography color="text.secondary">
        Todavía no hay respuestas para esta pregunta.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Chip
        label={`${answers.length} respuestas`}
        color="primary"
        variant="outlined"
        sx={{ width: "fit-content" }}
      />

      {answers.map((answer, index) => (
        <Paper
          key={index}
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#fafafa",
          }}
        >
          <Typography>{answer}</Typography>
        </Paper>
      ))}
    </Stack>
  );
}
