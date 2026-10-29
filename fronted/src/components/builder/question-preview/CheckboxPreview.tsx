import QuestionOptionsEditor from "./QuestionOptionsEditor";

interface Props {
  question: any;
}

export default function CheckboxPreview({ question }: Props) {
  return <QuestionOptionsEditor question={question} />;
}
