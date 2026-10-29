import {
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

const questionTypes = [
  { label: "Texto corto", value: "SHORT_TEXT" },
  { label: "Texto largo", value: "LONG_TEXT" },
  { label: "Número", value: "NUMBER" },
  { label: "Email", value: "EMAIL" },
  { label: "Teléfono", value: "PHONE" },
  { label: "Fecha", value: "DATE" },
  { label: "Radio", value: "RADIO" },
  { label: "Checkbox", value: "CHECKBOX" },
  { label: "Select", value: "SELECT" },
  { label: "Escala", value: "SCALE" },
  // { label: "GPS", value: "GPS" },
  // { label: "Firma", value: "SIGNATURE" },
  { label: "Matriz", value: "MATRIX" },
  { label: "Pregunta compleja", value: "COMPOSITE" },
];

export default function QuestionTypeDialog({ open, onClose, onSelect }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Tipo de pregunta</DialogTitle>

      <List>
        {questionTypes.map((type) => (
          <ListItemButton key={type.value} onClick={() => onSelect(type.value)}>
            <ListItemText primary={type.label} />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
}
