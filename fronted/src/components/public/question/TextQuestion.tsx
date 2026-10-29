import { TextField } from "@mui/material";

import QuestionContainer from "../QuestionContainer";
import type { SurveyQuestion } from "../../../types/surveys";

interface Props {
  question: SurveyQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: React.InputHTMLAttributes<unknown>["type"];
}

export default function TextQuestion({
  question,
  value,
  onChange,
  type = "text",
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
        placeholder="Tu respuesta"
        onChange={(e) => onChange(e.target.value)}
      />
    </QuestionContainer>
  );
}
