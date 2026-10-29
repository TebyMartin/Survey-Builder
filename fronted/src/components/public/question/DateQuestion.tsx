import { TextField } from "@mui/material";
import QuestionContainer from "../QuestionContainer";
import type { SurveyQuestion } from "../../../types/surveys";

interface Props {
  question: SurveyQuestion;
  value: string;
  onChange: (value: string) => void;
  type?: "date" | "datetime-local";
  error?: string;
}

export default function DateQuestion({
  question,
  value,
  onChange,
  type = "date",
  error,
}: Props) {
  return (
    <QuestionContainer question={question}>
      <TextField
        fullWidth
        type={type}
        error={!!error}
        helperText={error}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </QuestionContainer>
  );
}
