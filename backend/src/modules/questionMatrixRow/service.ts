import { QuestionMatrixRowRepository } from "./repository";

const repository = new QuestionMatrixRowRepository();

export class QuestionMatrixRowService {
  create(data: any) {
    return repository.create(data);
  }

  update(id: string, data: any) {
    return repository.update(id, data);
  }

  delete(id: string) {
    return repository.delete(id);
  }

  async reorder(questionId: string, from: number, to: number) {
    return repository.reorder(questionId, from, to);
  }
}
