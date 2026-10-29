import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { NavLink } from "react-router-dom";

export default function InterviewerSidebar() {
  return (
    <Box sx={{ width: 260 }}>
      {/* <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Survey Builder
        </Typography>
      </Toolbar> */}

      <Divider />

      <List>
        <ListItemButton
          component={NavLink}
          to="/interviewer"
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 2,
          }}
        >
          <ListItemIcon>
            <AssignmentTurnedInIcon />
          </ListItemIcon>

          <ListItemText primary="Mis asignaciones" />
        </ListItemButton>
      </List>
    </Box>
  );
}
