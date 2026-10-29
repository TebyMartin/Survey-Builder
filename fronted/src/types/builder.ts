export interface Builder {
  id: string;
  title: string;
  description?: string;
  status: string;

  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;

  questions: Question[];
}

export interface Question {
  id: string;
  title: string;
  type: string;
  required: boolean;
  order: number;
  description?: string;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  options?: SurveyOption[];
  matrixRows?: SurveyMatrixRow[];
  compositeFields?: CompositeField[];
  showWhenQuestionId?: string | null;
  showWhenValue?: string | null;
}
import type {
  CompositeField,
  SurveyMatrixRow,
  SurveyOption,
} from "./surveys";
