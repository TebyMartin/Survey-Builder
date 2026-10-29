import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  TextField,
} from "@mui/material";

import type { SurveyQuestion } from "../../../types/surveys";
import QuestionContainer from "../QuestionContainer";

interface CheckboxValue {
  options: string[];
  otherText: string;
}

interface Props {
  question: SurveyQuestion;
  value: CheckboxValue;
  error?: string;
  onChange: (value: CheckboxValue) => void;
}

export default function CheckboxQuestion({
  question,
  value = {
    options: [],
    otherText: "",
  },
  onChange,
  error,
}: Props) {
  const selectedOptions = value?.options ?? [];
  const otherText = value?.otherText ?? "";

  function handleToggle(optionId: string, isOther: boolean) {
    let newOptions = [...selectedOptions];

    if (newOptions.includes(optionId)) {
      newOptions = newOptions.filter((id) => id !== optionId);
    } else {
      newOptions.push(optionId);
    }

    onChange({
      options: newOptions,
      otherText: isOther && !newOptions.includes(optionId) ? "" : otherText,
    });
  }

  return (
    <QuestionContainer question={question}>
      <FormGroup>
        {question.options.map((option) => {
          const checked = selectedOptions.includes(option.id);

          return (
            <div key={option.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() => handleToggle(option.id, option.isOther!)}
                  />
                }
                label={option.label}
              />

              {/* Campo para "Otro" */}
              {option.isOther && checked && (
                <TextField
                  fullWidth
                  size="small"
                  label="Especificá cuál"
                  placeholder="Escribí tu respuesta"
                  value={otherText}
                  onChange={(e) =>
                    onChange({
                      options: selectedOptions,
                      otherText: e.target.value,
                    })
                  }
                  sx={{
                    ml: 4,
                    mb: 2,
                    mt: 1,
                    maxWidth: 500,
                  }}
                />
              )}
            </div>
          );
        })}
      </FormGroup>

      {error && (
        <Typography
          color="error"
          variant="caption"
          sx={{
            mt: 1,
            display: "block",
          }}
        >
          {error}
        </Typography>
      )}
    </QuestionContainer>
  );
}
