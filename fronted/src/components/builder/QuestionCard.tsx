import {
  Card,
  CardContent,
  Checkbox,
  MenuItem,
  Stack,
  TextField,
  IconButton,
  FormControlLabel,
} from "@mui/material";
import { Tooltip } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useEffect, useState } from "react";

import { useUpdateQuestion } from "../../hooks/useUpdateQuestion";
import { useDeleteQuestion } from "../../hooks/useDeleteQuestion";
import { useDuplicateQuestion } from "../../hooks/useDuplicateQuestion";
import { useDebounce } from "../../hooks/useDebounce";
import CompositeFieldEditor from "./CompositeFieldEditor";
import QuestionPreview from "./QuestionPreview";

interface Props {
  question: any;
  questions?: any[];
  dragHandle?: any;
}

const questionTypes = [
  {
    label: "Texto corto",
    value: "SHORT_TEXT",
  },
  {
    label: "Texto largo",
    value: "LONG_TEXT",
  },
  {
    label: "Número",
    value: "NUMBER",
  },
  {
    label: "Email",
    value: "EMAIL",
  },
  {
    label: "Teléfono",
    value: "PHONE",
  },
  {
    label: "Fecha",
    value: "DATE",
  },
  {
    label: "Hora",
    value: "TIME",
  },
  {
    label: "Fecha y hora",
    value: "DATETIME",
  },
  {
    label: "Radio",
    value: "RADIO",
  },
  {
    label: "Checkbox",
    value: "CHECKBOX",
  },
  {
    label: "Select",
    value: "SELECT",
  },
  // {
  //   label: "Multi Select",
  //   value: "MULTISELECT",
  // },
  {
    label: "Escala",
    value: "SCALE",
  },
  // {
  //   label: "NPS",
  //   value: "NPS",
  // },
  // {
  //   label: "Archivo",
  //   value: "FILE",
  // },
  // {
  //   label: "Imagen",
  //   value: "IMAGE",
  // },
  // {
  //   label: "GPS",
  //   value: "GPS",
  // },
  // {
  //   label: "Firma",
  //   value: "SIGNATURE",
  // },
  {
    label: "Matriz",
    value: "MATRIX",
  },
  {
    label: "Pregunta compleja",
    value: "COMPOSITE",
  },
];

export default function QuestionCard({
  question,
  questions = [],
  dragHandle,
}: Props) {
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description || "");
  const [showWhenQuestionId, setShowWhenQuestionId] = useState(
    question.showWhenQuestionId || "",
  );

  const [showWhenValue, setShowWhenValue] = useState(
    question.showWhenValue || "",
  );
  const debouncedTitle = useDebounce(title, 500);

  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();
  console.log(deleteMutation);

  const duplicateMutation = useDuplicateQuestion();

  useEffect(() => {
    if (debouncedTitle === question.title) return;

    updateMutation.mutate({
      id: question.id,
      data: {
        title: debouncedTitle,
      },
    });
  }, [debouncedTitle]);

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Pregunta"
            fullWidth
          />
          <TextField
            value={description}
            onChange={(e) => {
              const value = e.target.value;

              setDescription(value);

              updateMutation.mutate({
                id: question.id,
                data: {
                  description: value,
                },
              });
            }}
            label="Subpregunta o indicaciones"
            placeholder="Escribí una aclaración o indicación..."
            multiline
            minRows={2}
            fullWidth
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "grey.50",
              },
              "& .MuiInputBase-input": {
                color: "text.secondary",
                fontSize: "0.9rem",
              },
              "& .MuiInputLabel-root": {
                color: "text.secondary",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "text.secondary",
              },
            }}
          />

          <TextField
            select
            value={question.type}
            onChange={(e) =>
              updateMutation.mutate({
                id: question.id,
                data: {
                  type: e.target.value,
                },
              })
            }
          >
            {questionTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>

          <QuestionPreview
            question={{
              ...question,
              description,
            }}
          />

          {question.type === "COMPOSITE" && (
            <CompositeFieldEditor
              fields={question.compositeFields ?? []}
              onChange={(fields) => {
                const fieldsToSave = fields.map((field) => ({
                  ...field,
                  required: true,
                }));

                console.log("🚨 COMPOSITE QUE VOY A GUARDAR:", fieldsToSave);

                updateMutation.mutate({
                  id: question.id,
                  data: {
                    compositeFields: fieldsToSave,
                  },
                });
              }}
            />
          )}

          {questions.length > 1 && (
            <Card
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "grey.50",
              }}
            >
              <Stack spacing={2}>
                <TextField
                  select
                  label="Mostrar esta pregunta cuando..."
                  value={showWhenQuestionId}
                  onChange={(e) => {
                    const value = e.target.value;

                    setShowWhenQuestionId(value);

                    updateMutation.mutate({
                      id: question.id,
                      data: {
                        showWhenQuestionId: value || null,
                        showWhenValue: null,
                      },
                    });

                    setShowWhenValue("");
                  }}
                  fullWidth
                >
                  <MenuItem value="">Siempre visible</MenuItem>

                  {questions
                    .filter((q: any) => q.id !== question.id)
                    .map((q: any) => (
                      <MenuItem key={q.id} value={q.id}>
                        {q.title}
                      </MenuItem>
                    ))}
                </TextField>

                {showWhenQuestionId &&
                  (() => {
                    const controllingQuestion = questions.find(
                      (q: any) => q.id === showWhenQuestionId,
                    );

                    const optionTypes = [
                      "RADIO",
                      "SELECT",
                      "CHECKBOX",
                      "MULTISELECT",
                      "NPS",
                    ];

                    const isOptionQuestion =
                      controllingQuestion &&
                      optionTypes.includes(controllingQuestion.type);

                    if (isOptionQuestion) {
                      return (
                        <TextField
                          select
                          label="Cuando la respuesta sea..."
                          value={showWhenValue}
                          onChange={(e) => {
                            const value = e.target.value;

                            setShowWhenValue(value);

                            updateMutation.mutate({
                              id: question.id,
                              data: {
                                showWhenQuestionId,
                                showWhenValue: value,
                              },
                            });
                          }}
                          fullWidth
                        >
                          {controllingQuestion.options?.map((option: any) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    }

                    return (
                      <TextField
                        label="Cuando la respuesta sea..."
                        value={showWhenValue}
                        onChange={(e) => {
                          const value = e.target.value;

                          setShowWhenValue(value);

                          updateMutation.mutate({
                            id: question.id,
                            data: {
                              showWhenQuestionId,
                              showWhenValue: value,
                            },
                          });
                        }}
                        fullWidth
                      />
                    );
                  })()}
              </Stack>
            </Card>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={question.required}
                onChange={(e) =>
                  updateMutation.mutate({
                    id: question.id,
                    data: {
                      required: e.target.checked,
                    },
                  })
                }
              />
            }
            label="Obligatoria"
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <DragIndicatorIcon
              sx={{
                cursor: "grab",
                color: "text.secondary",
              }}
              {...dragHandle}
            />

            <Stack direction="row">
              <Tooltip title="Duplicar pregunta">
                <IconButton
                  onClick={() => duplicateMutation.mutate(question.id)}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Eliminar pregunta">
                <IconButton
                  color="error"
                  onClick={() => deleteMutation.mutate(question.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
