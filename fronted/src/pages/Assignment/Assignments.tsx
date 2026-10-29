import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import AssignmentForm from "../../components/assignments/AssignmentForm";
import AssignmentTable from "../../components/assignments/AssignmentTable";

import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";

export default function Assignments() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* Título */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <AssignmentIcon
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
          sx={{
            fontWeight: "bold",
            fontSize: {
              xs: "1.8rem",
              sm: "2rem",
              md: "2.125rem",
            },
          }}
        >
          Asignaciones
        </Typography>
      </Stack>

      {/* Descripción */}
      <Typography
        color="text.secondary"
        sx={{
          mt: 1,
          mb: {
            xs: 3,
            md: 4,
          },
        }}
      >
        Administrá las asignaciones de encuestas.
      </Typography>

      {/* Buscador + botón */}
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
        {/* Buscador */}
        <TextField
          fullWidth
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

        {/* Nueva asignación */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
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
          Nueva asignación
        </Button>
      </Stack>

      {/* Tabla */}
      <Box
        sx={{
          width: "100%",
          minWidth: 0,
        }}
      >
        <AssignmentTable search={search} />
      </Box>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-container": {
            px: {
              xs: 1,
              sm: 2,
            },
          },

          "& .MuiDialog-paper": {
            width: "100%",
            maxWidth: 600,
            m: 0,
            borderRadius: {
              xs: 2,
              sm: 3,
            },
          },
        }}
      >
        <DialogTitle>Nueva asignación</DialogTitle>

        <DialogContent dividers>
          <AssignmentForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
