export class PublicBuilder {
  build(survey: any) {
    return {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      estimatedTime: survey.estimatedTime,

      sections: survey.sections.map((section: any) => ({
        id: section.id,
        title: section.title,
        description: section.description,

        questions: section.questions.map((question: any) => {
          console.log("BACK:", {
            pregunta: question.title,
            type: question.type,
            required: question.required,
            showWhenQuestionId: question.showWhenQuestionId,
            showWhenValue: question.showWhenValue,
            compositeFields: question.compositeFields,
          });

          return {
            id: question.id,
            title: question.title,
            type: question.type,
            placeholder: question.placeholder,
            helpText: question.helpText,
            required: question.required,
            isRepeatable: question.isRepeatable,

            // ==========================================
            // CONDICIÓN
            // ==========================================

            showWhenQuestionId: question.showWhenQuestionId,
            showWhenValue: question.showWhenValue,

            // ==========================================
            // VALIDACIONES
            // ==========================================

            minLength: question.minLength,
            maxLength: question.maxLength,

            minValue: question.minValue,
            maxValue: question.maxValue,

            defaultValue: question.defaultValue,

            // ==========================================
            // OPCIONES
            // ==========================================

            options:
              question.options?.map((option: any) => ({
                id: option.id,
                label: option.label,
                value: option.value,
                isOther: option.isOther,
              })) ?? [],

            // ==========================================
            // MATRIX
            // ==========================================

            matrixRows:
              question.matrixRows?.map((row: any) => ({
                id: row.id,
                label: row.label,
                value: row.value,
                order: row.order,
              })) ?? [],

            // ==========================================
            // PREGUNTA COMPUESTA
            // ==========================================

            compositeFields:
              question.compositeFields?.map((field: any) => ({
                id: field.id,
                type: field.type,
                label: field.label,
                helpText: field.helpText,
                placeholder: field.placeholder,
                required: field.required,

                minLength: field.minLength,
                maxLength: field.maxLength,

                minValue: field.minValue,
                maxValue: field.maxValue,

                defaultValue: field.defaultValue,

                options:
                  field.options?.map((option: any) => ({
                    id: option.id,
                    label: option.label,
                    value: option.value,
                    isOther: option.isOther,
                  })) ?? [],
              })) ?? [],
          };
        }),
      })),
    };
  }
}
