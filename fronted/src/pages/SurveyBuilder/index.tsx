import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import BuilderHeader from "../../components/builder/BuilderHeader";
import BuilderToolbar from "../../components/builder/BuilderToolbar";
import EmptyBuilder from "../../components/builder/EmptyBuilder";
import { useEffect, useState } from "react";

import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableSection from "../../components/builder/SortableSection";

import { useReorderSections } from "../../hooks/useReorderSections";
import { useBuilder } from "../../hooks/useBuilder";

export default function SurveyBuilder() {
  const { id } = useParams();

  const { data, isLoading } = useBuilder(id!);
  const [sections, setSections] = useState<any[]>([]);

  const reorderMutation = useReorderSections();

  useEffect(() => {
    if (data) {
      setSections(data.sections);
    }
  }, [data]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!data) {
    return <Typography>No se encontró la encuesta.</Typography>;
  }
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    if (active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);

    const newIndex = sections.findIndex((s) => s.id === over.id);

    const reordered = arrayMove(sections, oldIndex, newIndex);

    setSections(reordered);

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
