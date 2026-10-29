import { Box, LinearProgress, Stack, Typography } from "@mui/material";

interface Props {
  answers: {
    label: string;
    count: number;
  }[];
}

export default function OptionResults({ answers }: Props) {
  const total = answers.reduce((acc, a) => acc + a.count, 0);

  return (
    <Stack spacing={2}>
      {answers.map((answer) => {
        const percentage =
          total === 0 ? 0 : Math.round((answer.count / total) * 100);

        return (
          <Box key={answer.label}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography>{answer.label}</Typography>

              <Typography color="text.secondary">
                {answer.count} ({percentage}%)
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 10,
                borderRadius: 5,
              }}
            />
          </Box>
        );
      })}
    </Stack>
  );
}
