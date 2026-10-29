export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "ADMIN" | "EDITOR" | "INTERVIEWER" | "VIEWER";
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "EDITOR" | "INTERVIEWER" | "VIEWER";
  isActive?: boolean;
}
