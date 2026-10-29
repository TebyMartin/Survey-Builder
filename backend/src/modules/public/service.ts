import { PublicRepository } from "./repository";
import { PublicBuilder } from "./public.builder";
import { NotFoundError } from "../../error/NotFoundError";

const repository = new PublicRepository();
const builder = new PublicBuilder();

export class PublicService {
  async findByPublicToken(token: string) {
    const survey = await repository.findSurveyByToken(token);

    if (!survey) {
      throw new NotFoundError("Encuesta no encontrada");
    }

    return survey;
  }

  async getSurvey(token: string) {
    const survey = await repository.findSurveyByToken(token);

    if (!survey) {
      throw new NotFoundError("Encuesta no encontrada");
    }

    return builder.build(survey);
  }
}
