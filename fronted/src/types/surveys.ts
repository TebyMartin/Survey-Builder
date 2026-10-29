export type QuestionType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "NUMBER"
  | "EMAIL"
  | "PHONE"
  | "DATE"
  | "TIME"
  | "DATETIME"
  | "RADIO"
  | "CHECKBOX"
  | "SELECT"
  | "MULTISELECT"
  | "SCALE"
  | "NPS"
  | "FILE"
  | "IMAGE"
  | "GPS"
  | "SIGNATURE"
  | "MATRIX"
  | "COMPOSITE";

export interface SurveyOption {
  id: string;
  label: string;
  value?: string;
  order: number;

  isOther?: boolean;
  isActive?: boolean;
}

export interface CompositeFieldOption {
  id?: string;
  label: string;
  value?: string;
  order: number;
  isOther?: boolean;
  isActive?: boolean;
}

export interface CompositeField {
  id?: string;
  label: string;
  type: QuestionType;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  order: number;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  options?: CompositeFieldOption[];
}

export interface SurveyMatrixRow {
  id: string;
  label: string;
  value?: string;
  order: number;
}

export interface SurveyQuestion {
  matrixRows: SurveyMatrixRow[];
  min?: number;
  max?: number;
  id: string;

  title: string;
  description?: string;

  type: QuestionType;

  required: boolean;
  isRepeatable?: boolean;

  order: number;

  placeholder?: string;
  helpText?: string;

  minLength?: number;
  maxLength?: number;

  minValue?: number;
  maxValue?: number;

  defaultValue?: string;

  options: SurveyOption[];
  compositeFields?: CompositeField[];
  showWhenQuestionId?: string | null;
  showWhenValue?: string | null;
}

export interface SurveySection {
  id: string;

  title: string;
  description?: string;

  order: number;

  questions: SurveyQuestion[];
}

export interface Survey {
  id: string;

  publicToken: string;

  title: string;
  description?: string;

  status: string;

  version?: number;

  publishedAt?: string;

  sections: SurveySection[];
}
