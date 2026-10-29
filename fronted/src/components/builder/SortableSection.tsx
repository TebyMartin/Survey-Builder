import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import SectionCard from "./SectionCard";
import type { Section } from "../../types/builder";

interface Props {
  section: Section;
}

export default function SortableSection({ section }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: section.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionCard
        section={section}
        dragHandle={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}
