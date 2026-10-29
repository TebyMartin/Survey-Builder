import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCreateSurvey } from "../../hooks/useCreateSurvey";
import { useForm, Controller } from "react-hook-form";

interface FormData {
  title: string;
  description: string;
  estimatedTime: number;
  allowAnonymous: boolean;
  isTemplate: boolean;
}

export default function SurveyCreate() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      estimatedTime: 10,
      allowAnonymous: false,
      isTemplate: false,
    },
  });

  const navigate = useNavigate();

  const createSurveyMutation = useCreateSurvey();

  const onSubmit = (data: FormData) => {
    createSurveyMutation.mutate(data, {
      onSuccess: (survey) => {
        toast.success("Encuesta creada correctamente");

        navigate(`/dashboard/surveys/${survey.id}/builder`);
      },

      onError: () => {
        toast.error("No se pudo crear la encuesta");
      },
    });
  };

  return (
    <Box maxWidth={700} mx="auto">
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Nueva encuesta
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Título"
                  fullWidth
                  inputProps={{
                    maxLength: 150,
                  }}
                  helperText={`${field.value.length} / 150 caracteres`}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  multiline
                  rows={4}
                  fullWidth
                  inputProps={{
                    maxLength: 2000,
                  }}
                  helperText={`${field.value.length} / 2000 caracteres`}
                  sx={{ mt: 1 }}
                />
              )}
            />

            <Controller
              name="estimatedTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Tiempo estimado (minutos)"
                  fullWidth
                />
              )}
            />

            <Controller
              name="allowAnonymous"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Permitir respuestas anónimas"
                />
              )}
            />

            <Controller
              name="isTemplate"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Guardar como plantilla"
                />
              )}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit(onSubmit)}
              disabled={createSurveyMutation.isPending}
            >
              {createSurveyMutation.isPending ? "Creando..." : "Crear encuesta"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
