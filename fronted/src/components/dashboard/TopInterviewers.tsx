import {
  Card,
  CardContent,
  Avatar,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

interface Props {
  interviewers: any[];
}

export default function TopInterviewers({ interviewers }: Props) {
  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          🏆 Top entrevistadores
        </Typography>

        <Stack spacing={2}>
          {interviewers.map((user) => (
            <Stack key={user.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </Avatar>

                  <Stack>
                    <Typography fontWeight={600}>
                      {user.firstName} {user.lastName}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Entrevistador
                    </Typography>
                  </Stack>
                </Stack>

                <Typography fontWeight="bold">
                  {user._count.submissions}
                </Typography>
              </Stack>

              <Divider sx={{ mt: 2 }} />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
