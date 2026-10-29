import { RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";
import QuestionContainer from "../QuestionContainer";
import type { SurveyQuestion } from "../../../types/surveys";

interface Props {
  question: SurveyQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function RadioQuestion({
  error,
  question,
  value,
  onChange,
}: Props) {
  return (
    <QuestionContainer question={question}>
      <RadioGroup
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {question.options.map((option) => (
          <FormControlLabel
            key={option.id}
            value={option.id}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {error && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mt: 1, display: "block" }}
        >
          {error}
        </Typography>
      )}
    </QuestionContainer>
  );
}
