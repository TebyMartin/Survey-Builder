"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionService = void 0;
const repository_1 = require("./repository");
const repository = new repository_1.SectionRepository();
class SectionService {
    async create(data) {
        return repository.create(data);
    }
    async update(id, data) {
        return repository.update(id, data);
    }
    async delete(id) {
        return repository.delete(id);
    }
    async duplicate(id) {
        return repository.duplicate(id);
    }
    async reorder(sections) {
        return repository.reorder(sections);
    }
}
exports.SectionService = SectionService;
