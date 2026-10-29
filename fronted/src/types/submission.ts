export interface SubmissionAnswerInput {
  questionId: string;
  value?: string;
  options?: string[];
  matrix?: {
    rowId: string;
    value: string;
  }[];
  composite?: {
    fieldId: string;
    value: string;
  }[];
}