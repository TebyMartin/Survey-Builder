import { Dialog, DialogTitle, DialogContent } from "@mui/material";

import UserForm from "./UseForm";
import { useCreateUser } from "../../hooks/useUsers";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UserFormDialog({ open, onClose }: Props) {
  const { mutateAsync, isPending } = useCreateUser();

  const handleSubmit = async (data: any) => {
    await mutateAsync(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nuevo usuario</DialogTitle>

      <DialogContent>
        <UserForm
          loading={isPending}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
