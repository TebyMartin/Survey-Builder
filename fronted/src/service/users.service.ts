import api from "../api/axios";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: "EDITOR" | "INTERVIEWER" | "SUPERVISOR" | "VIEWER";
}

export async function getUsers() {
  const { data } = await api.get<User[]>("/users");

  return data;
}

export async function getUser(id: string) {
  const { data } = await api.get<User>(`/users/${id}`);

  return data;
}

export async function createUser(data: CreateUserData) {
  const { data: response } = await api.post<User>("/users", data);

  return response;
}

export async function updateUser(id: string, data: Partial<CreateUserData>) {
  const { data: response } = await api.put<User>(`/users/${id}`, data);

  return response;
}

export async function activateUser(id: string) {
  await api.patch(`/users/${id}/activate`);
}

export async function desactivateUser(id: string) {
  await api.patch(`/users/${id}/desactivate`);
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`);
}
