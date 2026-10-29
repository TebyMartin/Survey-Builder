import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface MeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export function useMe() {
  const token = localStorage.getItem("token");

  return useQuery<MeUser>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await axios.get("auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    enabled: !!token,
  });
}
