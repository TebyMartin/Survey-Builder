import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function UserModal({ open, onClose, children }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          width: "100%",
          m: { xs: 1, sm: 2 },
          borderRadius: {
            xs: 2,
            sm: 3,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pr: 6,
          fontSize: {
            xs: "1.15rem",
            sm: "1.35rem",
          },
        }}
      >
        Nuevo usuario
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: {
            xs: 2,
            sm: 3,
          },
          pb: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
