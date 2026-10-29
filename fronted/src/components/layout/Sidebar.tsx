import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";

const adminMenuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    text: "Encuestas",
    icon: <DescriptionIcon />,
    path: "/dashboard/surveys",
  },
  {
    text: "Usuarios",
    icon: <PeopleIcon />,
    path: "/dashboard/users",
  },
  {
    text: "Asignaciones",
    icon: <AssignmentTurnedInIcon />,
    path: "/dashboard/assignments",
  },
  {
    text: "Reportes",
    icon: <BarChartIcon />,
    path: "/dashboard/reports",
  },
  {
    text: "Configuración",
    icon: <SettingsIcon />,
    path: "/dashboard/settings",
  },
];

const editorMenuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    text: "Encuestas",
    icon: <DescriptionIcon />,
    path: "/dashboard/surveys",
  },
  {
    text: "Reportes",
    icon: <BarChartIcon />,
    path: "/dashboard/reports",
  },
];

const viewerMenuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    text: "Reportes",
    icon: <BarChartIcon />,
    path: "/dashboard/reports",
  },
];

const interviewerMenuItems = [
  {
    text: "Mis asignaciones",
    icon: <AssignmentTurnedInIcon />,
    path: "/dashboard/my-assignments",
  },
];

export default function Sidebar() {
  const { user } = useAuth();

  let menuItems = viewerMenuItems;

  switch (user?.role) {
    case "ADMIN":
      menuItems = adminMenuItems;
      break;

    case "EDITOR":
      menuItems = editorMenuItems;
      break;

    case "INTERVIEWER":
      menuItems = interviewerMenuItems;
      break;

    case "VIEWER":
      menuItems = viewerMenuItems;
      break;
  }

  return (
    <Box
      sx={{
        width: 260,
        maxWidth: "100%",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight="bold"
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Survey Builder
        </Typography>
      </Toolbar>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 2,
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
