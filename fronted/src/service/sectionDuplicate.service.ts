import api from "../api/axios";

export async function duplicateSection(id: string) {
  const { data } = await api.post(`/sections/${id}/duplicate`);

  return data;
}
