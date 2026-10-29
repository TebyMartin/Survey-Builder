import { QuestionOptionRepository } from "./repository";

const repository = new QuestionOptionRepository();

export class QuestionOptionService {
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
    return (repository as any).reorder(questionId, from, to);
  }
}
