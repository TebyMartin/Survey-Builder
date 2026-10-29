import { Button, Stack } from "@mui/material";

export default function NpsPreview() {
  return (
    <Stack direction="row" spacing={1}>
      {Array.from({ length: 11 }).map((_, index) => (
        <Button key={index} variant="outlined" disabled sx={{ minWidth: 36 }}>
          {index}
        </Button>
      ))}
    </Stack>
  );
}
