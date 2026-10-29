import { TextField } from "@mui/material";

export default function DatePreview() {
  return (
    <TextField
      fullWidth
      disabled
      type="date"
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
