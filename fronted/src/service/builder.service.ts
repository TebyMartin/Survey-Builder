import api from "../api/axios";
import type { Builder } from "../types/builder";

export async function getBuilder(id: string): Promise<Builder> {
  const { data } = await api.get(`/surveys/${id}/builder`);

  return data;
}
