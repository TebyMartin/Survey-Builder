import { IconButton, Menu, MenuItem } from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast";

import { useDeleteAssignment } from "../../hooks/useAssignments";

import { useState } from "react";
import ConfirmDialog from "../users/ConfirmDialog";
import type { SurveyAssignment } from "../../types/assignment";

interface Props {
  assignment: Pick<SurveyAssignment, "id">;
}

export default function AssignmentRowActions({ assignment }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const deleteAssignment = useDeleteAssignment();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setConfirmOpen(true);
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Eliminar
        </MenuItem>
      </Menu>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Eliminar asignación"
        message="¿Desea eliminar esta asignación?"
        confirmText="Eliminar"
        confirmColor="error"
        onConfirm={async () => {
          try {
            await deleteAssignment.mutateAsync(assignment.id);

            toast.success("Asignación eliminada");

            setConfirmOpen(false);
          } catch {
            toast.error("Ocurrió un error");
          }
        }}
      />
    </>
  );
}
