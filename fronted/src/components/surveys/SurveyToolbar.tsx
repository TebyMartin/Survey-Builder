import { Button, Stack, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function SurveyToolbar({ search, onSearchChange }: Props) {
  const navigate = useNavigate();

  return (
    <Stack
      direction={{
        xs: "column",
        md: "row",
      }}
      spacing={2}
      justifyContent="space-between"
      mb={3}
    >
      <TextField
        placeholder="Buscar encuesta..."
        fullWidth
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate("/dashboard/surveys/new")}
      >
        Nueva encuesta
      </Button>
    </Stack>
  );
}
