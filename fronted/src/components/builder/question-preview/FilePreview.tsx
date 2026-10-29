import { Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function FilePreview() {
  return (
    <Button disabled variant="outlined" startIcon={<UploadFileIcon />}>
      Subir archivo
    </Button>
  );
}
