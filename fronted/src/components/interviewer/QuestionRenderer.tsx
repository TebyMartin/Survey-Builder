import { MenuItem, TextField, Typography } from "@mui/material";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Checkbox } from "@mui/material";
import { Rating } from "@mui/material";
import { Button, Stack } from "@mui/material";
import { Select, OutlinedInput } from "@mui/material";
import { Box } from "@mui/material";
import type { SurveyQuestion } from "../../types/surveys";

interface Props {
  question: SurveyQuestion;
  value: unknown;
  onChange: (questionId: string, value: unknown) => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default function QuestionRenderer({ question, value, onChange }: Props) {
  const inputValue =
    typeof value === "string" || typeof value === "number" ? value : "";
  const valueRecord = isRecord(value) ? value : {};

  switch (question.type) {
    case "SHORT_TEXT":
      return (
        <TextField
          fullWidth
          label={question.title}
          placeholder={question.placeholder}
          required={question.required}
          value={inputValue}
          onChange={(e) => onChange(question.id, e.target.value)}
        />
      );

    case "NUMBER":
      return (
        <TextField
          fullWidth
          type="number"
          label={question.title}
          required={question.required}
          value={inputValue}
          onChange={(e) => onChange(question.id, Number(e.target.value))}
        />
      );

    case "LONG_TEXT":
      return (
        <TextField
          fullWidth
          multiline
          rows={4}
          label={question.title}
          placeholder={question.placeholder}
          required={question.required}
          value={inputValue}
          onChange={(e) => onChange(question.id, e.target.value)}
        />
      );

    case "EMAIL":
      return (
        <TextField
          fullWidth
          type="email"
          label={question.title}
          value={inputValue}
          onChange={(e) => onChange(question.id, e.target.value)}
        />
      );

    case "PHONE":
      return (
        <TextField
          fullWidth
          type="tel"
          label={question.title}
          value={inputValue}
          onChange={(e) => onChange(question.id, e.target.value)}
        />
      );

    case "DATE":
      return (
        <TextField
          fullWidth
          type="date"
          label={question.title}
          value={inputValue}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => onChange(question.id, e.target.value)}
        />
      );

    case "RADIO":
      return (
        <>
          <Typography mb={1}>{question.title}</Typography>

          <RadioGroup
            value={value ?? ""}
            onChange={(e) => onChange(question.id, e.target.value)}
          >
            {question.options?.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </>
      );

    case "CHECKBOX": {
      const selectedOptions = Array.isArray(valueRecord.options)
        ? valueRecord.options.filter(
            (option): option is string => typeof option === "string",
          )
        : [];
      const otherText =
        typeof valueRecord.otherText === "string" ? valueRecord.otherText : "";

      return (
        <>
          <Typography mb={1}>{question.title}</Typography>

          {question.options?.map((option) => {
            const checked = selectedOptions.includes(option.id);

            return (
              <Box key={option.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => {
                        let newOptions = [...selectedOptions];

                        if (e.target.checked) {
                          newOptions.push(option.id);
                        } else {
                          newOptions = newOptions.filter(
                            (id) => id !== option.id,
                          );
                        }

                        onChange(question.id, {
                          options: newOptions,
                          otherText:
                            option.isOther && !e.target.checked
                              ? ""
                              : otherText,
                        });
                      }}
                    />
                  }
                  label={option.label}
                />

                {option.isOther && checked && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Especificá cuál"
                    value={otherText}
                    onChange={(e) =>
                      onChange(question.id, {
                        options: selectedOptions,
                        otherText: e.target.value,
                      })
                    }
                    sx={{ ml: 4, mb: 2, maxWidth: 500 }}
                  />
                )}
              </Box>
            );
          })}
        </>
      );
    }

    case "SELECT":
      return (
        <TextField
          select
          fullWidth
          label={question.title}
          value={value ?? ""}
          onChange={(e) => onChange(question.id, e.target.value)}
        >
          {question.options?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );

    case "SCALE":
      return (
        <>
          <Typography mb={1}>{question.title}</Typography>

          <Rating
            value={typeof value === "number" ? value : 0}
            onChange={(_, newValue) => onChange(question.id, newValue)}
          />
        </>
      );

    case "NPS":
      return (
        <>
          <Typography mb={2}>{question.title}</Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Array.from({ length: 11 }, (_, i) => (
              <Button
                key={i}
                variant={value === i ? "contained" : "outlined"}
                onClick={() => onChange(question.id, i)}
              >
                {i}
              </Button>
            ))}
          </Stack>
        </>
      );

