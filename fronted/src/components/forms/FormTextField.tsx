import { TextField } from "@mui/material";

interface Props {
  label: string;
  error?: string;
  type?: string;
  [key: string]: any;
}

export default function FormTextField({
  label,
  error,
  type = "text",
  ...props
}: Props) {
  return (
    <TextField
      fullWidth
      margin="normal"
      label={label}
      type={type}
      error={!!error}
      helperText={error}
      {...props}
    />
  );
}
