import TextQuestion from "./question/TextQuestion";
import TextAreaQuestion from "./question/TextAreaQuestion";
import NumberQuestion from "./question/NumberQuestion";
import DateQuestion from "./question/DateQuestion";
import TimeQuestion from "./question/TimeQuestion";
import RadioQuestion from "./question/RadioQuestion";
import CheckboxQuestion from "./question/CheckboxQuestion";
import SelectQuestion from "./question/SelectQuestion";
import LinearScaleQuestion from "./question/LinearScaleQuestion";
import RatingQuestion from "./question/RatingQuestion";
import CompositeQuestion from "./question/CompositeQuestion";

import type { SurveyQuestion } from "../../types/surveys";

import MatrixQuestion from "./question/MatrixQuestion";

interface Props {
  question: SurveyQuestion;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

export default function PublicQuestion({
  question,
  value,
  onChange,
  error,
}: Props) {
  switch (question.type) {
    case "LONG_TEXT":
      return (
        <TextAreaQuestion
          question={question}
          value={value}
          onChange={onChange}
          error={error}
        />
      );

    case "NUMBER":
      return (
        <NumberQuestion
          question={question}
          value={value}
          onChange={onChange}
          error={error}
        />
      );

    case "DATE":
      return (
        <DateQuestion
          question={question}
          value={value}
          onChange={onChange}
          error={error}
        />
      );

    case "TIME":
      return (
        <TimeQuestion
          question={question}
          value={value}
          onChange={onChange}
          error={error}
        />
      );

    case "DATETIME":
      return (
        <DateQuestion
          question={question}
          value={value}
          type="datetime-local"
          onChange={onChange}
          error={error}
        />
      );

    case "RADIO":
      return (
        <RadioQuestion
          question={question}
          value={value}
          onChange={onChange}
          error={error}
        />
      );

    case "CHECKBOX":
      return (
        <CheckboxQuestion
          question={question}
          value={
            value && typeof value === "object" && !Array.isArray(value)
              ? value
              : {
                  options: Array.isArray(value) ? value : [],
                  otherText: "",
                }
          }
          onChange={onChange}
          error={error}
        />
      );

    case "SELECT":
      return (
        <SelectQuestion
          question={question}
          value={(value as string) ?? ""}
          onChange={onChange}
          error={error}
        />
      );

    case "MULTISELECT":
      return (
        <CheckboxQuestion
          question={question}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          error={error}
        />
      );

    case "SHORT_TEXT":
      return (
        <TextQuestion
          question={question}
          value={value as string}
          onChange={onChange}
          error={error}
        />
      );

    case "EMAIL":
      return (
        <TextQuestion
          question={question}
          value={value as string}
          type="email"
          onChange={onChange}
          error={error}
        />
      );

    case "PHONE":
      return (
        <TextQuestion
          question={question}
          value={value as string}
          type="tel"
          onChange={onChange}
          error={error}
        />
      );

    case "SCALE":
      return (
        <LinearScaleQuestion
          question={question}
          value={(value as string) ?? ""}
          onChange={onChange}
          error={error}
        />
      );

    case "NPS":
      return (
        <RatingQuestion
          question={question}
          value={(value as string) ?? ""}
          onChange={onChange}
          error={error}
        />
      );

    case "MATRIX":
      return (
        <MatrixQuestion
          question={question}
          value={value}
          onChange={onChange}
          error={error}
        />
      );

    case "COMPOSITE":
      return (
        <CompositeQuestion
          question={question}
          value={value}
          onChange={onChange}
          error={error}
        />
      );

    default:
      return <div>Tipo no soportado: {question.type}</div>;
  }
}
