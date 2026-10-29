import api from "../api/axios";

export async function reorderSections(data: any) {
  const { data: response } = await api.patch("/sections/reorder", data);

  return response;
}
