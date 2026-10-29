import { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";

import { toast } from "react-hot-toast";

import {
  useChangePassword,
  useSettings,
  useUpdateOrganization,
  useUpdateUser,
} from "../../hooks/useSettings";
import type { SettingsData } from "../../service/settings.service";

function getApiErrorMessage(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return undefined;
  }

  const response = error.response;
  if (typeof response !== "object" || response === null || !("data" in response)) {
    return undefined;
  }

  const responseData = response.data;
  if (
    typeof responseData !== "object" ||
    responseData === null ||
    !("message" in responseData) ||
    typeof responseData.message !== "string"
  ) {
    return undefined;
  }

  return responseData.message;
}

export default function Settings() {
  const { data, isLoading } = useSettings();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return <Typography>No se pudo cargar la configuración.</Typography>;
  }

  return <SettingsForm key={data.user.id} data={data} />;
}

function SettingsForm({ data }: { data: SettingsData }) {
  const updateOrganizationMutation = useUpdateOrganization();
  const updateUserMutation = useUpdateUser();
  const changePasswordMutation = useChangePassword();

  const [organizationName, setOrganizationName] = useState(
    data.organization.name,
  );
  const [firstName, setFirstName] = useState(data.user.firstName);
  const [lastName, setLastName] = useState(data.user.lastName);
  const [email, setEmail] = useState(data.user.email);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleOrganizationSubmit = async () => {
    try {
      await updateOrganizationMutation.mutateAsync({
        name: organizationName,
      });

      toast.success("Organización actualizada");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error) ?? "No se pudieron guardar los cambios",
      );
    }
  };

  const handleUserSubmit = async () => {
    try {
      await updateUserMutation.mutateAsync({
        firstName,
        lastName,
        email,
      });

      toast.success("Datos de cuenta actualizados");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error) ?? "No se pudieron guardar los cambios",
      );
    }
  };

  const handlePasswordSubmit = async () => {
    if (!currentPassword || !newPassword || !repeatPassword) {
      toast.error("Completá todos los campos");
      return;
    }

    if (newPassword !== repeatPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });

      toast.success("Contraseña actualizada");

      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error) ?? "No se pudo cambiar la contraseña",
      );
    }

  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1000,
        mx: "auto",
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      {/* HEADER */}

      <Stack spacing={1} mb={4}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <SettingsIcon color="primary" />

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Configuración
          </Typography>
        </Stack>

        <Typography color="text.secondary">
          Administrá la información de tu cuenta y organización.
        </Typography>
      </Stack>

      {/* ORGANIZACIÓN */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={1}
          >
            Organización
          </Typography>

          <Typography
            color="text.secondary"
            mb={3}
          >
            Información general de tu organización.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <TextField
              label="Nombre de la organización"
              fullWidth
              value={organizationName}
              onChange={(e) =>
                setOrganizationName(e.target.value)
              }
            />

            <TextField
              label="Slug"
              fullWidth
              value={data.organization.slug}
              disabled
            />

            <Box
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                variant="contained"
                onClick={handleOrganizationSubmit}
                disabled={
                  updateOrganizationMutation.isPending
                }
              >
                {updateOrganizationMutation.isPending
                  ? "Guardando..."
                  : "Guardar cambios"}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* MI CUENTA */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={1}
          >
            Mi cuenta
          </Typography>

          <Typography
            color="text.secondary"
            mb={3}
          >
            Información de tu cuenta de usuario.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <TextField
                label="Nombre"
                fullWidth
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
              />

              <TextField
                label="Apellido"
                fullWidth
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
              />
            </Stack>

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <Box
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                variant="contained"
                onClick={handleUserSubmit}
                disabled={
                  updateUserMutation.isPending
                }
              >
                {updateUserMutation.isPending
                  ? "Guardando..."
                  : "Guardar cambios"}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* SEGURIDAD */}

      <Card
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            mb={1}
          >
            <LockIcon color="primary" />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Seguridad
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            mb={3}
          >
            Cambiá la contraseña de acceso a tu cuenta.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <TextField
              label="Contraseña actual"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
            />

            <TextField
              label="Nueva contraseña"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />

            <TextField
              label="Repetir nueva contraseña"
              type="password"
              fullWidth
              value={repeatPassword}
              onChange={(e) =>
                setRepeatPassword(e.target.value)
              }
            />

            <Box
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                variant="contained"
                onClick={handlePasswordSubmit}
                disabled={
                  changePasswordMutation.isPending
                }
              >
                {changePasswordMutation.isPending
                  ? "Actualizando..."
                  : "Cambiar contraseña"}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}