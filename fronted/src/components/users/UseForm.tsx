import { useEffect, useState } from "react";

import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";

import { toast } from "react-hot-toast";

import type { CreateUserData, User } from "../../service/users.service";

interface Props {
  user?: User | null;
  loading?: boolean;
  onSubmit: (data: CreateUserData) => Promise<void>;
  onCancel: () => void;
}

const fieldSx = {
  "& .MuiInputLabel-root": {
    zIndex: 2,
  },

  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    transform: "translate(14px, -4px) scale(0.75)",
    transformOrigin: "top left",
    backgroundColor: "background.paper",
    paddingLeft: "4px",
    paddingRight: "4px",
    zIndex: 2,
  },
};

export default function UserForm({
  user,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const isEditing = Boolean(user);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<CreateUserData["role"]>(
    user?.role && user.role !== "ADMIN"
      ? (user.role as CreateUserData["role"])
      : "INTERVIEWER",
  );

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPassword("");
      if (user.role !== "ADMIN") {
        setRole(user.role as CreateUserData["role"]);
      }
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRole("INTERVIEWER");
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const payload: CreateUserData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        role,
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      await onSubmit(payload);

      toast.success(
        isEditing
          ? "Usuario actualizado correctamente"
          : "Usuario creado correctamente",
      );

      onCancel();
    } catch (error: any) {
      const msg = error?.response?.data?.message || (isEditing ? "Error al actualizar el usuario" : "Error al crear el usuario");
      toast.error(msg);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
      }}
    >
      <Stack spacing={2.5}>
        {/* NOMBRE Y APELLIDO */}
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
        >
          <TextField
            label="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />

          <TextField
            label="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            required
            sx={fieldSx}
          />
        </Stack>

        {/* EMAIL */}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          sx={fieldSx}
        />

        {/* CONTRASEÑA */}
        <TextField
          label={
            isEditing
              ? "Nueva contraseña (opcional)"
              : "Contraseña"
          }
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required={!isEditing}
          helperText={
            isEditing
              ? "Dejá en blanco si no querés cambiar la contraseña"
              : undefined
          }
          sx={fieldSx}
        />

        {/* ROL */}
        <TextField
          select
          label="Rol"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as CreateUserData["role"])
          }
          fullWidth
          sx={fieldSx}
        >
          <MenuItem value="EDITOR">Editor</MenuItem>

          <MenuItem value="INTERVIEWER">Encuestador</MenuItem>

          <MenuItem value="SUPERVISOR">Supervisor</MenuItem>

          <MenuItem value="VIEWER">Visualizador</MenuItem>
        </TextField>

        {/* BOTONES */}
        <Stack
          direction={{
            xs: "column-reverse",
            sm: "row",
          }}
          spacing={2}
          justifyContent="flex-end"
          sx={{
            pt: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            fullWidth
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            {loading
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Crear usuario"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
