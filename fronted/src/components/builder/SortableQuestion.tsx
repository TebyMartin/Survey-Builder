import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import QuestionCard from "./QuestionCard";

interface Props {
  question: any;
  questions?: any[];
}

export default function SortableQuestion({ question, questions = [] }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: question.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <QuestionCard
        question={question}
        questions={questions}
        dragHandle={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}
