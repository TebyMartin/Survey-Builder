import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../../contexts/AuthContext";
import FormTextField from "../../components/forms/FormTextField";

const schema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const auth = useAuth();

  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: (response) => {
        auth.login(response.token, response.user);

        toast.success("Bienvenido");

        const redirectByRole = {
          ADMIN: "/dashboard",
          INTERVIEWER: "/interviewer",
        };

        navigate(
          redirectByRole[response.user.role as keyof typeof redirectByRole] ??
            "/dashboard",
        );
      },

      onError: () => {
        toast.error("Email o contraseña incorrectos");
      },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "#f5f7fb",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Lado izquierdo */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Typography variant="h2" fontWeight={700}>
                Survey Builder
              </Typography>

              <Typography variant="h6" color="text.secondary">
                Crea, publica y analiza encuestas profesionales desde un único
                lugar.
              </Typography>

              <Typography color="text.secondary">
                Plataforma para empresas, universidades, organismos públicos y
                equipos que necesitan crear formularios modernos y analizar
                resultados en tiempo real.
              </Typography>
            </Stack>
          </Grid>

          {/* Lado derecho */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={10}
              sx={{
                borderRadius: 5,
                maxWidth: 500,
                mx: "auto",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 5 }}>
                <Typography
                  variant="h4"
                  textAlign="center"
                  fontWeight={600}
                  gutterBottom
                >
                  Iniciar sesión
                </Typography>

                <Typography textAlign="center" color="text.secondary" mb={3}>
                  Bienvenido nuevamente
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <FormTextField
                    label="Email"
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  <FormTextField
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    error={errors.password?.message}
                    {...register("password")}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={isPending}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 3,
                    }}
                  >
                    {isPending ? "Ingresando..." : "Ingresar"}
                  </Button>

                  <Typography textAlign="center" mt={4}>
                    ¿No tienes una cuenta?{" "}
                    <Link href="/register" underline="hover">
                      Regístrate
                    </Link>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
