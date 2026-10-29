"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionOptionService = void 0;
const repository_1 = require("./repository");
const repository = new repository_1.QuestionOptionRepository();
class QuestionOptionService {
    create(data) {
        return repository.create(data);
    }
    update(id, data) {
        return repository.update(id, data);
    }
    delete(id) {
        return repository.delete(id);
    }
    async reorder(questionId, from, to) {
        return repository.reorder(questionId, from, to);
    }
}
exports.QuestionOptionService = QuestionOptionService;
