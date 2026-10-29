import { TextField } from "@mui/material";

export default function DateTimePreview() {
  return (
    <TextField
      fullWidth
      type="datetime-local"
      disabled
      InputLabelProps={{ shrink: true }}
    />
  );
}
