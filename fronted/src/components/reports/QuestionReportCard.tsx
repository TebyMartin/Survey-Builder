import ChoiceSummary from "./question-types/ChoiceSummury";
import DateSummary from "./question-types/DateSumary";
import EmailSummary from "./question-types/EmailSumary";
import NpsSummary from "./question-types/NpsSummary";
import NumberSummary from "./question-types/NumberSumary";
import TextSummary from "./question-types/TextSummary";
import type { QuestionSummary } from "../../types/report";
import MatrixSummary from "./question-types/MatrixSumary";
import CompositeSummary from "./question-types/CompositeSummary";

interface Props {
  question: QuestionSummary;
}

export default function QuestionReportCard({ question }: Props) {
  switch (question.type) {
    case "SHORT_TEXT":
    case "LONG_TEXT":
      return <TextSummary question={question} />;

    case "EMAIL":
      return <EmailSummary question={question} />;

    case "NUMBER":
      return <NumberSummary question={question} />;

    case "DATE":
      return <DateSummary question={question} />;

    case "SELECT":
    case "RADIO":
    case "CHECKBOX":
    case "MULTISELECT":
    case "SCALE":
      return <ChoiceSummary question={question} />;

    case "NPS":
      return <NpsSummary question={question} />;

    case "MATRIX":
      return <MatrixSummary question={question} />;

    case "COMPOSITE":
      return <CompositeSummary question={question} />;

    default:
      return null;
  }
}
