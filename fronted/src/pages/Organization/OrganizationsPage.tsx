import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BusinessIcon from "@mui/icons-material/Business";

import type { Organization } from "../../service/organizations.service";

import {
  useCreateOrganization,
  useDeleteOrganization,
  useOrganizations,
  useUpdateOrganization,
} from "../../hooks/useOrganizations";

import OrganizationForm from "../../components/organizations/OrganizationForm";

export default function OrganizationsPage() {
  const { data: organizations, isLoading, isError } = useOrganizations();

  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization();
  const deleteMutation = useDeleteOrganization();

  const [openDialog, setOpenDialog] = useState(false);

  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);

  const [organizationToDelete, setOrganizationToDelete] =
    useState<Organization | null>(null);

  const handleCreate = () => {
    setEditingOrganization(null);
    setOpenDialog(true);
  };

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }

    setOpenDialog(false);
    setEditingOrganization(null);
  };

  const handleSubmit = async (data: { name: string; slug: string }) => {
    try {
      if (editingOrganization) {
        await updateMutation.mutateAsync({
          id: editingOrganization.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      setOpenDialog(false);
      setEditingOrganization(null);
    } catch (error) {
      console.error("Error guardando organización:", error);
    }
  };

  const handleToggleActive = async (organization: Organization) => {
    try {
      await updateMutation.mutateAsync({
        id: organization.id,
        data: {
          isActive: !organization.isActive,
        },
      });
    } catch (error) {
      console.error("Error actualizando organización:", error);
    }
  };

  const handleDelete = async () => {
    if (!organizationToDelete) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(organizationToDelete.id);

      setOrganizationToDelete(null);
    } catch (error) {
      console.error("Error eliminando organización:", error);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">No se pudieron cargar las organizaciones.</Alert>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        py: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        boxSizing: "border-box",
      }}
    >
      {/* =========================
          HEADER
      ========================== */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        spacing={{
          xs: 2,
          sm: 3,
        }}
        mb={{
          xs: 3,
          md: 4,
        }}
      >
        {/* TÍTULO */}

        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={{
              xs: 1,
              sm: 2,
            }}
            alignItems="center"
            sx={{
              minWidth: 0,
            }}
          >
            <BusinessIcon
              color="primary"
              sx={{
                fontSize: {
                  xs: 32,
                  sm: 40,
                },
                flexShrink: 0,
              }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "1.7rem",
                  sm: "2rem",
                  md: "2.125rem",
                },
                lineHeight: 1.2,
                minWidth: 0,
                overflowWrap: "anywhere",
              }}
            >
              Organizaciones
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            mt={1}
            sx={{
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
              lineHeight: 1.5,
            }}
          >
            Administrá las organizaciones de la plataforma.
          </Typography>
        </Box>

        {/* BOTÓN NUEVA ORGANIZACIÓN */}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          fullWidth
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
            minWidth: {
              sm: 210,
            },
            borderRadius: 3,
            px: 3,
            py: 1.2,
            flexShrink: 0,
          }}
        >
          Nueva organización
        </Button>
      </Stack>

      {/* =========================
          TABLA
      ========================== */}

      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          maxWidth: "100%",
          borderRadius: {
            xs: 2,
            sm: 4,
          },
          boxShadow: 3,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <Table
          sx={{
            minWidth: 850,
            width: "100%",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  minWidth: 220,
                }}
              >
                <strong>Organización</strong>
              </TableCell>

              <TableCell
                sx={{
                  minWidth: 180,
                }}
              >
                <strong>Slug</strong>
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  minWidth: 100,
                }}
              >
                <strong>Usuarios</strong>
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  minWidth: 100,
                }}
              >
                <strong>Encuestas</strong>
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  minWidth: 110,
                }}
              >
                <strong>Estado</strong>
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  minWidth: 130,
                }}
              >
                <strong>Acciones</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {organizations?.map((organization) => (
              <TableRow key={organization.id} hover>
                {/* ORGANIZACIÓN */}

                <TableCell>
                  <Typography
                    fontWeight={600}
                    sx={{
                      maxWidth: 260,
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {organization.name}
                  </Typography>
                </TableCell>

                {/* SLUG */}

                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 220,
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {organization.slug}
                  </Typography>
                </TableCell>

                {/* USUARIOS */}

                <TableCell align="center">
                  {organization._count?.users ?? 0}
                </TableCell>

                {/* ENCUESTAS */}

                <TableCell align="center">
                  {organization._count?.surveys ?? 0}
                </TableCell>

                {/* ESTADO */}

                <TableCell align="center">
                  <Chip
                    label={organization.isActive ? "Activa" : "Inactiva"}
                    color={organization.isActive ? "success" : "default"}
                    size="small"
                    onClick={() => handleToggleActive(organization)}
                    sx={{
                      cursor: "pointer",
                    }}
                  />
                </TableCell>

                {/* ACCIONES */}

                <TableCell align="right">
                  <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="flex-end"
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(organization)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => setOrganizationToDelete(organization)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {/* SIN ORGANIZACIONES */}

            {(!organizations || organizations.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box
                    py={{
                      xs: 4,
                      sm: 6,
                    }}
                    px={2}
                  >
                    <BusinessIcon
                      sx={{
                        fontSize: {
                          xs: 42,
                          sm: 50,
                        },
                        color: "text.disabled",
                      }}
                    />

                    <Typography color="text.secondary" mt={2}>
                      No hay organizaciones creadas.
                    </Typography>

                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleCreate}
                      sx={{
                        mt: 2,
                        maxWidth: "100%",
                      }}
                    >
                      Crear primera organización
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* =========================
          DIALOG CREAR / EDITAR
      ========================== */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: {
              xs: "calc(100% - 24px)",
              sm: 600,
            },
            m: {
              xs: 1.5,
              sm: 2,
            },
            borderRadius: {
              xs: 3,
              sm: 4,
            },
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: {
              xs: 2.5,
              sm: 3,
            },
            py: {
              xs: 2,
              sm: 2.5,
            },
            fontSize: {
              xs: "1.2rem",
              sm: "1.4rem",
            },
            fontWeight: 700,
            lineHeight: 1.3,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {editingOrganization ? `Editar organización` : "Nueva organización"}
        </DialogTitle>

        <DialogContent
          sx={{
            px: {
              xs: 2.5,
              sm: 3,
            },
            pb: {
              xs: 2.5,
              sm: 3,
            },
            pt: {
              xs: 1.5,
              sm: 2,
            },
            overflowX: "hidden",
          }}
        >
          <OrganizationForm
            organization={editingOrganization}
            loading={createMutation.isPending || updateMutation.isPending}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* =========================
          DIALOG ELIMINAR
      ========================== */}

      <Dialog
        open={Boolean(organizationToDelete)}
        onClose={() => setOrganizationToDelete(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: {
              xs: "calc(100% - 24px)",
              sm: 444,
            },
            m: {
              xs: 1.5,
              sm: 2,
            },
            borderRadius: {
              xs: 3,
              sm: 4,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            px: {
              xs: 2.5,
              sm: 3,
            },
            py: {
              xs: 2,
              sm: 2.5,
            },
            fontSize: {
              xs: "1.2rem",
              sm: "1.4rem",
            },
            fontWeight: 700,
          }}
        >
          Eliminar organización
        </DialogTitle>

        <DialogContent
          sx={{
            px: {
              xs: 2.5,
              sm: 3,
            },
            pb: {
              xs: 2.5,
              sm: 3,
            },
          }}
        >
          <Typography
            mb={3}
            sx={{
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              lineHeight: 1.6,
            }}
          >
            ¿Estás seguro de que querés eliminar la organización{" "}
            <strong>{organizationToDelete?.name}</strong>?
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
            sx={{
              lineHeight: 1.6,
            }}
          >
            Esta acción eliminará la organización y puede afectar los datos
            relacionados.
          </Typography>

          <Stack
            direction={{
              xs: "column-reverse",
              sm: "row",
            }}
            spacing={1.5}
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              onClick={() => setOrganizationToDelete(null)}
              disabled={deleteMutation.isPending}
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
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
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
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
