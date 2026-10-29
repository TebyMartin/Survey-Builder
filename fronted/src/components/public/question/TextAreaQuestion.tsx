import { TextField } from "@mui/material";
import QuestionContainer from "../QuestionContainer";
import type { SurveyQuestion } from "../../../types/surveys";

interface Props {
  question: SurveyQuestion;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function TextAreaQuestion({
  question,
  value,
  onChange,
  error,
}: Props) {
  return (
    <QuestionContainer question={question}>
      <TextField
        fullWidth
        multiline
        minRows={4}
        error={!!error}
        helperText={error}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </QuestionContainer>
  );
}
