import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useLogin";

interface FormErrors {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  organizationName: boolean;
}

export default function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organizationName: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    organizationName: false,
  });

  const [errorMessages, setErrorMessages] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organizationName: "",
  });

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Cuando empieza a escribir, quitamos el error
      setErrors((prev) => ({
        ...prev,
        [field]: false,
      }));

      setErrorMessages((prev) => ({
        ...prev,
        [field]: "",
      }));
    };

  const validateForm = () => {
    const newErrors: FormErrors = {
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      organizationName: false,
    };

    const newMessages = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      organizationName: "",
    };

    // NOMBRE
    if (!form.firstName.trim()) {
      newErrors.firstName = true;
      newMessages.firstName = "El nombre es obligatorio";
    }

    // APELLIDO
    if (!form.lastName.trim()) {
      newErrors.lastName = true;
      newMessages.lastName = "El apellido es obligatorio";
    }

    // EMAIL
    if (!form.email.trim()) {
      newErrors.email = true;
      newMessages.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = true;
      newMessages.email = "Ingresá un email válido";
    }

    // CONTRASEÑA
    if (!form.password.trim()) {
      newErrors.password = true;
      newMessages.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password = true;
      newMessages.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // ORGANIZACIÓN
    if (!form.organizationName.trim()) {
      newErrors.organizationName = true;
      newMessages.organizationName =
        "El nombre de la organización es obligatorio";
    }

    setErrors(newErrors);
    setErrorMessages(newMessages);

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      const result = await registerMutation.mutateAsync(form);

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
          }}
        >
          <Stack
            component="form"
            spacing={2.5}
            onSubmit={handleSubmit}
            noValidate
          >
            <Box mb={1}>
              <Typography variant="h4" fontWeight={700}>
                Crear cuenta
              </Typography>

              <Typography color="text.secondary" mt={1}>
                Creá tu organización y comenzá a utilizar Survey Builder.
              </Typography>
            </Box>

            {/* NOMBRE */}
            <TextField
              label="Nombre"
              value={form.firstName}
              onChange={handleChange("firstName")}
              fullWidth
              error={errors.firstName}
              helperText={errorMessages.firstName}
            />

            {/* APELLIDO */}
            <TextField
              label="Apellido"
              value={form.lastName}
              onChange={handleChange("lastName")}
              fullWidth
              error={errors.lastName}
              helperText={errorMessages.lastName}
            />

            {/* EMAIL */}
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              fullWidth
              error={errors.email}
              helperText={errorMessages.email}
            />

            {/* CONTRASEÑA */}
            <TextField
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              fullWidth
              error={errors.password}
              helperText={errorMessages.password}
            />

            {/* ORGANIZACIÓN */}
            <TextField
              label="Nombre de la organización"
              value={form.organizationName}
              onChange={handleChange("organizationName")}
              fullWidth
              error={errors.organizationName}
              helperText={errorMessages.organizationName}
            />

            {/* BOTÓN */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={registerMutation.isPending}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 3,
              }}
            >
              {registerMutation.isPending ? "Creando..." : "Crear organización"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
