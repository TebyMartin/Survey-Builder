import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

import type { SurveyQuestion } from "../../../types/surveys";
import QuestionContainer from "../QuestionContainer";

interface Props {
  question: SurveyQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function SelectQuestion({
  question,
  value,
  onChange,
  error,
}: Props) {
  return (
    <QuestionContainer question={question}>
      <FormControl fullWidth error={!!error}>
        <InputLabel>Seleccione una opción</InputLabel>

        <Select
          value={value ?? ""}
          label="Seleccione una opción"
          onChange={(e) => onChange(e.target.value)}
        >
          {question.options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
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
