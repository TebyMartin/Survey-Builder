import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "../hooks/useUsers";

export default function InterviewerLayout() {
  const { data: user } = useMe();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          bgcolor: "#2f2e7d",
          color: "white",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              flexGrow: 1,
            }}
          >
            Survey Builder
          </Typography>

          <Typography
            sx={{
              mr: 2,
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            Hola, {user?.firstName} 👋
          </Typography>

          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,.25)",
              }}
            >
              {user?.firstName?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutOutlinedIcon sx={{ mr: 1 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          px: {
            xs: 2,
            md: 4,
          },
          py: 4,
          maxWidth: 1300,
          mx: "auto",
          width: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
