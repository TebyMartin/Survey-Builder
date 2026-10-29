import api from "../api/axios";

export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization?: {
    id: string;
    name: string;
    logoUrl?: string | null;
  };
}

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(data: LoginRequest) {
  const response = await api.post<LoginResponse>("/auth/login", data);

  return response.data;
}

export async function me() {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export async function register(data: RegisterData) {
  const response = await api.post("/auth/register", data);

  return response.data;
}
