import QuestionOptionsEditor from "./QuestionOptionsEditor";
import type { Question } from "../../../types/builder";

interface Props {
  question: Question;
}

export default function MultiSelectPreview({ question }: Props) {
  return <QuestionOptionsEditor question={question} />;
}
