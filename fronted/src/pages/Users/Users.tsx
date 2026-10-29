import { useState } from "react";

import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import UserTable from "../../components/users/UserTable";
import UserFormDialog from "../../components/users/UserFormDialog";

export default function Users() {
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        py: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
          sx={{
            width: "100%",
            minWidth: 0,
            mb: 3,
          }}
        >
          <PeopleIcon
            sx={{
              fontSize: {
                xs: 32,
                sm: 38,
              },
              color: "primary.main",
            }}
          />

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "1.6rem",
                sm: "2rem",
                md: "2.4rem",
              },
              wordBreak: "break-word",
            }}
          >
            Usuarios
          </Typography>
        </Stack>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.5,
            fontSize: {
              xs: ".85rem",
              sm: "1rem",
            },
          }}
        >
          Gestioná los usuarios de tu organización
        </Typography>
      </Box>
      {/* HEADER */}
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={1.5}
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        mb={4}
      >
        <TextField
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: "100%",
            maxWidth: {
              xs: "100%",
              sm: 400,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreate(true)}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
            borderRadius: 3,
            px: 3,
            py: 1.3,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Nuevo usuario
        </Button>
      </Stack>

      {/* BUSCADOR */}

      {/* TABLA */}
      <UserTable search={search} />

      {/* CREAR USUARIO */}
      <UserFormDialog open={openCreate} onClose={() => setOpenCreate(false)} />
    </Box>
  );
}
