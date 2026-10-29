import Grid from "@mui/material/Grid";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import StatCard from "../ui/StatCard";

export default function DashboardStats() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Encuestas"
          value={24}
          subtitle="3 publicadas"
          color="#1976d2"
          icon={<DescriptionIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Usuarios"
          value={8}
          subtitle="2 entrevistadores"
          color="#2e7d32"
          icon={<PeopleIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Respuestas"
          value={152}
          subtitle="Este mes"
          color="#ed6c02"
          icon={<AssignmentTurnedInIcon />}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Pendientes"
          value={6}
          subtitle="Sin responder"
          color="#d32f2f"
          icon={<PendingActionsIcon />}
        />
      </Grid>
    </Grid>
  );
}
