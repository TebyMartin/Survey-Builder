export class ResultBuilder {
  build(survey: any) {
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
      questions: Array.from(questions.values()).map((question: any) => {
        switch (question.type) {
          case "RADIO":
          case "SELECT":
            return this.buildChoiceQuestion(
              question,
              survey.submissions.length,
            );

          default:
            return question;
        }
      }),
    };
  }
  private buildChoiceQuestion(question: any, totalResponses: number) {
    return {
      id: question.id,
      title: question.title,
      type: question.type,
      results: question.options.map((option: any) => {
        const count = question.answers.filter((answer: any) =>
          answer.options.some(
            (selected: any) => selected.questionOptionId === option.id,
          ),
        ).length;

        return {
          id: option.id,
          label: option.label,
          value: option.value,
          count,
          percentage:
            totalResponses === 0
              ? 0
              : Number(((count / totalResponses) * 100).toFixed(1)),
        };
      }),
    };
  }
}
