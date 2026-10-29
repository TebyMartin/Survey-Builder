import { useState } from "react";

import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useActivateUser,
  useDeactivateUser,
  useDeleteUser,
} from "../../hooks/useUsers";

import { toast } from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";
import UserFormDialog from "./UserFormDialog";
import type { User } from "../../service/users.service";

interface Props {
  user: User;
}

export default function UserRowActions({ user }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [action, setAction] = useState<"activate" | "deactivate" | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();
  const deleteMutation = useDeleteUser();
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenEdit(true);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText>Editar</ListItemText>
        </MenuItem>

        {user.isActive ? (
          <MenuItem
            onClick={async () => {
              handleClose();

              setAction("deactivate");

              setConfirmOpen(true);

              toast.success("Usuario desactivado");
            }}
          >
            <ListItemIcon>
              <BlockIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText>Desactivar</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={async () => {
              handleClose();

              setAction("activate");

              setConfirmOpen(true);

              toast.success("Usuario activado");
            }}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText>Activar</ListItemText>
          </MenuItem>
        )}

        <MenuItem
          onClick={async () => {
            handleClose();

            setDeleteOpen(true);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>

          <ListItemText
            sx={{
              color: "error.main",
            }}
          >
            Eliminar
          </ListItemText>
        </MenuItem>
      </Menu>
      <UserFormDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
      />
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={action === "activate" ? "Activar usuario" : "Desactivar usuario"}
        message={
          action === "activate"
            ? "¿Desea activar este usuario?"
            : "¿Desea desactivar este usuario?"
        }
        confirmText={action === "activate" ? "Activar" : "Desactivar"}
        confirmColor={action === "activate" ? "success" : "warning"}
        onConfirm={async () => {
          try {
            if (action === "activate") {
              await activateMutation.mutateAsync(user.id);

              toast.success("Usuario activado");
            } else {
              await deactivateMutation.mutateAsync(user.id);

              toast.success("Usuario desactivado");
            }

            setConfirmOpen(false);
          } catch {
            toast.error("Ocurrió un error");
          }
        }}
      />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Eliminar usuario"
        message="¿Está seguro de eliminar este usuario? Se perderá toda la información asociada y esta acción no podrá deshacerse."
        confirmText="Eliminar"
        confirmColor="error"
        onConfirm={async () => {
          try {
            await deleteMutation.mutateAsync(user.id);

            toast.success("Usuario eliminado");

            setDeleteOpen(false);
            handleClose();
          } catch {
            toast.error("Ocurrió un error al eliminar el usuario");
          }
        }}
      />
    </>
  );
}
