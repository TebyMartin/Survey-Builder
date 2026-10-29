import { PrismaClient, SubmissionStatus } from "@prisma/client";

const prisma = new PrismaClient();

export class ReportsRepository {
  async getDashboard(surveyId: string, organizationId: string) {
    const survey = await prisma.survey.findUnique({
      where: {
        id: surveyId,
        organizationId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    const total = await prisma.submission.count({
      where: {
        surveyId,
      },
    });

    const completed = await prisma.submission.count({
      where: {
        surveyId,
        status: SubmissionStatus.COMPLETED,
      },
    });

    const inProgress = await prisma.submission.count({
      where: {
        surveyId,
        status: SubmissionStatus.IN_PROGRESS,
      },
    });

    const completedSubmissions = await prisma.submission.findMany({
      where: {
        surveyId,
        status: SubmissionStatus.COMPLETED,
      },
      include: {
        answers: {
          include: {
            question: true,
            options: {
              include: {
                questionOption: true,
              },
            },
          },
        },
      },
      orderBy: {
        completedAt: "asc",
      },
    });

    const submissions = await prisma.submission.findMany({
      where: {
        surveyId,
        status: SubmissionStatus.COMPLETED,
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        completedAt: true,
        startedAt: true,

        interviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },

        answers: {
          include: {
            question: {
              include: {
                options: true,

                matrixRows: {
                  orderBy: {
                    order: "asc",
                  },
                },

                compositeFields: {
                  orderBy: {
                    order: "asc",
                  },
                  include: {
                    options: {
                      orderBy: {
                        order: "asc",
                      },
                    },
                  },
                },
              },
            },

            options: {
              include: {
                questionOption: true,
              },
            },
            compositeAnswers: {
              include: {
                field: true,
              },
            },
            matrixAnswers: {
              include: {
                row: true,
              },
            },
          },
        },
      },
    });

    const responsesPerDay = await prisma.$queryRaw<
      {
        date: Date;
        count: bigint;
      }[]
    >`
  SELECT
    DATE(
      "completedAt"
      AT TIME ZONE 'America/Argentina/Buenos_Aires'
    ) AS date,
    COUNT(*) AS count
  FROM submissions
  WHERE "surveyId" = ${surveyId}
    AND status = 'COMPLETED'
  GROUP BY DATE(
    "completedAt"
    AT TIME ZONE 'America/Argentina/Buenos_Aires'
  )
  ORDER BY DATE(
    "completedAt"
    AT TIME ZONE 'America/Argentina/Buenos_Aires'
  );
`;
    const questions = await prisma.question.findMany({
      where: {
        section: {
          surveyId,
        },
      },

      include: {
        section: true,
        options: true,

        matrixRows: {
          orderBy: {
            order: "asc",
          },
        },

        compositeFields: {
          orderBy: {
            order: "asc",
          },
          include: {
            options: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },

        answers: {
          orderBy: {
            createdAt: "asc",
          },

          include: {
            options: {
              include: {
                questionOption: true,
              },
            },

            matrixAnswers: {
              include: {
                row: true,
              },
            },

            compositeAnswers: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    });
    questions.sort((a, b) => {
      if (a.section.order !== b.section.order) {
        return a.section.order - b.section.order;
      }

      return a.order - b.order;
    });

    const lastResponse = await prisma.submission.findFirst({
      where: {
        surveyId,
        status: SubmissionStatus.COMPLETED,
      },
      orderBy: {
        completedAt: "desc",
      },
      select: {
        completedAt: true,
      },
    });

    return {
      survey,
      total,
      completed,
      inProgress,
      completedSubmissions,
      responsesPerDay,
      questions,
      submissions,
      lastResponse,
    };
  }
}
