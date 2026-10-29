import api from "../api/axios";

export async function reorderSections(data: { id: string; order: number }[]) {
  const { data: response } = await api.patch("/sections/reorder", data);

  return response;
}
