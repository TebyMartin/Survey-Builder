import { Card, CardContent, Stack, Typography } from "@mui/material";

interface Props {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
}

export default function DashboardStatCard({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
        transition: ".25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack spacing={1}>
            <Typography color="text.secondary">{title}</Typography>

            <Typography variant="h3" fontWeight="bold">
              {value}
            </Typography>
          </Stack>

          <Stack
            sx={{
              bgcolor: color,
              color: "#fff",
              width: 56,
              height: 56,
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