    case "TIME":
      return (
        <TextField
          fullWidth
          type="time"
          label={question.title}
          value={value || ""}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => onChange(question.id, e.target.value)}
        />
      );

    case "DATETIME":
      return (
        <TextField
          fullWidth
          type="datetime-local"
          label={question.title}
          value={value || ""}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => onChange(question.id, e.target.value)}
        />
      );

    case "MULTISELECT":
      return (
        <Select
          multiple
          fullWidth
          value={Array.isArray(value) ? value : []}
          input={<OutlinedInput />}
          onChange={(e) => onChange(question.id, e.target.value)}
          displayEmpty
        >
          {question.options?.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      );

    case "MATRIX":
      return (
        <Stack spacing={2}>
          <Typography>{question.title}</Typography>

          {question.matrixRows?.map((row) => (
            <Box
              key={row.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography sx={{ flex: 1 }}>{row.label}</Typography>

              <TextField
                type="number"
                size="small"
                value={String(valueRecord[row.id] ?? "")}
                onChange={(e) =>
                  onChange(question.id, {
                    ...valueRecord,
                    [row.id]: e.target.value,
                  })
                }
                inputProps={{
                  min: question.minValue,
                  max: question.maxValue,
                }}
              />
            </Box>
          ))}
        </Stack>
      );

    case "COMPOSITE":
      console.log("🟣 COMPOSITE ENTREVISTADOR:", question);

      return (
        <Stack spacing={2}>
          <Typography fontWeight="bold">{question.title}</Typography>

          {question.compositeFields?.map((field) => {
            console.log("🟢 CAMPO COMPOSITE:", field);

            const fieldValue = value?.[field.id] ?? "";

            // Si tiene label usamos label.
            // Si label está vacío usamos helpText.
            const fieldLabel = field.helpText || field.label || "";

            switch (field.type) {
              case "SHORT_TEXT":
                return (
                  <TextField
                    key={field.id}
                    fullWidth
                    label={fieldLabel}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={fieldValue}
                    onChange={(e) =>
                      onChange(question.id, {
                        ...valueRecord,
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
                    placeholder={field.placeholder}
                    required={field.required}
                    value={fieldValue}
                    onChange={(e) =>
                      onChange(question.id, {
                        ...valueRecord,
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
                      onChange(question.id, {
                        ...valueRecord,
                        [field.id]: e.target.value,
                      })
                    }
                  />
                );

              case "EMAIL":
                return (
                  <TextField
                    key={field.id}
                    fullWidth
                    type="email"
                    label={fieldLabel}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={fieldValue}
                    onChange={(e) =>
                      onChange(question.id, {
                        ...valueRecord,
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
                    placeholder={field.placeholder}
                    required={field.required}
                    value={fieldValue}
                    onChange={(e) =>
                      onChange(question.id, {
                        ...valueRecord,
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
                      onChange(question.id, {
                        ...valueRecord,
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
                      onChange(question.id, {
                        ...valueRecord,
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
                      onChange(question.id, {
                        ...valueRecord,
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
                        onChange(question.id, {
                          ...valueRecord,
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
                        (option): option is string =>
                          typeof option === "string",
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

                                onChange(question.id, {
                                  ...valueRecord,
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
                      onChange(question.id, {
                        ...valueRecord,
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
                  <Select
                    key={field.id}
                    multiple
                    fullWidth
                    value={fieldValue ?? []}
                    input={<OutlinedInput />}
                    onChange={(e) =>
                      onChange(question.id, {
                        ...valueRecord,
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
                );

              case "SCALE":
                return (
                  <Box key={field.id}>
                    <Typography mb={1}>{fieldLabel}</Typography>

                    <Rating
                      value={fieldValue || 0}
                      onChange={(_, newValue) =>
                        onChange(question.id, {
                          ...valueRecord,
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
                            onChange(question.id, {
                              ...valueRecord,
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
        </Stack>
      );

    default:
      return <div>Tipo "{question.type}" todavía no implementado.</div>;
  }
}
