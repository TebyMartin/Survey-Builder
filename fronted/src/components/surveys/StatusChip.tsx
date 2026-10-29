import Chip from "@mui/material/Chip";

interface Props {
  status: string;
}

export default function StatusChip({ status }: Props) {
  const map = {
    DRAFT: {
      label: "Borrador",
      color: "warning",
    },
    PUBLISHED: {
      label: "Publicada",
      color: "success",
    },
    CLOSED: {
      label: "Cerrada",
      color: "error",
    },
    ARCHIVED: {
      label: "Archivada",
      color: "default",
    },
  } as const;

  const item = map[status as keyof typeof map];

  return (
    <Chip
      label={item?.label ?? status}
      color={item?.color ?? "default"}
      size="small"
    />
  );
}
