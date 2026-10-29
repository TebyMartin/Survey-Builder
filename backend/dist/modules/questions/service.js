"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = void 0;
const repository_1 = require("./repository");
const repository = new repository_1.QuestionRepository();
class QuestionService {
    async create(data) {
        return repository.create(data);
    }
    async update(id, data) {
        return repository.update(id, data);
    }
    async delete(id) {
        return repository.delete(id);
    }
    async reorder(questions) {
        return repository.reorder(questions);
    }
    async duplicate(id) {
        const question = await repository.findById(id);
        if (!question) {
            throw new Error("Pregunta no encontrada");
        }
        return repository.duplicate(question);
    }
}
exports.QuestionService = QuestionService;
