export interface SubmissionReview {
  id: string;
  comment: string;
  status: "CHANGES_REQUESTED" | "UPDATED" | "APPROVED";
  requestedAt: string;
  resolvedAt: string | null;
  supervisor: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface ReviewAnswer {
  id: string;
  value: string | null;
  question: {
    id: string;
    title: string;
    type: string;
    options: { id: string; label: string; isOther: boolean }[];
    matrixRows: { id: string; label: string }[];
    compositeFields: { id: string; label: string }[];
  };
  options: {
    questionOptionId: string;
    value: string | null;
    questionOption: { id: string; label: string; isOther: boolean } | null;
  }[];
  matrixAnswers: {
    rowId: string;
    value: string | null;
    row: { id: string; label: string };
  }[];
  compositeAnswers: {
    fieldId: string;
    value: string | null;
    field: { id: string; label: string };
  }[];
}

export interface SubmissionForReview {
  id: string;
  formNumber: number;
  completedAt: string | null;
  status: string;
  survey: { id: string; title: string };
  interviewer: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  answers: ReviewAnswer[];
  reviews: SubmissionReview[];
}
