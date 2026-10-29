"use strict";
// modules/assignments/mapper.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAssignmentResponse = toAssignmentResponse;
exports.toAssignmentsResponse = toAssignmentsResponse;
exports.toAssignmentDetailResponse = toAssignmentDetailResponse;
function toAssignmentResponse(assignment) {
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
function toAssignmentsResponse(assignments) {
    return assignments.map(toAssignmentResponse);
}
function toAssignmentDetailResponse(assignment) {
    return assignment;
}
