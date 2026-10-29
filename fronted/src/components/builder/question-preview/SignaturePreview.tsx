import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Button } from "@mui/material";

export default function SignaturePreview() {
  return (
    <Button disabled variant="outlined" startIcon={<BorderColorIcon />}>
      Firmar
    </Button>
  );
}
