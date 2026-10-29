import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Button } from "@mui/material";

export default function GpsPreview() {
  return (
    <Button disabled startIcon={<LocationOnIcon />} variant="outlined">
      Obtener ubicación
    </Button>
  );
}
