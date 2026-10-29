import api from "../api/axios";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  _count?: {
    users: number;
    surveys: number;
  };
}

export interface CreateOrganizationData {
  name: string;
  slug: string;
}

export interface UpdateOrganizationData {
  name?: string;
  slug?: string;
  isActive?: boolean;
}

export async function getOrganizations(): Promise<Organization[]> {
  const response = await api.get("/api/organizations");

  return response.data;
}

export async function getOrganization(id: string): Promise<Organization> {
  const response = await api.get(`/api/organizations/${id}`);

  return response.data;
}

export async function createOrganization(
  data: CreateOrganizationData,
): Promise<Organization> {
  const response = await api.post("/api/organizations", data);

  return response.data;
}

export async function updateOrganization(
  id: string,
  data: UpdateOrganizationData,
): Promise<Organization> {
  const response = await api.patch(`/api/organizations/${id}`, data);

  return response.data;
}

export async function deleteOrganization(id: string): Promise<void> {
  await api.delete(`/api/organizations/${id}`);
}
