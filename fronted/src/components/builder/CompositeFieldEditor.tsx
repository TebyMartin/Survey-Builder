import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import type { CompositeField, QuestionType } from "../../types/surveys";

interface Props {
  fields: CompositeField[];
  onChange: (fields: CompositeField[]) => void;
}

const fieldTypes: { label: string; value: QuestionType }[] = [
  { label: "Texto corto", value: "SHORT_TEXT" },
  { label: "Texto largo", value: "LONG_TEXT" },
  { label: "Número", value: "NUMBER" },
  { label: "Email", value: "EMAIL" },
  { label: "Teléfono", value: "PHONE" },
  { label: "Fecha", value: "DATE" },
  { label: "Hora", value: "TIME" },
  { label: "Fecha y hora", value: "DATETIME" },
  { label: "Radio", value: "RADIO" },
  { label: "Checkbox", value: "CHECKBOX" },
  { label: "Select", value: "SELECT" },
  { label: "Multi Select", value: "MULTISELECT" },
  { label: "Escala", value: "SCALE" },
  { label: "NPS", value: "NPS" },
];

const optionTypes = ["RADIO", "CHECKBOX", "SELECT", "MULTISELECT"];

export default function CompositeFieldEditor({ fields, onChange }: Props) {
  // =========================
  // CAMPOS
  // =========================

  const addField = () => {
    const newField: CompositeField = {
      // NO ponemos id.
      // Prisma lo genera cuando se crea en la BD.
      label: "Nuevo campo",
      type: "SHORT_TEXT",
      required: true,
      order: fields.length,
    };

    onChange([...fields, newField]);
  };

  const updateField = (
    fieldIndex: number,
    changes: Partial<CompositeField>,
  ) => {
    onChange(
      fields.map((field, index) =>
        index === fieldIndex
          ? {
              ...field,
              ...changes,
            }
          : field,
      ),
    );
  };

  const removeField = (fieldIndex: number) => {
    const updatedFields = fields
      .filter((_, index) => index !== fieldIndex)
      .map((field, index) => ({
        ...field,
        order: index,
      }));

    onChange(updatedFields);
  };

  // =========================
  // OPCIONES
  // =========================

  const addOption = (field: CompositeField, fieldIndex: number) => {
    const options = field.options ?? [];

    updateField(fieldIndex, {
      options: [
        ...options,
        {
          label: `Opción ${options.length + 1}`,
          value: `opcion_${options.length + 1}`,
          order: options.length,
        },
      ],
    });
  };

  const updateOption = (
    field: CompositeField,
    fieldIndex: number,
    optionIndex: number,
    label: string,
  ) => {
    updateField(fieldIndex, {
      options: (field.options ?? []).map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              label,
            }
          : option,
      ),
    });
  };

  const removeOption = (
    field: CompositeField,
    fieldIndex: number,
    optionIndex: number,
  ) => {
    const updatedOptions = (field.options ?? [])
      .filter((_, index) => index !== optionIndex)
      .map((option, index) => ({
        ...option,
        order: index,
      }));

    updateField(fieldIndex, {
      options: updatedOptions,
    });
  };

  // =========================
  // RENDER
  // =========================

  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: "grey.50",
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Campos de la pregunta compleja
          </Typography>

          {fields.map((field, fieldIndex) => {
            const needsOptions = optionTypes.includes(field.type);

            return (
              <Card
                key={field.id ?? `new-field-${fieldIndex}`}
                variant="outlined"
              >
                <CardContent>
                  <Stack spacing={2}>
                    {/* =========================
                        HEADER DEL CAMPO
                    ========================= */}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight="bold">
                        Campo {fieldIndex + 1}
                      </Typography>

                      <IconButton
                        color="error"
                        onClick={() => removeField(fieldIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>

                    {/* =========================
                        NOMBRE
                    ========================= */}

                    <TextField
                      label="Nombre del campo"
                      value={field.label}
                      onChange={(e) =>
                        updateField(fieldIndex, {
                          label: e.target.value,
                        })
                      }
                      fullWidth
                    />

                    {/* =========================
                        TIPO
                    ========================= */}

                    <TextField
                      select
                      label="Tipo"
                      value={field.type}
                      onChange={(e) => {
                        const type = e.target.value as QuestionType;

                        updateField(fieldIndex, {
                          type,

                          options: optionTypes.includes(type)
                            ? field.options ?? []
                            : undefined,
                        });
                      }}
                      fullWidth
                    >
                      {fieldTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    {/* =========================
                        PLACEHOLDER
                    ========================= */}

                    <TextField
                      label="Placeholder"
                      value={field.placeholder ?? ""}
                      onChange={(e) =>
                        updateField(fieldIndex, {
                          placeholder: e.target.value,
                        })
                      }
                      fullWidth
                    />

                    {/* =========================
                        AYUDA
                    ========================= */}

                    <TextField
                      label="Ayuda"
                      value={field.helpText ?? ""}
                      onChange={(e) =>
                        updateField(fieldIndex, {
                          helpText: e.target.value,
                        })
                      }
                      fullWidth
                    />

                    {/* =========================
                        OBLIGATORIO
                    ========================= */}

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.required}
                          onChange={(e) =>
                            updateField(fieldIndex, {
                              required: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Campo obligatorio"
                    />

                    {/* =========================
                        OPCIONES
                    ========================= */}

                    {needsOptions && (
                      <Stack spacing={1}>
                        <Typography fontWeight="bold">Opciones</Typography>

                        {(field.options ?? []).map((option, optionIndex) => (
                          <Stack
                            key={`option-${fieldIndex}-${optionIndex}`}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <TextField
                              size="small"
                              label="Opción"
                              value={option.label}
                              onChange={(e) =>
                                updateOption(
                                  field,
                                  fieldIndex,
                                  optionIndex,
                                  e.target.value,
                                )
                              }
                              fullWidth
                            />

                            <IconButton
                              color="error"
                              onClick={() =>
                                removeOption(field, fieldIndex, optionIndex)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        ))}

                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => addOption(field, fieldIndex)}
                        >
                          Agregar opción
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}

          {/* =========================
              AGREGAR CAMPO
          ========================= */}

          <Button variant="outlined" startIcon={<AddIcon />} onClick={addField}>
            Agregar campo
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
