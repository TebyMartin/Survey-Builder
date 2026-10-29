import { Stack, Button, TextField, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useCreateQuestionMatrixRow } from "../../../hooks/useCreateQuestionMatrixRow";
import { useUpdateQuestionMatrixRow } from "../../../hooks/useUpdateQuestionMatrixRow";
import { useDeleteQuestionMatrixRow } from "../../../hooks/useDeleteQuestionMatrixRow";
import type { Question } from "../../../types/builder";

interface Props {
  question: Question;
}

export default function QuestionMatrixRowsEditor({ question }: Props) {
  const createMutation = useCreateQuestionMatrixRow();
  const updateMutation = useUpdateQuestionMatrixRow();
  const deleteMutation = useDeleteQuestionMatrixRow();

  const rows = question.matrixRows ?? [];

  return (
    <Stack spacing={2} mt={2}>
      {rows.map((row, index) => (
        <Stack key={row.id} direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            size="small"
            label={`Fila ${index + 1}`}
            value={row.label}
            onChange={(e) =>
              updateMutation.mutate({
                id: row.id,
                label: e.target.value,
              })
            }
          />

          <IconButton
            color="error"
            onClick={() => deleteMutation.mutate(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          createMutation.mutate({
            questionId: question.id,
            label: `Fila ${rows.length + 1}`,
            order: rows.length + 1,
          })
        }
      >
        Agregar fila
      </Button>
    </Stack>
  );
}
