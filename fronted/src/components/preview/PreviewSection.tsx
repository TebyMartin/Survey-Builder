import { Card, CardContent, Typography, Stack } from "@mui/material";
import PreviewQuestion from "./PreviewQuestion";
interface Props {
  section: any;
}

export default function PreviewSection({ section }: Props) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5">{section.title}</Typography>

        {section.description && (
          <Typography color="text.secondary" mb={3}>
            {section.description}
          </Typography>
        )}

        <Stack spacing={3}>
          {section.questions.map((question: any) => (
            <PreviewQuestion key={question.id} question={question} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
