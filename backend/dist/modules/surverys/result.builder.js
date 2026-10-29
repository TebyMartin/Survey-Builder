"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultBuilder = void 0;
class ResultBuilder {
    build(survey) {
        const questions = new Map();
        for (const submission of survey.submissions) {
            for (const answer of submission.answers) {
                if (!questions.has(answer.question.id)) {
                    questions.set(answer.question.id, {
                        id: answer.question.id,
                        title: answer.question.title,
                        type: answer.question.type,
                        options: answer.question.options,
                        answers: [],
                    });
                }
                questions.get(answer.question.id).answers.push(answer);
            }
        }
        return {
            id: survey.id,
            title: survey.title,
            description: survey.description,
            totalResponses: survey.submissions.length,
            questions: Array.from(questions.values()).map((question) => {
                switch (question.type) {
                    case "RADIO":
                    case "SELECT":
                        return this.buildChoiceQuestion(question, survey.submissions.length);
                    default:
                        return question;
                }
            }),
        };
    }
    buildChoiceQuestion(question, totalResponses) {
        return {
            id: question.id,
            title: question.title,
            type: question.type,
            results: question.options.map((option) => {
                const count = question.answers.filter((answer) => answer.options.some((selected) => selected.questionOptionId === option.id)).length;
                return {
                    id: option.id,
                    label: option.label,
                    value: option.value,
                    count,
                    percentage: totalResponses === 0
                        ? 0
                        : Number(((count / totalResponses) * 100).toFixed(1)),
                };
            }),
        };
    }
}
exports.ResultBuilder = ResultBuilder;
