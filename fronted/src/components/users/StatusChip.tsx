import { Chip } from "@mui/material";

interface Props {
  active: boolean;
}

export default function StatusChip({ active }: Props) {
  return (
    <Chip
      label={active ? "Activo" : "Inactivo"}
      color={active ? "success" : "error"}
      size="small"
      variant="filled"
    />
  );
}
