import { Box, Button, Typography } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function BuilderHeader() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={4}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/dashboard/surveys")}
      >
        Encuestas
      </Button>

      <Typography variant="h5" fontWeight="bold" align="left">
        Constructor de Encuesta
      </Typography>

      {/* <Button variant="contained" startIcon={<SaveIcon />}>
        Guardar
      </Button> */}
    </Box>
  );
}
