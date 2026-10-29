import { Box, Typography } from "@mui/material";

import type { SurveyQuestion } from "../../types/surveys";
import type { ReactNode } from "react";

interface Props {
  question: SurveyQuestion;
  children: ReactNode;
}

export default function QuestionContainer({ question, children }: Props) {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 3,
        p: 3,
        mb: 3,

        borderLeft: "6px solid transparent",

        transition: ".2s",

        "&:hover": {
          boxShadow: 2,
        },

        "&:focus-within": {
          borderLeftColor: "#673ab7",
          boxShadow: 3,
        },
      }}
    >
      <Typography variant="h6" fontWeight="600" mb={1}>
        {question.title}

        {question.required && (
          <Typography
            component="span"
            color="error"
            sx={{
              mt: 1,
              display: "block",
            }}
          >
            {" "}
            *
          </Typography>
        )}
      </Typography>

      {question.description && (
        <Typography color="text.secondary" mt={1} mb={2}>
          {question.description}
        </Typography>
      )}

      {children}
    </Box>
  );
}
