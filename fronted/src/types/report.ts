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
  type: "RADIO" | "CHECKBOX" | "SELECT" | "MULTISELECT" | "SCALE" | "COMPOSITE";
  answers: ChoiceAnswer[];
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
  average: number;
}

export interface MatrixQuestionSummary extends BaseQuestionSummary {
  type: "MATRIX";
  answers: MatrixRowSummary[];
}

/* =========================
   UNION
========================= */

export type QuestionSummary =
  | ChoiceQuestionSummary
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

  submissions: any[];
}
