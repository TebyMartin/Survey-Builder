import Grid from "@mui/material/Grid";
import LatestAssignments from "../../components/dashboard/LatestAssignments";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import PollIcon from "@mui/icons-material/Poll";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { Typography } from "@mui/material";
import TopInterviewers from "../../components/dashboard/TopInterviewers";
import { useDashboard } from "../../hooks/useDashboard";

import DashboardStatCard from "../../components/dashboard/DashboardStatCard";
import RecentSurveys from "../../components/dashboard/RecentSurveys";
import RecentResponses from "../../components/dashboard/RecentResponses";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <>Cargando...</>;

  return (
    <>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Primera fila */}

        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <DashboardStatCard
            title="Encuestas"
            value={data.surveys}
            icon={<DescriptionIcon />}
            color="#2563EB"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <DashboardStatCard
            title="Respuestas"
            value={data.responses}
            icon={<PollIcon />}
            color="#10B981"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <DashboardStatCard
            title="Usuarios"
            value={data.users}
            icon={<PeopleIcon />}
            color="#F59E0B"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <DashboardStatCard
            title="Asignaciones"
            value={data.assignments}
            icon={<AssignmentTurnedInIcon />}
            color="#8B5CF6"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <DashboardStatCard
            title="Publicadas"
            value={data.published}
            icon={<DescriptionIcon />}
            color="#22C55E"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <DashboardStatCard
            title="Completadas"
            value={data.completedAssignments}
            icon={<AssignmentTurnedInIcon />}
            color="#0EA5E9"
          />
        </Grid>

        {/* Segunda fila */}

        <Grid size={{ xs: 12, lg: 6 }}>
          <RecentSurveys surveys={data.recentSurveys} />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <RecentResponses responses={data.recentResponses} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TopInterviewers interviewers={data.topInterviewers} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LatestAssignments assignments={data.latestAssignments} />
        </Grid>
      </Grid>
    </>
  );
}
