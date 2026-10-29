import api from "../api/axios";
import type { Survey } from "../types/surveys";

export async function getSurveys(): Promise<Survey[]> {
  const { data } = await api.get("/surveys");

  return data;
}

export interface CreateSurveyDto {
  title: string;
  description?: string;
  estimatedTime?: number;
  allowAnonymous: boolean;
  isTemplate: boolean;
}

export async function createSurvey(data: CreateSurveyDto) {
  const response = await api.post("/surveys", data);

  return response.data;
}

export async function archiveSurvey(id: string) {
  const { data } = await api.patch(`/surveys/${id}/archive`);

  return data;
}

export async function restoreSurvey(id: string) {
  const { data } = await api.patch(`/surveys/${id}/restore`);

  return data;
}

export async function getPublicSurvey(token: string) {
  const { data } = await api.get(`/public/surveys/${token}`);

  return data;
}

export async function deleteSurvey(id: string) {
  const { data } = await api.delete(`/surveys/${id}`);
  return data;
}

export async function duplicateSurvey(id: string) {
  const { data } = await api.post(`/surveys/${id}/duplicate`);

  return data;
}
