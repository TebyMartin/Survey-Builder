import { Card, CardContent, Typography } from "@mui/material";

interface Props {
  title: string;
  value: number;
}

export default function StatCard({ title, value }: Props) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>

        <Typography variant="h4" fontWeight="bold" mt={1}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
