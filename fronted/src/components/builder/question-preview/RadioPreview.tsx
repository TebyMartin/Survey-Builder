import QuestionOptionsEditor from "./QuestionOptionsEditor";
import type { Question } from "../../../types/builder";

export default function RadioPreview({ question }: { question: Question }) {
  return <QuestionOptionsEditor question={question} />;
}
