export interface ChoiceAnswer {
  label: string;
  count: number;
  percentage?: number;
}

export interface BaseQuestionSummary {
  id: string;
  title: string;
  type: string;
  order?: number;
  answered: number;
  total: number;
  firstAnswerAt?: number;
}

/* =========================
   OPCIONES
========================= */

export interface ChoiceQuestionSummary extends BaseQuestionSummary {
  type: "RADIO" | "CHECKBOX" | "SELECT" | "MULTISELECT" | "SCALE";
  answers: ChoiceAnswer[];
}

export interface CompositeFieldBaseSummary {
  id: string;
  label: string;
  type: string;
  answered: number;
  values: unknown[];
  average?: number;
  min?: number | null;
  max?: number | null;
}

export interface CompositeQuestionSummary extends BaseQuestionSummary {
  type: "COMPOSITE";
  answers: CompositeFieldBaseSummary[];
}

/* =========================
   NPS
========================= */

export interface NpsQuestionSummary extends BaseQuestionSummary {
  type: "NPS";
  answers: number[];
}

/* =========================
   TEXTO
========================= */

export interface TextQuestionSummary extends BaseQuestionSummary {
  type: "SHORT_TEXT" | "LONG_TEXT" | "EMAIL" | "DATE" | "NUMBER";
  answers: string[];
}

/* =========================
   MATRIZ
========================= */

export interface MatrixRowSummary {
  id: string;
  label: string;
  answered: number;
  values: {
    value: string;
    count: number;
    percentage: number;
  }[];
}

export interface MatrixQuestionSummary extends BaseQuestionSummary {
  type: "MATRIX";
  answers: MatrixRowSummary[];
}

export interface ReportOption {
  id: string;
  label: string;
  isOther?: boolean;
}

export interface ReportSubmissionQuestion {
  id: string;
  title: string;
  type: string;
  options?: ReportOption[];
  matrixRows?: {
    id: string;
    label: string;
  }[];
  compositeFields?: {
    id: string;
    label: string;
    type: string;
    options?: ReportOption[];
  }[];
}

export interface ReportSubmissionAnswer {
  questionId: string;
  value: string | null;
  question?: ReportSubmissionQuestion;
  options?: {
    questionOptionId: string;
    value: string | null;
    questionOption?: ReportOption | null;
  }[];
  compositeAnswers?: {
    fieldId: string;
    value: string | null;
  }[];
  matrixAnswers?: {
    rowId: string;
    value: string | null;
  }[];
}

export interface ReportSubmission {
  id: string;
  completedAt: string | null;
  answers: ReportSubmissionAnswer[];
}

/* =========================
   UNION
========================= */

export type QuestionSummary =
  | ChoiceQuestionSummary
  | CompositeQuestionSummary
  | NpsQuestionSummary
  | TextQuestionSummary
  | MatrixQuestionSummary;

/* =========================
   ESTADÍSTICAS
========================= */

export interface ReportStats {
  totalResponses: number;
  completed: number;
  inProgress: number;
  averageTime: number;
  lastResponse: string;
  today: number;
}

/* =========================
   UBICACIONES
========================= */

export interface ReportLocation {
  id: string;
  surveyId: string;
  assignmentId: string | null;
  interviewerId: string | null;
  status: string;
  latitude: number;
  longitude: number;
  completedAt: string | null;
  startedAt: string | null;

  interviewer: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

/* =========================
   RESPUESTAS POR DÍA
========================= */

export interface ResponsesPerDay {
  date: string;
  count: number;
}

/* =========================
   DASHBOARD
========================= */

export interface ReportDashboard {
  survey: {
    id: string;
    title: string;
  } | null;

  stats: ReportStats;

  locations: ReportLocation[];

  responsesPerDay: ResponsesPerDay[];

  questionSummaries: QuestionSummary[];

  submissions: ReportSubmission[];
}
