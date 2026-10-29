import { TextField } from "@mui/material";
import QuestionContainer from "../QuestionContainer";
import type { SurveyQuestion } from "../../../types/surveys";

interface Props {
  question: SurveyQuestion;
  value: number | "";
  onChange: (value: number | "") => void;
  error?: string;
}

export default function NumberQuestion({
  error,
  question,
  value,
  onChange,
}: Props) {
  return (
    <QuestionContainer question={question}>
      <TextField
        fullWidth
        type="number"
        value={value}
        error={!!error}
        helperText={error}
        inputProps={{
          min: 0,
        }}
        onChange={(e) =>
          onChange(e.target.value === "" ? "" : Number(e.target.value))
        }
      />
    </QuestionContainer>
  );
}
