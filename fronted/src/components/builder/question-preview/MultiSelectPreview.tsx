import QuestionOptionsEditor from "./QuestionOptionsEditor";

interface Props {
  question: any;
}

export default function MultiSelectPreview({ question }: Props) {
  return <QuestionOptionsEditor question={question} />;
}
