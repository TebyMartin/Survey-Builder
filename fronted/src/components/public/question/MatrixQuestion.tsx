import { Stack, TextField, Typography } from "@mui/material";
import type { SurveyQuestion } from "../../../types/surveys";

interface Props {
  question: SurveyQuestion;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

export default function MatrixQuestion({
  question,
  value,
  onChange,
  error,
}: Props) {
  const values =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, string>)
      : {};
  console.log("MATRIX QUESTION:", question);
  return (
    <Stack spacing={2}>
      <Typography fontWeight="bold">{question.title}</Typography>

      {question.matrixRows?.map((row: any) => (
        <Stack key={row.id} direction="row" spacing={2} alignItems="center">
          <Typography sx={{ flex: 1 }}>{row.label}</Typography>

          <TextField
            type="number"
            size="small"
            value={values[row.id] ?? ""}
            onChange={(e) => {
              onChange({
                ...values,
                [row.id]: e.target.value,
              });
            }}
            inputProps={{
              min: question.minValue,
              max: question.maxValue,
            }}
            sx={{ width: 120 }}
          />
        </Stack>
      ))}

      {error && <Typography color="error">{error}</Typography>}
    </Stack>
  );
}
