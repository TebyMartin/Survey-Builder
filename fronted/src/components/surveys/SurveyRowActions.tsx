import { useState } from "react";

import { IconButton, Stack, Tooltip } from "@mui/material";

import ArchiveIcon from "@mui/icons-material/Archive";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import ShareIcon from "@mui/icons-material/Share";

import { toast } from "react-hot-toast";

import { useRestoreSurvey } from "../../hooks/useRestoreSurvey";
import { useNavigate } from "react-router-dom";
import { useArchiveSurvey } from "../../hooks/useArchivedSurvey";
import { useDeleteSurvey } from "../../hooks/useDeleteSurvey";
import { useDuplicateSurvey } from "../../hooks/useDuplicateSurvey";

import ConfirmDialog from "../users/ConfirmDialog";

interface Props {
  survey: any;
}

export default function SurveyRowActions({ survey }: Props) {
  const navigate = useNavigate();

  const archiveMutation = useArchiveSurvey();
  const restoreMutation = useRestoreSurvey();
  const deleteSurveyMutation = useDeleteSurvey();
  const duplicateSurveyMutation = useDuplicateSurvey();

  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Stack direction="row">
        {/* EDITAR / VISTA PREVIA */}
        {survey.status === "DRAFT" ? (
          <Tooltip title="Editar">
            <IconButton
              onClick={() =>
                navigate(`/dashboard/surveys/${survey.id}/builder`)
              }
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Vista previa">
            <IconButton
              onClick={() =>
                navigate(`/dashboard/surveys/${survey.id}/preview`)
              }
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* DUPLICAR */}
        <Tooltip title="Duplicar">
          <IconButton onClick={() => duplicateSurveyMutation.mutate(survey.id)}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>

        {/* ELIMINAR */}
        {survey.status === "DRAFT" && (
          <Tooltip title="Eliminar">
            <IconButton color="error" onClick={() => setConfirmOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* ARCHIVAR */}
        {survey.status === "PUBLISHED" && (
          <Tooltip title="Archivar">
            <IconButton
              color="warning"
              onClick={() => archiveMutation.mutate(survey.id)}
            >
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* COMPARTIR */}
        {survey.status === "PUBLISHED" && (
          <Tooltip title="Compartir">
            <IconButton
              onClick={() =>
                navigate(`/dashboard/surveys/${survey.publicToken}/share`, {
                  state: {
                    title: survey.title,
                    publicToken: survey.publicToken,
                  },
                })
              }
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* RESTAURAR */}
        {survey.status === "ARCHIVED" && (
          <Tooltip title="Restaurar">
            <IconButton
              color="success"
              onClick={() => restoreMutation.mutate(survey.id)}
            >
              <RestoreIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          if (!deleteSurveyMutation.isPending) {
            setConfirmOpen(false);
          }
        }}
        title="Eliminar encuesta"
        message={`¿Desea eliminar la encuesta "${survey.title}"?`}
        confirmText="Eliminar"
        confirmColor="error"
        onConfirm={async () => {
          try {
            await deleteSurveyMutation.mutateAsync(survey.id);

            toast.success("Encuesta eliminada correctamente");

            setConfirmOpen(false);
          } catch (error) {
            console.error(error);

            toast.error("No se pudo eliminar la encuesta");
          }
        }}
      />
    </>
  );
}
