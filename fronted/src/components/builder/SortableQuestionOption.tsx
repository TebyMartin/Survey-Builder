import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import QuestionOptionItem from "../QuestionOptionItem";

interface Props {
  option: any;
}

export default function SortableQuestionOption({ option }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: option.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <QuestionOptionItem
        option={option}
        dragHandle={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}
