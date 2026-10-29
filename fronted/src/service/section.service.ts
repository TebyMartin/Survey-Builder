import api from "../api/axios";

interface CreateSectionDTO {
  surveyId: string;
  title: string;
  description?: string;
  order: number;
}

export async function createSection(data: CreateSectionDTO) {
  const response = await api.post("/sections", data);

  return response.data;
}

export async function updateSection({
  id,
  data,
}: {
  id: string;
  data: {
    title?: string;
    description?: string;
  };
}) {
  const response = await api.patch(`/sections/${id}`, data);

  return response.data;
}

export async function deleteSection(id: string) {
  await api.delete(`/sections/${id}`);
}
