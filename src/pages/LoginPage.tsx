import { useState } from 'react';
import api from '../api/axios';
import {
  Container, Paper, Typography, TextField, Button, Alert, Box, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth', { identifier: username, password });
      const token = (data as { token: string }).token;
      
      localStorage.setItem('token', token);

      const decoded = jwtDecode<DecodedToken>(token);
      localStorage.setItem('userRole', decoded.role); // <-- MUDANÇA AQUI

      const redirectTo = (location.state as any)?.from || '/leads';
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="Usuário"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            autoFocus
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
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}