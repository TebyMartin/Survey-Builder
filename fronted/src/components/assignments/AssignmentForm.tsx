import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";

import { useUsers } from "../../hooks/useUsers";
import { useSurveys } from "../../hooks/useSurvey";
import { useCreateAssignment } from "../../hooks/useAssignments";

import { toast } from "react-hot-toast";
import { isAxiosError } from "axios";
import type { User } from "../../service/users.service";
import type { Survey } from "../../types/surveys";

interface Props {
  onClose: () => void;
}

export default function AssignmentForm({ onClose }: Props) {
  const { data: surveys = [] } = useSurveys();

  const { data: users = [] } = useUsers();

  const createAssignment = useCreateAssignment();

  const [targetResponses, setTargetResponses] = useState(1);

  const [form, setForm] = useState({
    surveyId: "",
    userId: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async () => {
    if (!form.surveyId || !form.userId) {
      toast.error("Seleccioná una encuesta y un encuestador");
      return;
    }

    if (targetResponses < 1) {
      toast.error("La cantidad de entrevistas debe ser mayor a 0");
      return;
    }

    try {
      await createAssignment.mutateAsync({
        ...form,
        targetResponses,
      });

      toast.success("Asignación creada");

      onClose();
    } catch (err: unknown) {
      const message = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;

      if (message === "No se puede asignar una encuesta archivada.") {
        toast.error("Esta encuesta está archivada y no puede asignarse.");
        return;
      }

      toast.error(message ?? "Ocurrió un error");
    }
  };

  // Solamente se pueden asignar encuestas publicadas.
  // Las archivadas, cerradas o en borrador no aparecen.
  const assignableSurveys = surveys.filter(
    (survey: Survey) => survey.status === "PUBLISHED",
  );

  // Solamente mostramos usuarios encuestadores.
  const interviewers = users.filter((user: User) => user.role === "INTERVIEWER");

  return (
    <Stack
      spacing={3}
      sx={{
        mt: 1,
        width: "100%",
      }}
    >
      <TextField
        select
        label="Encuesta"
        value={form.surveyId}
        onChange={handleChange("surveyId")}
        fullWidth
        required
      >
        {assignableSurveys.length === 0 ? (
          <MenuItem disabled value="">
            No hay encuestas publicadas disponibles
          </MenuItem>
        ) : (
          assignableSurveys.map((survey: Survey) => (
            <MenuItem key={survey.id} value={survey.id}>
              {survey.title}
            </MenuItem>
          ))
        )}
      </TextField>

      <TextField
        select
        label="Encuestador"
        value={form.userId}
        onChange={handleChange("userId")}
        fullWidth
        required
      >
        {interviewers.length === 0 ? (
          <MenuItem disabled value="">
            No hay encuestadores disponibles
          </MenuItem>
        ) : (
          interviewers.map((user: User) => (
            <MenuItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </MenuItem>
          ))
        )}
      </TextField>

      <TextField
        fullWidth
        type="number"
        label="Cantidad de entrevistas"
        value={targetResponses}
        onChange={(e) =>
          setTargetResponses(Math.max(1, Number(e.target.value)))
        }
        inputProps={{
          min: 1,
        }}
        required
      />

      <Stack
        direction={{
          xs: "column-reverse",
          sm: "row",
        }}
        spacing={2}
        justifyContent="flex-end"
        sx={{
          mt: 2,
        }}
      >
        <Button
          onClick={onClose}
          fullWidth
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            createAssignment.isPending ||
            assignableSurveys.length === 0 ||
            interviewers.length === 0
          }
          fullWidth
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          {createAssignment.isPending ? "Asignando..." : "Asignar"}
        </Button>
      </Stack>
    </Stack>
  );
}
