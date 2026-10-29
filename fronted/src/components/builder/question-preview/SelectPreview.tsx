import QuestionOptionsEditor from "./QuestionOptionsEditor";

interface Props {
  question: any;
}

export default function SelectPreview({ question }: Props) {
  return <QuestionOptionsEditor question={question} />;
}
