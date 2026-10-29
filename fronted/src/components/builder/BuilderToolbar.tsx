import { Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
import { usePublishSurvey } from "../../hooks/usePublishSurvey";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateSection } from "../../hooks/useCreateSection";
import { useSnackbar } from "notistack";

export default function BuilderToolbar() {
  const { id } = useParams();

  const mutation = useCreateSection();
  const publishMutation = usePublishSurvey();
  const navigate = useNavigate();

  const handleAddSection = () => {
    mutation.mutate({
      surveyId: id!,
      title: "Nueva sección",
      description: "",
      order: 0,
    });
  };

  const { enqueueSnackbar } = useSnackbar();

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddSection}
      >
        Agregar sección
      </Button>

      <Button
        onClick={() => navigate(`/dashboard/surveys/${id}/preview`)}
        variant="outlined"
        startIcon={<VisibilityIcon />}
      >
        Vista previa
      </Button>

      <Button
        variant="outlined"
        startIcon={<PublishIcon />}
        onClick={() =>
          publishMutation.mutate(id!, {
            onSuccess: () => {
              enqueueSnackbar("Encuesta publicada correctamente", {
                variant: "success",
              });

              setTimeout(() => {
                navigate("/dashboard/surveys");
              }, 1200);
            },
          })
        }
      >
        Publicar
      </Button>
    </Stack>
  );
}
