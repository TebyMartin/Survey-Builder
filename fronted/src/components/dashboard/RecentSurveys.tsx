import {
  Card,
  CardContent,
  List,
  ListItem,
  Typography,
  Chip,
} from "@mui/material";

function translateStatus(status: string) {
  const translations: Record<string, string> = {
    PUBLISHED: "PUBLICADA",
    DRAFT: "BORRADOR",
    ARCHIVED: "ARCHIVADA",
    DELETED: "ELIMINADA",
  };

  return translations[status] || status;
}

function getStatusColor(
  status: string,
): "success" | "warning" | "info" | "error" | "default" {
  switch (status) {
    case "PUBLISHED":
      return "success";

    case "DRAFT":
      return "warning";

    case "ARCHIVED":
      return "info";

    case "DELETED":
      return "error";

    default:
      return "default";
  }
}

export default function RecentSurveys({ surveys }: any) {
  return (
    <Card sx={{ borderRadius: 4, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Últimas encuestas
        </Typography>

        <List>
          {surveys.map((survey: any) => (
            <ListItem
              key={survey.id}
              sx={{
                justifyContent: "space-between",
              }}
            >
              <Typography>{survey.title}</Typography>

              <Chip
                size="small"
                label={translateStatus(survey.status)}
                color={getStatusColor(survey.status)}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
