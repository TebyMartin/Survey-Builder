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

export default function RatingQuestion({
  error,
  question,
  value,
  onChange,
}: Props) {
  return (
    <QuestionContainer question={question}>
      <Typography mb={2} color="text.secondary">
        0 = Nada probable &nbsp;&nbsp;&nbsp;&nbsp; 10 = Muy probable
      </Typography>

      <FormControl>
        <RadioGroup
          row
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Array.from({ length: 11 }, (_, i) => (
              <FormControlLabel
                key={i}
                value={String(i)}
                control={<Radio />}
                label={i}
              />
            ))}
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
