import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

type Props = Omit<TextFieldProps, "error" | "helperText"> & {
  error?: string;
};

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
