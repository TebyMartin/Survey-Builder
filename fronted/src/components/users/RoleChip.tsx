import { Chip } from "@mui/material";

interface Props {
  role: string;
}

export default function RoleChip({ role }: Props) {
  switch (role) {
    case "ADMIN":
      return <Chip label="Administrador" color="secondary" size="small" />;

    case "EDITOR":
      return <Chip label="Editor" color="primary" size="small" />;

    case "INTERVIEWER":
      return <Chip label="Encuestador" color="success" size="small" />;

    case "VIEWER":
      return <Chip label="Visualizador" color="default" size="small" />;

    default:
      return <Chip label={role} size="small" />;
  }
}
