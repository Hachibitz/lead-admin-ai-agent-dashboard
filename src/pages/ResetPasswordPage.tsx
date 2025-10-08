import { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Alert, Box } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setSuccess('Senha redefinida com sucesso! Você será redirecionado para o login.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Token inválido, expirado ou erro ao redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Redefinir Senha</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField label="Código do E-mail" value={token} onChange={e => setToken(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          <TextField label="Nova Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          <TextField label="Confirmar Nova Senha" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} fullWidth required sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Nova Senha'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}