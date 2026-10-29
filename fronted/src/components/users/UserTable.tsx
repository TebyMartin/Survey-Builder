import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Stack,
  Avatar,
} from "@mui/material";

import UserRowActions from "./UserRowActions";
import { useUsers } from "../../hooks/useUsers";
import RoleChip from "./RoleChip";
import StatusChip from "./StatusChip";

interface Props {
  search: string;
}

export default function UserTable({ search }: Props) {
  const { data = [], isLoading } = useUsers();

  const users = data.filter((user: any) => {
    const text = search.toLowerCase();

    return (
      user.firstName.toLowerCase().includes(text) ||
      user.lastName.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text)
    );
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (users.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center" }}>
        <Typography variant="h6">No hay usuarios</Typography>

        <Typography color="text.secondary">
          No existen usuarios registrados.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 700,
          }}
        >
          <TableHead
            sx={{
              "& .MuiTableCell-root": {
                bgcolor: "grey.100",
                fontWeight: 700,
                whiteSpace: "nowrap",
              },
            }}
          >
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user: any) => (
              <TableRow
                key={user.id}
                hover
                sx={{
                  "& td": {
                    py: 2,
                  },
                }}
              >
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      minWidth: 200,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </Avatar>

                    <Stack spacing={0} minWidth={0}>
                      <Typography fontWeight={600} noWrap>
                        {user.firstName} {user.lastName}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        Usuario
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>

                <TableCell>
                  <Typography fontWeight={500} noWrap>
                    {user.email}
                  </Typography>
                </TableCell>

                <TableCell>
                  <RoleChip role={user.role} />
                </TableCell>

                <TableCell>
                  <StatusChip active={user.isActive} />
                </TableCell>

                <TableCell align="center">
                  <UserRowActions user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
