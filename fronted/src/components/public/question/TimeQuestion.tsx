import { TextField } from "@mui/material";
import QuestionContainer from "../QuestionContainer";
import type { SurveyQuestion } from "../../../types/surveys";

interface Props {
  question: SurveyQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function TimeQuestion({
  question,
  value,
  onChange,
  error,
}: Props) {
  return (
    <QuestionContainer question={question}>
      <TextField
        fullWidth
        type="time"
        error={!!error}
        helperText={error}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    </QuestionContainer>
  );
}
