import { IconButton, Stack, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { useEffect } from "react";
import { useUpdateQuestionOption } from "../../../hooks/useUpdateQuestionOption";
import { useDeleteQuestionOption } from "../../../hooks/useDeleteQuestionOption";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { SurveyOption } from "../../../types/surveys";
import type { SvgIconProps } from "@mui/material";

interface Props {
  option: SurveyOption;
  dragHandle?: SvgIconProps;
}

export default function QuestionOptionItem({ option, dragHandle }: Props) {
  const [label, setLabel] = useState(option.label);

  const debounced = useDebounce(label, 500);

  const { mutate: updateOption } = useUpdateQuestionOption();

  const deleteMutation = useDeleteQuestionOption();

  useEffect(() => {
    if (debounced === option.label) return;

    updateOption({
      id: option.id,
      label: debounced,
    });
  }, [debounced, option.id, option.label, updateOption]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <DragIndicatorIcon
        sx={{
          cursor: "grab",
          color: "text.secondary",
        }}
        {...dragHandle}
      />

      <TextField
        fullWidth
        size="small"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />

      <IconButton
        color="error"
        onClick={() => deleteMutation.mutate(option.id)}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
}
