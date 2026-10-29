import { Rating, Stack } from "@mui/material";

export default function ScalePreview() {
  return (
    <Stack alignItems="flex-start">
      <Rating value={3} readOnly />
    </Stack>
  );
}
