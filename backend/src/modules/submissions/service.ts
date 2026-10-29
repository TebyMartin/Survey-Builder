import { SubmissionRepository } from "./repository";
import { SurveyRepository } from "../surverys/repository";
import { AssignmentsRepository } from "../assignments/repository";

const repository = new SubmissionRepository();
const surveyRepository = new SurveyRepository();
const assignmentRepository = new AssignmentsRepository();

export class SubmissionService {
  // =========================================================
  // OBTENER RESULTADOS
  // =========================================================

  async getResults(surveyId: string, organizationId: string) {
    return repository.getResults(surveyId, organizationId);
  }

  // =========================================================
  // CREAR SUBMISSION
  // =========================================================

  async create(data: {
    surveyId: string;
    assignmentId?: string;
    interviewerId?: string;
    organizationId: string;
    latitude?: number;
    longitude?: number;
    ipAddress?: string;
    deviceInfo?: string;
  }) {
    // 1. Verificamos que la encuesta exista
    // y pertenezca a la organización
    const survey = await surveyRepository.findStatusById(
      data.surveyId,
      data.organizationId,
    );

    if (!survey) {
      throw new Error("La encuesta no existe");
    }

    // 2. Verificamos que esté publicada
    if (survey.status !== "PUBLISHED") {
      throw new Error("La encuesta no está publicada");
    }

    // 3. Verificamos fecha de inicio
    if (survey.startsAt && survey.startsAt > new Date()) {
      throw new Error("La encuesta todavía no comenzó");
    }

    // 4. Verificamos fecha de finalización
    if (survey.endsAt && survey.endsAt < new Date()) {
      throw new Error("La encuesta ya finalizó");
    }

    // 5. Si existe una asignación, la validamos
    if (data.assignmentId) {
      const assignment = await assignmentRepository.findByIdSimple(
        data.assignmentId,
        data.organizationId,
      );

      if (!assignment) {
        throw new Error("La asignación no existe");
      }

      // La asignación tiene que corresponder
      // a esta encuesta
      if (assignment.surveyId !== data.surveyId) {
        throw new Error("La asignación no corresponde a esta encuesta");
      }

      // Verificamos que no haya alcanzado
      // el objetivo
      if (
        assignment.status === "COMPLETED" ||
        assignment.completedResponses >= assignment.targetResponses
      ) {
        throw new Error(
          "Esta asignación ya alcanzó el objetivo de entrevistas",
        );
      }

      // Si hay entrevistador,
      // verificamos que sea el asignado
      if (data.interviewerId && assignment.userId !== data.interviewerId) {
        throw new Error("Esta encuesta no está asignada a este entrevistador");
      }
    }

    // 6. Creamos la submission
    return repository.create(data);
  }

  // =========================================================
  // GUARDAR RESPUESTAS
  // =========================================================

  async saveAnswers(
    submissionId: string,
    answers: {
      questionId: string;
      value?: string;
      options?: string[];
      matrix?: {
        rowId: string;
        value?: string;
      }[];
      composite?: {
        fieldId: string;
        value?: string;
      }[];
    }[],
    organizationId: string,
  ) {
    return repository.saveAnswers(submissionId, answers, organizationId);
  }
  // =========================================================
  // COMPLETAR SUBMISSION
  // =========================================================

  async complete(submissionId: string, organizationId: string) {
    const submission = await repository.findSubmissionWithAnswers(
      submissionId,
      organizationId,
    );
    console.log(
      "🔎 SUBMISSION ANSWERS:",
      JSON.stringify(submission?.answers, null, 2),
    );

    if (!submission) {
      throw new Error("Encuesta no encontrada");
    }

    // Si ya estaba completada,
    // no volvemos a incrementar
    // la asignación
    if (submission.status === "COMPLETED") {
      return submission;
    }

    // Obtenemos las preguntas respondidas
    const answeredQuestions = submission.answers.map(
      (answer) => answer.questionId,
    );

    for (const section of submission.survey.sections) {
      for (const question of section.questions) {
        const answer = submission.answers.find(
          (item) => item.questionId === question.id,
        );

        // Validación de la pregunta principal
        if (question.required && !answer) {
          throw new Error(`Falta responder la pregunta: "${question.title}"`);
        }

        // Validación de campos internos de COMPOSITE
        if (question.type === "COMPOSITE" && question.compositeFields.length) {
          for (const field of question.compositeFields) {
            if (!field.required) {
              continue;
            }

            const compositeAnswer = answer?.compositeAnswers.find(
              (item) => item.fieldId === field.id,
            );

            const value = compositeAnswer?.value?.trim();

            if (!value) {
              throw new Error(
                `Falta completar el campo "${field.label}" de la pregunta "${question.title}"`,
              );
            }
          }
        }
      }
    }

    // =======================================================
    // COMPLETAMOS LA SUBMISSION
    // =======================================================

    const completedSubmission = await repository.complete(
      submissionId,
      organizationId,
    );

    // =======================================================
    // ACTUALIZAMOS LA ASIGNACIÓN
    // =======================================================

    // Las encuestas públicas no tienen assignmentId,
    // por lo tanto este bloque no se ejecuta.
    if (submission.assignmentId) {
      await assignmentRepository.increaseCompletedResponses(
        submission.assignmentId,
        organizationId,
      );
    }

    return completedSubmission;
  }
  async getSubmissionOrganization(submissionId: string) {
    return repository.findSubmissionOrganization(submissionId);
  }
}
