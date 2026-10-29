import {
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

interface Props {
  question: any;
}

export default function PreviewQuestion({ question }: Props) {
  return (
    <Stack spacing={1}>
      <Typography fontWeight="bold">
        {question.title}

        {question.required && (
          <Typography component="span" color="error">
            {" *"}
          </Typography>
        )}
      </Typography>

      {question.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: "pre-line",
            lineHeight: 1.5,
            mb: 1,
          }}
        >
          {question.description}
        </Typography>
      )}

      {renderQuestion(question)}
    </Stack>
  );
}

function renderQuestion(question: any) {
  switch (question.type) {
    case "SHORT_TEXT":
      return <TextField fullWidth placeholder={question.placeholder} />;

    case "LONG_TEXT":
      return (
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder={question.placeholder}
        />
      );

    case "NUMBER":
      return <TextField fullWidth type="number" />;

    case "EMAIL":
      return <TextField fullWidth type="email" />;

    case "PHONE":
      return <TextField fullWidth type="tel" />;

    case "DATE":
      return (
        <TextField
          fullWidth
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
        />
      );

    case "RADIO":
      return (
        <RadioGroup>
          {question.options.map((option: any) => (
            <FormControlLabel
              key={option.id}
              value={option.label}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      );

    case "CHECKBOX":
      return (
        <Stack>
          {question.options.map((option: any) => (
            <FormControlLabel
              key={option.id}
              control={<Checkbox />}
              label={option.label}
            />
          ))}
        </Stack>
      );

    case "SELECT":
      return (
        <Select fullWidth displayEmpty defaultValue="">
          <MenuItem value="">Seleccione una opción</MenuItem>

          {question.options.map((option: any) => (
            <MenuItem key={option.id} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      );

    case "MATRIX":
      return (
        <Stack spacing={2}>
          {question.matrixRows?.map((row: any) => (
            <Stack key={row.id} direction="row" spacing={2} alignItems="center">
              <Typography sx={{ flex: 1 }}>{row.label}</Typography>

              <TextField
                type="number"
                size="small"
                placeholder="0"
                inputProps={{
                  min: question.minValue,
                  max: question.maxValue,
                }}
                sx={{ width: 120 }}
              />
            </Stack>
          ))}
        </Stack>
      );

    case "COMPOSITE":
      return (
        <Stack spacing={3}>
          {question.compositeFields
            ?.slice()
            .sort((a: any, b: any) => a.order - b.order)
            .map((field: any) => (
              <Stack key={field.id} spacing={1}>
                <Typography fontWeight="medium">
                  {field.label}

                  {field.required && (
                    <Typography component="span" color="error">
                      {" *"}
                    </Typography>
                  )}
                </Typography>

                {field.helpText && (
                  <Typography variant="body2" color="text.secondary">
                    {field.helpText}
                  </Typography>
                )}

                {renderCompositeField(field)}
              </Stack>
            ))}
        </Stack>
      );
      function renderCompositeField(field: any) {
        switch (field.type) {
          case "SHORT_TEXT":
            return (
              <TextField
                fullWidth
                placeholder={field.placeholder || ""}
                defaultValue={field.defaultValue || ""}
              />
            );

          case "LONG_TEXT":
            return (
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={field.placeholder || ""}
                defaultValue={field.defaultValue || ""}
              />
            );

          case "NUMBER":
            return (
              <TextField
                fullWidth
                type="number"
                placeholder={field.placeholder || ""}
                defaultValue={field.defaultValue || ""}
                inputProps={{
                  min: field.minValue,
                  max: field.maxValue,
                }}
              />
            );

          case "EMAIL":
            return (
              <TextField
                fullWidth
                type="email"
                placeholder={field.placeholder || ""}
                defaultValue={field.defaultValue || ""}
              />
            );

          case "PHONE":
            return (
              <TextField
                fullWidth
                type="tel"
                placeholder={field.placeholder || ""}
                defaultValue={field.defaultValue || ""}
              />
            );

          case "DATE":
            return (
              <TextField
                fullWidth
                type="date"
                defaultValue={field.defaultValue || ""}
                InputLabelProps={{ shrink: true }}
              />
            );

          case "TIME":
            return (
              <TextField
                fullWidth
                type="time"
                defaultValue={field.defaultValue || ""}
                InputLabelProps={{ shrink: true }}
              />
            );

          case "DATETIME":
            return (
              <TextField
                fullWidth
                type="datetime-local"
                defaultValue={field.defaultValue || ""}
                InputLabelProps={{ shrink: true }}
              />
            );

          case "RADIO":
            return (
              <RadioGroup>
                {field.options?.map((option: any) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.label}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            );

          case "CHECKBOX":
            return (
              <Stack>
                {field.options?.map((option: any) => (
                  <FormControlLabel
                    key={option.id}
                    control={<Checkbox />}
                    label={option.label}
                  />
                ))}
              </Stack>
            );

          case "SELECT":
            return (
              <Select fullWidth displayEmpty defaultValue="">
                <MenuItem value="">Seleccione una opción</MenuItem>

                {field.options?.map((option: any) => (
                  <MenuItem key={option.id} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            );

          case "MULTISELECT":
            return (
              <Stack>
                {field.options?.map((option: any) => (
                  <FormControlLabel
                    key={option.id}
                    control={<Checkbox />}
                    label={option.label}
                  />
                ))}
              </Stack>
            );

          case "SCALE":
            return (
              <TextField
                fullWidth
                type="number"
                inputProps={{
                  min: field.minValue,
                  max: field.maxValue,
                }}
              />
            );

          case "NPS":
            return (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {Array.from({ length: 11 }, (_, i) => (
                  <FormControlLabel
                    key={i}
                    value={i}
                    control={<Radio />}
                    label={String(i)}
                  />
                ))}
              </Stack>
            );

          default:
            return (
              <TextField
                fullWidth
                disabled
                value="Tipo de campo no implementado"
              />
            );
        }
      }

    default:
      return (
        <TextField
          fullWidth
          disabled
          value="Tipo de pregunta no implementado"
        />
      );
  }
}
