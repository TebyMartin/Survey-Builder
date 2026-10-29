"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicBuilder = void 0;
class PublicBuilder {
    build(survey) {
        return {
            id: survey.id,
            title: survey.title,
            description: survey.description,
            estimatedTime: survey.estimatedTime,
            sections: survey.sections.map((section) => ({
                id: section.id,
                title: section.title,
                description: section.description,
                questions: section.questions.map((question) => {
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
                        options: question.options?.map((option) => ({
                            id: option.id,
                            label: option.label,
                            value: option.value,
                            isOther: option.isOther,
                        })) ?? [],
                        // ==========================================
                        // MATRIX
                        // ==========================================
                        matrixRows: question.matrixRows?.map((row) => ({
                            id: row.id,
                            label: row.label,
                            value: row.value,
                            order: row.order,
                        })) ?? [],
                        // ==========================================
                        // PREGUNTA COMPUESTA
                        // ==========================================
                        compositeFields: question.compositeFields?.map((field) => ({
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
                            options: field.options?.map((option) => ({
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
exports.PublicBuilder = PublicBuilder;
