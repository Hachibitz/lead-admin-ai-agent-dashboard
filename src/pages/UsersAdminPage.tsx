import { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Alert, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios';

const roles = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'USER', label: 'Usuário' },
];

export default function UsersAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [deleteUser, setDeleteUser] = useState<any | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/users');
      setUsers(data as any[]);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEditSave = async () => {
    setEditError(null);
    setEditSuccess(null);
    try {
      await api.put(`/users`, editUser);
      setEditSuccess('Usuário atualizado!');
      setTimeout(() => setEditUser(null), 1000);
      fetchUsers();
    } catch (err: any) {
      setEditError(err.message || 'Erro ao atualizar usuário.');
    }
  };

  const handleDelete = async () => {
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      await api.delete(`/users/${deleteUser.id}`);
      setDeleteSuccess('Usuário excluído!');
      setTimeout(() => setDeleteUser(null), 1000);
      fetchUsers();
    } catch (err: any) {
      setDeleteError(err.message || 'Erro ao excluir usuário.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Usuários cadastrados</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* USO DO LOADING: Mostra o spinner enquanto carrega, ou a tabela quando terminar. */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <CircularProgress />
        </div>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuário</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Perfil</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => setEditUser(user)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => setDeleteUser(user)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
        <DialogTitle>Editar usuário</DialogTitle>
        <DialogContent>
          {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}
          {editSuccess && <Alert severity="success" sx={{ mb: 2 }}>{editSuccess}</Alert>}
          <TextField label="Usuário" value={editUser?.username || ''} onChange={e => setEditUser((u: any) => ({ ...u, username: e.target.value }))} fullWidth sx={{ mb: 2, mt: 1 }} />
          <TextField label="E-mail" value={editUser?.email || ''} onChange={e => setEditUser((u: any) => ({ ...u, email: e.target.value }))} fullWidth sx={{ mb: 2 }} />
          <TextField label="Telefone" value={editUser?.phoneNumber || ''} onChange={e => setEditUser((u: any) => ({ ...u, phoneNumber: e.target.value }))} fullWidth sx={{ mb: 2 }} />
          <TextField select label="Perfil" value={editUser?.role || ''} onChange={e => setEditUser((u: any) => ({ ...u, role: e.target.value }))} fullWidth>
            {roles.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)}>
        <DialogTitle>Excluir usuário</DialogTitle>
        <DialogContent>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          {deleteSuccess && <Alert severity="success" sx={{ mb: 2 }}>{deleteSuccess}</Alert>}
          Tem certeza que deseja excluir o usuário <b>{deleteUser?.username}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUser(null)}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
