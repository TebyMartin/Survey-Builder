import { useState } from "react";
import {
  Stack,
  Button,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useReorderQuestionOption } from "../../../hooks/useReorderQuestionOption";
import { useCreateQuestionOption } from "../../../hooks/useCreateQuestionOption";
import { useUpdateQuestionOption } from "../../../hooks/useUpdateQuestionOption";
import { useDeleteQuestionOption } from "../../../hooks/useDeleteQuestionOption";
import QuestionMatrixRowsEditor from "./QuestionMatrixRowsEditor.tsxQuestionMatrixRowsEditor";
import type { Question } from "../../../types/builder";

interface Props {
  question: Question;
}

export default function QuestionOptionsEditor({ question }: Props) {
  const createMutation = useCreateQuestionOption();
  const updateMutation = useUpdateQuestionOption();
  const deleteMutation = useDeleteQuestionOption();
  const reorderMutation = useReorderQuestionOption();
  const options = question.options ?? [];

  async function moveOption(from: number, to: number) {
    if (to < 0 || to >= options.length) return;

    await reorderMutation.mutateAsync({
      questionId: question.id,
      from,
      to,
    });
  }
  if (question.type === "MATRIX") {
    return <QuestionMatrixRowsEditor question={question} />;
  }
  return (
    <Stack spacing={2} mt={2}>
      {options.map((option) => (
        <OptionRow
          key={option.id}
          option={option}
          questionType={question.type}
          onSave={(label) =>
            updateMutation.mutate({
              id: option.id,
              label,
            })
          }
          onToggleOther={(checked) =>
            updateMutation.mutate({
              id: option.id,
              isOther: checked,
            })
          }
          onDelete={() => deleteMutation.mutate(option.id)}
          onMoveUp={() => moveOption(option.order, option.order - 1)}
          onMoveDown={() => moveOption(option.order, option.order + 1)}
        />
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          createMutation.mutate({
            questionId: question.id,
            label: `Opción ${options.length + 1}`,
            order: options.length,
          })
        }
      >
        Agregar opción
      </Button>
    </Stack>
  );
}

function OptionRow({
  option,
  questionType,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleOther,
}: {
  option: NonNullable<Question["options"]>[number];
  questionType: string;
  onSave: (label: string) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleOther: (checked: boolean) => void;
}) {
  const [label, setLabel] = useState(option.label);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        fullWidth
        size="small"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => {
          if (label !== option.label) {
            onSave(label);
          }
        }}
      />

      {questionType === "CHECKBOX" && (
        <FormControlLabel
          control={
            <Checkbox
              checked={option.isOther ?? false}
              onChange={(e) => onToggleOther(e.target.checked)}
            />
          }
          label="Otro"
        />
      )}

      <IconButton color="error" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>

      <IconButton onClick={onMoveUp}>
        <KeyboardArrowUpIcon />
      </IconButton>

      <IconButton onClick={onMoveDown}>
        <KeyboardArrowDownIcon />
      </IconButton>
    </Stack>
  );
}
