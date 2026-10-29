import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import ShortTextPreview from "./question-preview/ShortTextPreview";
import NumberPreview from "./question-preview/NumberPreview";
import DatePreview from "./question-preview/DatePreview";
import EmailPreview from "./question-preview/EmailPreview";
import PhonePreview from "./question-preview/PhonePreview";
import RadioPreview from "./question-preview/RadioPreview";
import CheckboxPreview from "./question-preview/CheckboxPreview";
import SelectPreview from "./question-preview/SelectPreview";
import MultiSelectPreview from "./question-preview/MultiSelectPreview";
import LongTextPreview from "./question-preview/LongTextpreview";
import TimePreview from "./question-preview/TimePreview";
import DateTimePreview from "./question-preview/DateTimePreview";
import ScalePreview from "./question-preview/ScalePreview";
import NpsPreview from "./question-preview/NpsPreview";
import FilePreview from "./question-preview/FilePreview";
import ImagePreview from "./question-preview/ImagePreview";
import GpsPreview from "./question-preview/GpsPreview";
import SignaturePreview from "./question-preview/SignaturePreview";
import QuestionMatrixRowsEditor from "./question-preview/QuestionMatrixRowsEditor.tsxQuestionMatrixRowsEditor";
import type { Question } from "../../types/builder";

interface Props {
  question: Question;
}

export default function QuestionPreview({ question }: Props) {
  const { type } = question;

  const renderPreview = () => {
    switch (type) {
      case "SHORT_TEXT":
        return <ShortTextPreview />;

      case "LONG_TEXT":
        return <LongTextPreview />;

      case "NUMBER":
        return <NumberPreview />;

      case "DATE":
        return <DatePreview />;

      case "EMAIL":
        return <EmailPreview />;

      case "PHONE":
        return <PhonePreview />;

      case "RADIO":
        return <RadioPreview question={question} />;

      case "CHECKBOX":
        return <CheckboxPreview question={question} />;

      case "SELECT":
        return <SelectPreview question={question} />;

      case "MULTISELECT":
        return <MultiSelectPreview question={question} />;

      case "TIME":
        return <TimePreview />;

      case "DATETIME":
        return <DateTimePreview />;

      case "SCALE":
        return <ScalePreview />;

      case "NPS":
        return <NpsPreview />;

      case "FILE":
        return <FilePreview />;

      case "IMAGE":
        return <ImagePreview />;

      case "GPS":
        return <GpsPreview />;

      case "SIGNATURE":
        return <SignaturePreview />;

      case "MATRIX":
        return <QuestionMatrixRowsEditor question={question} />;

      case "COMPOSITE":
        return question.isRepeatable ? (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Vista previa de tabla repetible
            </Typography>
            {question.compositeFields?.length ? (
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      {question.compositeFields.map((field, index) => (
                        <TableCell key={field.id ?? `${field.label}-${index}`}>
                          {field.label || `Campo ${index + 1}`}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[1, 2, 3].map((row) => (
                      <TableRow key={row}>
                        <TableCell>{row}</TableCell>
                        {question.compositeFields?.map((field, index) => (
                          <TableCell
                            key={field.id ?? `${field.label}-${index}`}
                            sx={{ height: 40 }}
                          />
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Agregá campos a la pregunta compuesta para definir las columnas.
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Activá “Mostrar los campos como una tabla con filas repetibles” para
            usar un cuadro como el de integrantes del hogar.
          </Typography>
        );

      default:
        return <ShortTextPreview />;
    }
  };

  return (
    <Box>
      {question.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            whiteSpace: "pre-line",
            fontSize: "0.9rem",
            lineHeight: 1.5,
          }}
        >
          {question.description}
        </Typography>
      )}

      {renderPreview()}
    </Box>
  );
}
