import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
  Chip,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function SurveyShare() {
  const [open, setOpen] = useState(false);

  const { token: urlToken } = useParams<{ token?: string }>();
  const { state } = useLocation();

  const token = urlToken || state?.publicToken || state?.token || "";
  const title = state?.title || "Encuesta";

  const publicLink = token ? `${window.location.origin}/s/${token}` : "";

  function copyLink() {
    if (publicLink) {
      navigator.clipboard.writeText(publicLink);
      setOpen(true);
    }
  }

  return (
    <>
      <Paper
        sx={{
          maxWidth: 700,
          mx: "auto",
          mt: 5,
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Compartir encuesta
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          {title}
        </Typography>

        <Chip color="success" label="Publicada" sx={{ mt: 1 }} />

        <Divider sx={{ my: 3 }} />

        <Typography color="success.main" mb={3} fontWeight="medium">
          ✔ La encuesta está publicada.
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            value={publicLink || "No se encontró el token de la encuesta"}
            error={!token}
            helperText={
              !token
                ? "Navega desde la lista de encuestas o verifica la URL"
                : ""
            }
            InputProps={{
              readOnly: true,
            }}
          />
          <Typography color="text.secondary" variant="body2">
            Cualquier persona que tenga este enlace podrá responder la encuesta.
          </Typography>

          {/* Botones de acción */}
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={copyLink}
              disabled={!token}
            >
              Copiar enlace
            </Button>

            <Button
              variant="outlined"
              startIcon={<OpenInNewIcon />}
              component="a"
              href={publicLink}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!token}
            >
              Abrir encuesta
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={() => setOpen(false)}
      >
        <Alert severity="success">Enlace copiado correctamente.</Alert>
      </Snackbar>
    </>
  );
}
