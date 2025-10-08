import { useState } from 'react';
import {
  Container, Typography, Box, TextField, Button, Paper, MenuItem, Alert, InputAdornment, IconButton, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../api/axios';

const roles = [
  { value: 'ROLE_ADMIN', label: 'Administrador' },
  { value: 'ROLE_USER', label: 'Usuário' },
];

const passwordRequirements = [
  { label: 'Mínimo 8 caracteres', test: (v: string) => v.length >= 8 },
  { label: 'Letra maiúscula', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Letra minúscula', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Número', test: (v: string) => /[0-9]/.test(v) },
  { label: 'Caractere especial', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export default function RegisterUserPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => !email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const validatePhone = (phone: string) => !phone || /^\+?\d{10,15}$/.test(phone.replace(/\D/g, ''));
  const isPasswordValid = passwordRequirements.every(r => r.test(password));
  const canSubmit = username && (email || phoneNumber) && isPasswordValid && role;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validateEmail(email)) {
      setError('E-mail inválido.');
      return;
    }
    if (!validatePhone(phoneNumber)) {
      setError('Telefone inválido. Use DDD e apenas números.');
      return;
    }
    if (!isPasswordValid) {
      setError('A senha não atende aos requisitos.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/signup', { username, email, phoneNumber, password, role });
      setSuccess('Usuário cadastrado com sucesso!');
      setUsername(''); setEmail(''); setPhoneNumber(''); setPassword(''); setRole('USER');
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Cadastrar Novo Usuário</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          {/* ... (restante do formulário igual ao seu AdminPage.tsx) ... */}
           <TextField
            label="Usuário"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            type="email"
            error={!!email && !validateEmail(email)}
            helperText={!!email && !validateEmail(email) ? 'E-mail inválido' : 'Opcional, mas obrigatório um dos campos: e-mail ou telefone'}
          />
          <TextField
            label="Telefone"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            type="tel"
            error={!!phoneNumber && !validatePhone(phoneNumber)}
            helperText={!!phoneNumber && !validatePhone(phoneNumber) ? 'Telefone inválido' : 'Opcional, mas obrigatório um dos campos: e-mail ou telefone'}
          />
          <TextField
            label="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Requisitos da senha:</Typography>
            <List dense>
              {passwordRequirements.map(req => (
                <ListItem key={req.label} sx={{ color: req.test(password) ? 'success.main' : 'text.secondary', py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    {req.test(password) ? '✔️' : '❌'}
                  </ListItemIcon>
                  <ListItemText primary={req.label} />
                </ListItem>
              ))}
            </List>
          </Box>
          <TextField
            select
            label="Perfil"
            value={role}
            onChange={e => setRole(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            {roles.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={!canSubmit || loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}