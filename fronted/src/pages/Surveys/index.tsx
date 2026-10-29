import { Typography, Tabs, Tab, Box, Stack } from "@mui/material";
import { useState } from "react";

import PollIcon from "@mui/icons-material/Poll";

import SurveyToolbar from "../../components/surveys/SurveyToolbar";
import SurveyTable from "../../components/surveys/SurveyTable";

export default function Surveys() {
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      {/* TÍTULO */}
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          mb: 3,
        }}
      >
        <PollIcon
          sx={{
            fontSize: {
              xs: 32,
              sm: 38,
            },
            color: "primary.main",
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: {
              xs: "1.8rem",
              md: "2.125rem",
            },
          }}
        >
          Encuestas
        </Typography>
      </Stack>

      <SurveyToolbar search={search} onSearchChange={setSearch} />

      <Box
        sx={{
          mt: 3,
          mb: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={status}
          onChange={(_, value) => setStatus(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Todas" value="ALL" />
          <Tab label="Borradores" value="DRAFT" />
          <Tab label="Publicadas" value="PUBLISHED" />
          <Tab label="Archivadas" value="ARCHIVED" />
        </Tabs>
      </Box>

      <SurveyTable status={status} search={search} />
    </Box>
  );
}
