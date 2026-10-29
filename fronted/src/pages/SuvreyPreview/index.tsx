import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { useBuilder } from "../../hooks/useBuilder";
import PreviewSection from "../../components/preview/PreviewSection";

export default function SurveyPreview() {
  const { id } = useParams();

  const { data, isLoading } = useBuilder(id!);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!data) {
    return <Typography>Encuesta no encontrada.</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        py: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        {data.title}
      </Typography>

      <Typography color="text.secondary" mb={4}>
        {data.description}
      </Typography>

      {data.sections.map((section) => (
        <PreviewSection key={section.id} section={section} />
      ))}
    </Box>
  );
}
