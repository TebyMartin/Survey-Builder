import { useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import type {
  CreateOrganizationData,
  Organization,
} from "../../service/organizations.service";

interface Props {
  organization?: Organization | null;
  loading?: boolean;
  onSubmit: (data: CreateOrganizationData) => void;
  onCancel: () => void;
}

export default function OrganizationForm({
  organization,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(organization?.name ?? "");
  const [slug, setSlug] = useState(organization?.slug ?? "");

  const handleNameChange = (value: string) => {
    setName(value);

    // Solo generamos automáticamente el slug
    // cuando estamos creando.
    if (!organization) {
      const generatedSlug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      setSlug(generatedSlug);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    if (!slug.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      slug: slug.trim(),
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <Stack
        spacing={{
          xs: 2,
          sm: 3,
        }}
        sx={{
          width: "100%",
          minWidth: 0,
        }}
      >
        <TextField
          label="Nombre"
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
          fullWidth
          required
          autoFocus
          sx={{
            minWidth: 0,
          }}
          slotProps={{
            input: {
              sx: {
                minWidth: 0,
              },
            },
          }}
        />

        <TextField
          label="Slug"
          value={slug}
          onChange={(event) =>
            setSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"))
          }
          fullWidth
          required
          helperText="Identificador único de la organización"
          sx={{
            minWidth: 0,
          }}
        />

        <Stack
          direction={{
            xs: "column-reverse",
            sm: "row",
          }}
          spacing={1.5}
          justifyContent="flex-end"
          sx={{
            width: "100%",
            pt: {
              xs: 1,
              sm: 0,
            },
          }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            fullWidth
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              minWidth: {
                sm: 110,
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              minWidth: {
                sm: 150,
              },
            }}
          >
            {loading
              ? "Guardando..."
              : organization
              ? "Guardar cambios"
              : "Crear organización"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
