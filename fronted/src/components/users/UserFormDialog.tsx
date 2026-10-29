import { Dialog, DialogTitle, DialogContent } from "@mui/material";

import UserForm from "./UseForm";
import { useCreateUser, useUpdateUser } from "../../hooks/useUsers";
import type { CreateUserData, User } from "../../service/users.service";

interface Props {
  open: boolean;
  onClose: () => void;
  user?: User | null;
}

export default function UserFormDialog({ open, onClose, user }: Props) {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isPending =
    createUserMutation.isPending || updateUserMutation.isPending;

  const handleSubmit = async (data: CreateUserData) => {
    if (user) {
      await updateUserMutation.mutateAsync({
        id: user.id,
        ...data,
      });
    } else {
      await createUserMutation.mutateAsync(data);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {user ? "Editar usuario" : "Nuevo usuario"}
      </DialogTitle>

      <DialogContent>
        <UserForm
          user={user}
          loading={isPending}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
