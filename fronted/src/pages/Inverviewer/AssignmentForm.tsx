import { useParams } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import { useAssignment } from "../../hooks/useAssigments";

export default function AssignmentForm() {
  const { id } = useParams();

  const { data, isLoading } = useAssignment(id!);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!data) {
    return <Typography>No se encontró la asignación.</Typography>;
  }

  return (
    <>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        {data.survey.title}
      </Typography>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
