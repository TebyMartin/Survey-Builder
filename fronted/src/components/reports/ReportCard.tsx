import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function ReportCard({ title, children }: Props) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        transition: ".25s",

        "&:hover": {
          boxShadow: 8,
        },

        display: "flex",
        flexDirection: "column",
        maxHeight: "650px",
      }}
    >
      <CardContent
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
          sx={{
            flexShrink: 0,
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "500px",
            pr: 1,

            "&::-webkit-scrollbar": {
              width: "6px",
            },

            "&::-webkit-scrollbar-thumb": {
              borderRadius: "10px",
            },
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
