import Chip from "@mui/material/Chip";

interface Props {
  status: string;
}

export default function AssignmentStatusChip({ status }: Props) {
  switch (status) {
    case "PENDING":
      return (
        <Chip
          label="Pendiente"
          color="warning"
          size="small"
          sx={{
            fontWeight: 700,
            borderRadius: 999,
          }}
        />
      );

    case "IN_PROGRESS":
      return (
        <Chip
          label="En progreso"
          color="info"
          size="small"
          sx={{
            fontWeight: 700,
            borderRadius: 999,
          }}
        />
      );

    case "COMPLETED":
      return (
        <Chip
          label="Completada"
          color="success"
          size="small"
          sx={{
            fontWeight: 700,
            borderRadius: 999,
          }}
        />
      );

    default:
      return (
        <Chip
          label={status}
          size="small"
          sx={{
            borderRadius: 999,
          }}
        />
      );
  }
}
