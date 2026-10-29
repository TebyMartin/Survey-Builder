export interface AssignmentUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: string;
}

export interface AssignmentSurveySummary {
  id: string;
  title: string;
  status?: string;
}

export interface SurveyAssignment {
  id: string;
  status: string;
  assignedAt?: string;
  targetResponses: number;
  completedResponses: number;
  survey: AssignmentSurveySummary;
  user: AssignmentUser;
}
