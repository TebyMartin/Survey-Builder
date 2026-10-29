import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

export default function RecentResponses({ responses }: any) {
  return (
    <Card sx={{ borderRadius: 4, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Últimas respuestas
        </Typography>

        <List>
          {responses.map((response: any) => (
            <ListItem
              key={response.id}
              sx={{
                display: "block",
              }}
            >
              <Typography fontWeight="bold">
                {response.interviewer?.firstName}{" "}
                {response.interviewer?.lastName}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {response.survey.title}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
