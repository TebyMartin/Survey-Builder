import QuestionOptionsEditor from "./QuestionOptionsEditor";
import type { Question } from "../../../types/builder";

interface Props {
  question: Question;
}

export default function SelectPreview({ question }: Props) {
  return <QuestionOptionsEditor question={question} />;
}
