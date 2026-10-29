import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";

import BuilderHeader from "../../components/builder/BuilderHeader";
import BuilderToolbar from "../../components/builder/BuilderToolbar";
import EmptyBuilder from "../../components/builder/EmptyBuilder";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableSection from "../../components/builder/SortableSection";

import { useReorderSections } from "../../hooks/useReorderSections";
import { useBuilder } from "../../hooks/useBuilder";
import type { Section } from "../../types/builder";

export default function SurveyBuilder() {
  const { id } = useParams();

  if (!id) {
    return <Typography>No se encontró la encuesta.</Typography>;
  }

  return <SurveyBuilderContent key={id} id={id} />;
}

function SurveyBuilderContent({ id }: { id: string }) {
  const { data, isLoading } = useBuilder(id);
  const [reorderedSections, setReorderedSections] = useState<Section[] | null>(
    null,
  );
  const sections = reorderedSections ?? data?.sections ?? [];
  const reorderMutation = useReorderSections();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!data) {
    return <Typography>No se encontró la encuesta.</Typography>;
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    if (active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);

    const newIndex = sections.findIndex((s) => s.id === over.id);

    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(sections, oldIndex, newIndex);

    setReorderedSections(reordered);

    reorderMutation.mutate(
      reordered.map((section, index) => ({
        id: section.id,
        order: index,
      })),
    );
  }
  return (
    <Box
      sx={{
        maxWidth: 900,
        margin: "0 auto",
        pb: 8,
      }}
    >
      <BuilderHeader />
      <Typography variant="h4" fontWeight="bold" mb={1}>
        {data.title}
      </Typography>

      <Typography color="text.secondary" mb={4}>
        {data.description}
      </Typography>
      <BuilderToolbar />

      {data.sections.length === 0 ? (
        <EmptyBuilder />
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SortableSection key={section.id} section={section} />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </Box>
  );
}
