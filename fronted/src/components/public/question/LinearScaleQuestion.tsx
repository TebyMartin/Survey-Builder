import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import QuestionContainer from "../QuestionContainer";
import type { SurveyQuestion } from "../../../types/surveys";

interface Props {
  question: SurveyQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function LinearScaleQuestion({
  question,
  value,
  onChange,
  error,
}: Props) {
  const min = question.min ?? 1;
  const max = question.max ?? 5;

  return (
    <QuestionContainer question={question}>
      <FormControl>
        <RadioGroup
          row
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <Stack direction="row" spacing={2}>
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(
              (number) => (
                <FormControlLabel
                  key={number}
                  value={String(number)}
                  control={<Radio />}
                  label={number}
                />
              ),
            )}
          </Stack>
        </RadioGroup>
      </FormControl>
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
