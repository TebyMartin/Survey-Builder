import { QuestionRepository } from "./repository";

const repository = new QuestionRepository();

export class QuestionService {
  async create(data: {
    sectionId: string;
    title: string;
    type: any;
    order: number;
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    description?: string;
    isRepeatable?: boolean;
  }) {
    return repository.create(data);
  }
  async update(
    id: string,
    data: {
      title?: string;
      type?: any;
      placeholder?: string;
      helpText?: string;
      required?: boolean;
      description?: string;
      isRepeatable?: boolean;

      compositeFields?: {
        id?: string;
        label: string;
        type: any;
        placeholder?: string;
        helpText?: string;
        required?: boolean;
        minLength?: number | null;
        maxLength?: number | null;
        minValue?: number | null;
        maxValue?: number | null;
        defaultValue?: string | null;
        options?: {
          id?: string;
          label: string;
          value?: string;
          isOther?: boolean;
          isActive?: boolean;
          order: number;
        }[];
        order: number;
      }[];
    },
  ) {
    return repository.update(id, data);
  }

  async delete(id: string) {
    return repository.delete(id);
  }

  async reorder(
    questions: {
      id: string;
      order: number;
    }[],
  ) {
    return repository.reorder(questions);
  }
  async duplicate(id: string) {
    const question = await repository.findById(id);

    if (!question) {
      throw new Error("Pregunta no encontrada");
    }

    return repository.duplicate(question);
  }
}
