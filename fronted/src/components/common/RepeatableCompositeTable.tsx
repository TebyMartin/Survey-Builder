import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { CompositeField } from "../../types/surveys";

interface Props {
  fields: CompositeField[];
  value: Record<string, unknown>;
  error?: string;
  onChange: (value: Record<string, string[]>) => void;
}

function getFieldValues(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item ?? "")) : [];
}

export default function RepeatableCompositeTable({
  fields,
  value,
  error,
  onChange,
}: Props) {
  const rowCount = Math.max(
    0,
    ...fields.map((field) => getFieldValues(value[field.id ?? ""]).length),
  );

  const updateCell = (rowIndex: number, fieldId: string, cellValue: string) => {
    const updatedRows = Array.from({ length: rowCount }, (_, index) =>
      Object.fromEntries(
        fields.map((field) => [
          field.id ?? "",
          getFieldValues(value[field.id ?? ""])[index] ?? "",
        ]),
      ),
    );
    updatedRows[rowIndex][fieldId] = cellValue;

    onChange(
      Object.fromEntries(
        fields.map((field) => [
          field.id ?? "",
          updatedRows.map((row) => row[field.id ?? ""] ?? ""),
        ]),
      ),
    );
  };

  const addRow = () => {
    onChange(
      Object.fromEntries(
        fields.map((field) => [
          field.id ?? "",
          [...getFieldValues(value[field.id ?? ""]), ""],
        ]),
      ),
    );
  };

  const removeRow = (rowIndex: number) => {
    onChange(
      Object.fromEntries(
        fields.map((field) => [
          field.id ?? "",
          getFieldValues(value[field.id ?? ""]).filter(
            (_, index) => index !== rowIndex,
          ),
        ]),
      ),
    );
  };

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 1.5 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              {fields.map((field) => (
                <TableCell key={field.id}>{field.label}</TableCell>
              ))}
              <TableCell aria-label="Acciones" />
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: rowCount }, (_, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>{rowIndex + 1}</TableCell>
                {fields.map((field) => (
                  <TableCell key={field.id} sx={{ minWidth: 150 }}>
                    {field.type === "SELECT" || field.type === "RADIO" ? (
                      <TextField
                        select
                        fullWidth
                        size="small"
                        value={
                          getFieldValues(value[field.id ?? ""])[rowIndex] ?? ""
                        }
                        onChange={(event) =>
                          updateCell(
                            rowIndex,
                            field.id ?? "",
                            event.target.value,
                          )
                        }
                      >
                        <MenuItem value="">—</MenuItem>
                        {(field.options ?? []).map((option) => (
                          <MenuItem
                            key={option.id ?? option.value}
                            value={option.value}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <TextField
                        fullWidth
                        size="small"
                        type={
                          field.type === "NUMBER"
                            ? "number"
                            : field.type === "DATE"
                              ? "date"
                              : field.type === "TIME"
                                ? "time"
                                : field.type === "DATETIME"
                                  ? "datetime-local"
                                  : field.type === "EMAIL"
                                    ? "email"
                                    : field.type === "PHONE"
                                      ? "tel"
                                      : "text"
                        }
                        multiline={field.type === "LONG_TEXT"}
                        value={
                          getFieldValues(value[field.id ?? ""])[rowIndex] ?? ""
                        }
                        onChange={(event) =>
                          updateCell(rowIndex, field.id ?? "", event.target.value)
                        }
                      />
                    )}
                  </TableCell>
                ))}
                <TableCell padding="checkbox">
                  <IconButton
                    aria-label={`Eliminar fila ${rowIndex + 1}`}
                    color="error"
                    onClick={() => removeRow(rowIndex)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rowCount === 0 && (
              <TableRow>
                <TableCell colSpan={fields.length + 2}>
                  <Typography color="text.secondary" align="center">
                    Agregá una fila para cargar integrantes.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="outlined" startIcon={<AddIcon />} onClick={addRow}>
        Agregar integrante
      </Button>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
