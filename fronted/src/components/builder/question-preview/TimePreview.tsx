import { TextField } from "@mui/material";

export default function TimePreview() {
  return (
    <TextField
      fullWidth
      type="time"
      disabled
      InputLabelProps={{ shrink: true }}
    />
  );
}
