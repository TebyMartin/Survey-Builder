import { TextField } from "@mui/material";

export default function LongTextPreview() {
  return (
    <TextField
      fullWidth
      multiline
      rows={3}
      disabled
      placeholder="Respuesta larga"
      variant="outlined"
    />
  );
}
