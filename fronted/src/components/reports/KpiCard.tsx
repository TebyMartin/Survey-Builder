import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}

export default function KpiCard({
  title,
  value,
  icon,
  color = "primary.main",
}: Props) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        boxShadow: 3,
        transition: "all .25s ease",
        cursor: "default",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight="bold"
            >
              {title}
            </Typography>

            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                bgcolor: color,
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                "& svg": {
                  fontSize: 28,
                },
              }}
            >
              {icon}
            </Box>
          </Stack>

          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Información actualizada
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
