"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DashboardRepository {
    async getStats(organizationId) {
        const surveys = await prisma.survey.count({
            where: {
                organizationId,
                deletedAt: null,
            },
        });
        const published = await prisma.survey.count({
            where: {
                organizationId,
                status: "PUBLISHED",
                deletedAt: null,
            },
        });
        const draft = await prisma.survey.count({
            where: {
                organizationId,
                status: "DRAFT",
                deletedAt: null,
            },
        });
        const closed = await prisma.survey.count({
            where: {
                organizationId,
                status: "CLOSED",
                deletedAt: null,
            },
        });
        const responses = await prisma.submission.count({
            where: {
                survey: {
                    organizationId,
                },
            },
        });
        const responsesToday = await prisma.submission.count({
            where: {
                survey: {
                    organizationId,
                },
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        });
        const users = await prisma.user.count({
            where: {
                organizationId,
            },
        });
        const assignments = await prisma.surveyAssignment.count({
            where: {
                survey: {
                    organizationId,
                },
            },
        });
        const recentSurveys = await prisma.survey.findMany({
            where: {
                organizationId,
                deletedAt: null,
            },
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
            },
        });
        const recentResponses = await prisma.submission.findMany({
            where: {
                survey: {
                    organizationId,
                },
            },
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                survey: true,
                interviewer: true,
            },
        });
        const topInterviewers = await prisma.user.findMany({
            where: {
                organizationId,
                role: "INTERVIEWER",
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                _count: {
                    select: {
                        submissions: {
                            where: {
                                survey: {
                                    organizationId,
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                submissions: {
                    _count: "desc",
                },
            },
            take: 5,
        });
        const latestAssignments = await prisma.surveyAssignment.findMany({
            where: {
                survey: {
                    organizationId,
                },
            },
            take: 5,
            orderBy: {
                assignedAt: "desc",
            },
            include: {
                survey: {
                    select: {
                        title: true,
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        const completedAssignments = await prisma.surveyAssignment.count({
            where: {
                survey: {
                    organizationId,
                },
                status: "COMPLETED",
            },
        });
        return {
            surveys,
            published,
            draft,
            closed,
            responses,
            responsesToday,
            users,
            assignments,
            recentSurveys,
            recentResponses,
            topInterviewers,
            latestAssignments,
            completedAssignments,
        };
    }
}
exports.DashboardRepository = DashboardRepository;
