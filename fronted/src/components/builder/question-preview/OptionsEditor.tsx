import { Button, Stack, TextField } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

interface Props {
  options: any[];
}

export default function OptionsEditor({ options }: Props) {
  return (
    <Stack spacing={1}>
      {options.map((option) => (
        <TextField key={option.id} size="small" defaultValue={option.label} />
      ))}

      <Button startIcon={<AddIcon />}>Agregar opción</Button>
    </Stack>
  );
}
