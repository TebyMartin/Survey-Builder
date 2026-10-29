import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { SurveyQuestion } from "../../../types/surveys";
import RepeatableCompositeTable from "../../common/RepeatableCompositeTable";

interface Props {
  question: SurveyQuestion;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

type CompositeAnswerValue =
  | string
  | number
  | string[]
  | { options: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default function CompositeQuestion({
  question,
  value,
  onChange,
  error,
}: Props) {
  const values =
    isRecord(value)
      ? (value as Record<string, CompositeAnswerValue>)
      : {};

  if (question.isRepeatable) {
    return (
      <Stack spacing={2}>
        <Typography fontWeight="bold">{question.title}</Typography>
        <RepeatableCompositeTable
          fields={question.compositeFields ?? []}
          value={values}
          error={error}
          onChange={onChange}
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography fontWeight="bold">{question.title}</Typography>

      {question.compositeFields?.map((field) => {
        const fieldValue = values[field.id] ?? "";

        const fieldLabel = field.helpText || field.label || "";

        switch (field.type) {
          case "SHORT_TEXT":
            return (
              <TextField
                key={field.id}
                fullWidth
                label={fieldLabel}
                placeholder={field.placeholder ?? ""}
                required={field.required}
                value={fieldValue}
                onChange={(e) =>
                  onChange({
                    ...values,
                    [field.id]: e.target.value,
                  })
                }
              />
            );

          case "LONG_TEXT":
            return (
              <TextField
                key={field.id}
                fullWidth
                multiline
                rows={4}
                label={fieldLabel}
                placeholder={field.placeholder ?? ""}
                required={field.required}
                value={fieldValue}
                onChange={(e) =>
                  onChange({
                    ...values,
                    [field.id]: e.target.value,
                  })
                }
              />
            );

          case "NUMBER":
            return (
              <TextField
                key={field.id}
                fullWidth
                type="number"
                label={fieldLabel}
                required={field.required}
                value={fieldValue}
                onChange={(e) =>
                  onChange({
                    ...values,
                    [field.id]: e.target.value,
                  })
                }
                inputProps={{
                  min: field.minValue ?? undefined,
                  max: field.maxValue ?? undefined,
                }}
              />
            );

          case "EMAIL":
            return (
              <TextField
                key={field.id}
                fullWidth
                type="email"
                label={fieldLabel}
                placeholder={field.placeholder ?? ""}
                required={field.required}
                value={fieldValue}
                onChange={(e) =>
                  onChange({
                    ...values,
                    [field.id]: e.target.value,
                  })
                }
              />
            );

          case "PHONE":
            return (
              <TextField
                key={field.id}
                fullWidth
                type="tel"
                label={fieldLabel}
                placeholder={field.placeholder ?? ""}
                required={field.required}
                value={fieldValue}
                onChange={(e) =>
                  onChange({
                    ...values,
                    [field.id]: e.target.value,
                  })
                }
              />
            );

          case "DATE":
            return (
              <TextField
                key={field.id}
                fullWidth
                type="date"
                label={fieldLabel}
                required={field.required}
                value={fieldValue}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) =>
                  onChange({
                    ...values,
                    [field.id]: e.target.value,
                  })
                }
              />
            );

          case "TIME":
            return (
              <TextField
                key={field.id}
                fullWidth
                type="time"
                label={fieldLabel}
                required={field.required}
                value={fieldValue}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) =>
                  onChange({
                    ...values,
                    [field.id]: e.target.value,
                  })
                }
              />
            );

          case "DATETIME":
            return (
              <TextField
                key={field.id}
                fullWidth
                type="datetime-local"
                label={fieldLabel}
                required={field.required}
                value={fieldValue}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) =>
                  onChange({
                    ...values,
                    [field.id]: e.target.value,
                  })
                }
              />
            );

          case "RADIO":
            return (
              <Box key={field.id}>
                <Typography mb={1}>{fieldLabel}</Typography>

                <RadioGroup
                  value={fieldValue}
                  onChange={(e) =>
                    onChange({
                      ...values,
                      [field.id]: e.target.value,
                    })
                  }
                >
                  {field.options?.map((option) => (
                    <FormControlLabel
                      key={option.id ?? option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </Box>
            );

          case "CHECKBOX": {
            const selectedOptions =
              isRecord(fieldValue) && Array.isArray(fieldValue.options)
                ? fieldValue.options.filter(
                    (option): option is string => typeof option === "string",
                  )
                : [];

            return (
              <Box key={field.id}>
                <Typography mb={1}>{fieldLabel}</Typography>

                {field.options?.map((option) => {
                  const checked = selectedOptions.includes(option.value);

                  return (
                    <FormControlLabel
                      key={option.id ?? option.value}
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={(e) => {
                            let newOptions = [...selectedOptions];

                            if (e.target.checked) {
                              newOptions.push(option.value);
                            } else {
                              newOptions = newOptions.filter(
                                (item) => item !== option.value,
                              );
                            }

                            onChange({
                              ...values,
                              [field.id]: {
                                options: newOptions,
                              },
                            });
                          }}
                        />
                      }
                      label={option.label}
                    />
                  );
                })}
              </Box>
            );
          }

          case "SELECT":
            return (
              <TextField
                key={field.id}
                select
                fullWidth
                label={fieldLabel}
                required={field.required}
                value={fieldValue}
                onChange={(e) =>
                  onChange({
                    ...values,
                    [field.id]: e.target.value,
                  })
                }
              >
                {field.options?.map((option) => (
                  <MenuItem
                    key={option.id ?? option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );

          case "MULTISELECT":
            return (
              <Box key={field.id}>
                <Typography mb={1}>{fieldLabel}</Typography>

                <Select
                  multiple
                  fullWidth
                  value={Array.isArray(fieldValue) ? fieldValue : []}
                  input={<OutlinedInput />}
                  onChange={(e) =>
                    onChange({
                      ...values,
                      [field.id]: e.target.value,
                    })
                  }
                >
                  {field.options?.map((option) => (
                    <MenuItem
                      key={option.id ?? option.value}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            );

          case "SCALE":
            return (
              <Box key={field.id}>
                <Typography mb={1}>{fieldLabel}</Typography>

                <Rating
                  value={
                    typeof fieldValue === "number"
                      ? fieldValue
                      : typeof fieldValue === "string"
                        ? Number(fieldValue) || 0
                        : 0
                  }
                  onChange={(_, newValue) =>
                    onChange({
                      ...values,
                      [field.id]: newValue,
                    })
                  }
                />
              </Box>
            );

          case "NPS":
            return (
              <Box key={field.id}>
                <Typography mb={1}>{fieldLabel}</Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {Array.from({ length: 11 }, (_, i) => (
                    <Button
                      key={i}
                      variant={fieldValue === i ? "contained" : "outlined"}
                      onClick={() =>
                        onChange({
                          ...values,
                          [field.id]: i,
                        })
                      }
                    >
                      {i}
                    </Button>
                  ))}
                </Stack>
              </Box>
            );

          default:
            return (
              <Typography key={field.id}>
                Tipo de campo "{field.type}" no implementado.
              </Typography>
            );
        }
      })}

      {error && <Typography color="error">{error}</Typography>}
    </Stack>
  );
}
