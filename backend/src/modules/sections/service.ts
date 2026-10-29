import { SectionRepository } from "./repository";

const repository = new SectionRepository();

export class SectionService {
  async create(data: {
    surveyId: string;
    title: string;
    description?: string;
  }) {
    return repository.create(data);
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
    },
  ) {
    return repository.update(id, data);
  }

  async delete(id: string) {
    return repository.delete(id);
  }
  async duplicate(id: string) {
    return repository.duplicate(id);
  }
  async reorder(
    sections: {
      id: string;
      order: number;
    }[],
  ) {
    return repository.reorder(sections);
  }
}
