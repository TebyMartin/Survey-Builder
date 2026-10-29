import { useMutation } from "@tanstack/react-query";
import { login, register } from "../service/auth.service";

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}
