import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

// Todas las asignaciones (Administrador)
export function useAssignments() {
  return useQuery({
    queryKey: ["assignments"],

    queryFn: async () => {
      const { data } = await api.get("/assignments");
      return data;
    },
  });
}

// Mis asignaciones (Encuestador)
export function useMyAssignments() {
  return useQuery({
    queryKey: ["myAssignments"],

    queryFn: async () => {
      const { data } = await api.get("/assignments/my");
      return data;
    },
  });
}

// Detalle de una asignación
export function useAssignment(id: string) {
  return useQuery({
    queryKey: ["assignment", id],

    queryFn: async () => {
      const { data } = await api.get(`/assignments/${id}/detail`);
      return data;
    },

    enabled: !!id,
  });
}

// Crear asignación
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: any) => {
      const { data } = await api.post("/assignments", body);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myAssignments"],
      });
    },
  });
}

// Eliminar asignación
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/assignments/${id}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["myAssignments"],
      });
    },
  });
}
