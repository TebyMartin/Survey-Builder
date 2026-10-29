import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";

import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useMe } from "../../hooks/useUsers";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
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

  const firstName = user?.firstName || "Usuario";
  const lastName = user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  const email = user?.email || "";

  const organizationName = user?.organization?.name || "Mi organización";

  const organizationLogo = user?.organization?.logoUrl;

  const initial = firstName.charAt(0).toUpperCase();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={1}
      sx={{
        width: {
          md: "calc(100% - 260px)",
        },
        ml: {
          md: "260px",
        },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 64,
            sm: 70,
          },
        }}
      >
        {/* MENÚ MOBILE */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{
            mr: 2,
            display: {
              xs: "block",
              md: "none",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* SALUDO + EMPRESA */}
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: {
                xs: 1,
                sm: 1.5,
              },
              flexWrap: "wrap",
            }}
          >
            {/* NOMBRE DEL USUARIO */}
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                lineHeight: 1.2,
                fontSize: {
                  xs: "1rem",
                  sm: "1.15rem",
                },
                whiteSpace: "nowrap",
              }}
            >
              Hola, {firstName} 👋
            </Typography>

            {/* SEPARADOR */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                width: "1px",
                height: "22px",
                backgroundColor: "divider",
              }}
            />

            {/* EMPRESA */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                minWidth: 0,
              }}
            >
              {organizationLogo && (
                <Avatar
                  src={organizationLogo}
                  alt={organizationName}
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: "0.75rem",
                  }}
                >
                  {organizationName.charAt(0).toUpperCase()}
                </Avatar>
              )}

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.85rem",
                  },
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: {
                    xs: "140px",
                    sm: "250px",
                    md: "350px",
                  },
                }}
              >
                {organizationName}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* AVATAR DEL USUARIO */}
        <Box>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{
              ml: 1,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {initial}
            </Avatar>
          </IconButton>

          {/* MENU DEL USUARIO */}
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
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 280,
                borderRadius: 2,
                overflow: "hidden",
              },
            }}
          >
            {/* INFORMACIÓN DEL USUARIO */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 42,
                    height: 42,
                    fontWeight: 600,
                  }}
                >
                  {initial}
                </Avatar>

                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {fullName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      wordBreak: "break-word",
                    }}
                  >
                    {email}
                  </Typography>
                </Box>
              </Box>

              {/* ORGANIZACIÓN */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1.5,
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: "action.hover",
                }}
              >
                {organizationLogo ? (
                  <Avatar
                    src={organizationLogo}
                    alt={organizationName}
                    sx={{
                      width: 30,
                      height: 30,
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      fontSize: "0.75rem",
                    }}
                  >
                    {organizationName.charAt(0).toUpperCase()}
                  </Avatar>
                )}

                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    Organización
                  </Typography>

                  <Typography variant="body2" fontWeight={500} noWrap>
                    {organizationName}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* CERRAR SESIÓN */}
            <MenuItem
              onClick={handleLogout}
              sx={{
                gap: 1,
                py: 1.2,
              }}
            >
              <LogoutOutlinedIcon fontSize="small" />

              <Typography variant="body2">Cerrar sesión</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
