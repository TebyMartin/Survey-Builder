import api from "../api/axios";

export interface SettingsData {
  organization: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

export async function getSettings(): Promise<SettingsData> {
  const { data } = await api.get("/settings");

  return data;
}

export async function updateOrganization(data: { name: string }) {
  const { data: result } = await api.patch("/settings/organization", data);

  return result;
}

export async function updateUser(data: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  const { data: result } = await api.patch("/settings/user", data);

  return result;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const { data: result } = await api.patch("/settings/password", data);

  return result;
}
