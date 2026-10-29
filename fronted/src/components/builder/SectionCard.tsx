import {
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  Button,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { Section } from "../../types/builder";
import { useCreateQuestion } from "../../hooks/useCreateQuestion";
import { useEffect, useState } from "react";
import { useUpdateSection } from "../../hooks/useUpdateSection";
import { useDeleteSection } from "../../hooks/useDeleteSection";
import { useDebounce } from "../../hooks/useDebounce";

import DeleteIcon from "@mui/icons-material/Delete";
import QuestionTypeDialog from "./QuestionTypeDialog";
import SortableQuestion from "./SortableQuestion";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useDuplicateSection } from "../../hooks/useDuplicateSection";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useReorderQuestions } from "../../hooks/useReorderQuestions";
import type { SvgIconProps } from "@mui/material";
import { useSnackbar } from "notistack";

interface Props {
  section: Section;
  dragHandle?: SvgIconProps;
}

export default function SectionCard({ section, dragHandle }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [description, setDescription] = useState(section.description ?? "");

  const debouncedTitle = useDebounce(title, 500);

  const debouncedDescription = useDebounce(description, 500);

  const updateSectionMutation = useUpdateSection();

  const deleteSectionMutation = useDeleteSection();
  const duplicateSectionMutation = useDuplicateSection();

  const mutation = useCreateQuestion();
  const reorderMutation = useReorderQuestions();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (
      debouncedTitle === section.title &&
      debouncedDescription === (section.description ?? "")
    ) {
      return;
    }

    updateSectionMutation.mutate({
      id: section.id,
      data: {
        title: debouncedTitle,
        description: debouncedDescription,
      },
    });
  }, [
    debouncedTitle,
    debouncedDescription,
    section.id,
    section.title,
    section.description,
    updateSectionMutation,
  ]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id === over.id) return;

    const oldIndex = section.questions.findIndex((q) => q.id === active.id);
    const newIndex = section.questions.findIndex((q) => q.id === over.id);

    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(section.questions, oldIndex, newIndex);

    reorderMutation.mutate(
      reordered.map((question, index) => ({
        id: question.id,
        order: index,
      })),
      {
        onError: () =>
          enqueueSnackbar("No se pudo guardar el nuevo orden de las preguntas.", {
            variant: "error",
          }),
      },
    );
  }

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack flex={1}>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="standard"
              fullWidth
              placeholder="Título de la sección"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: 24,
                  fontWeight: "bold",
                },
              }}
            />

            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="standard"
              fullWidth
              placeholder="Descripción"
              multiline
              InputProps={{
                disableUnderline: true,
              }}
              sx={{ mt: 1 }}
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <DragIndicatorIcon
              sx={{
                cursor: "grab",
                color: "text.secondary",
              }}
              {...dragHandle}
            />

            <IconButton
              onClick={() => duplicateSectionMutation.mutate(section.id)}
            >
              <ContentCopyIcon />
            </IconButton>

            <IconButton color="error" onClick={() => setDeleteDialogOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Divider sx={{ my: 3 }} />

        {section.questions.length === 0 && (
          <Typography color="text.secondary">
            Esta sección todavía no tiene preguntas.
          </Typography>
        )}

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={section.questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {section.questions.map((question) => (
              <SortableQuestion
                key={question.id}
                question={question}
                questions={section.questions}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          sx={{ mt: 2 }}
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Agregar pregunta
        </Button>

        <QuestionTypeDialog
          open={open}
          onClose={() => setOpen(false)}
          onSelect={(type) => {
            mutation.mutate({
              sectionId: section.id,
              title: "Nueva pregunta",
              type,
              order: 0,
            });

            setOpen(false);
          }}
        />
      </CardContent>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>¿Eliminar sección?</DialogTitle>

        <DialogContent>
          <Typography>Esta sección contiene preguntas.</Typography>

          <Typography sx={{ mt: 1 }}>
            Si la eliminás, también se eliminarán todas sus preguntas y
            opciones.
          </Typography>

          <Typography sx={{ mt: 2 }} fontWeight="bold">
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              deleteSectionMutation.mutate(section.id);
              setDeleteDialogOpen(false);
            }}
          >
            Eliminar sección
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
