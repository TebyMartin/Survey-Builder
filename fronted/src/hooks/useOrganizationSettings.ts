import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "../api/axios";

export interface OrganizationSettings {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;

  logoUrl: string | null;

  primaryColor: string | null;
  secondaryColor: string | null;

  allowAnonymousByDefault: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrganizationSettings {
  name?: string;
  logoUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
}

export function useOrganizationSettings() {
  return useQuery<OrganizationSettings>({
    queryKey: ["configuration-settings"],

    queryFn: async () => {
      const { data } = await api.get("/configuration/settings");

      return data;
    },

    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateOrganizationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateOrganizationSettings) => {
      const { data } = await api.put("/configuration/settings", body);

      return data;
    },

    onSuccess: (data) => {
      // Actualizamos inmediatamente la configuración
      queryClient.setQueryData(["configuration-settings"], data);

      // Actualizamos también la información del usuario
      // porque la organización puede haber cambiado.
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
}
