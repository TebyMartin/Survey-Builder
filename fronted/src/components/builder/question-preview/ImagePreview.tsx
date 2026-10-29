import { Button } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

export default function ImagePreview() {
  return (
    <Button disabled variant="outlined" startIcon={<ImageIcon />}>
      Subir imagen
    </Button>
  );
}
