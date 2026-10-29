// modules/assignments/mapper.ts

export function toAssignmentResponse(assignment: any) {
  return {
    id: assignment.id,
    status: assignment.status,
    assignedAt: assignment.assignedAt,
    startedAt: assignment.startedAt,
    completedAt: assignment.completedAt,
    dueDate: assignment.dueDate,

    targetResponses: assignment.targetResponses,
    completedResponses: assignment.completedResponses,
    reviewRequestsCount: assignment.submissions?.length ?? 0,

    survey: assignment.survey && {
      id: assignment.survey.id,
      title: assignment.survey.title,
    },

    user: assignment.user && {
      id: assignment.user.id,
      firstName: assignment.user.firstName,
      lastName: assignment.user.lastName,
      email: assignment.user.email,
    },
  };
}

export function toAssignmentsResponse(assignments: any[]) {
  return assignments.map(toAssignmentResponse);
}

export function toAssignmentDetailResponse(assignment: any) {
  return assignment;
}
