import { useState } from 'react';
import { Box, Container, Paper, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import api from '../api/axios';

// Interface para definir a estrutura de uma mensagem
interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export function InternalChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/internal-chat', { message: input });
      const aiMessage: Message = { sender: 'ai', text: (data as { response: string }).response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.message || 'Falha ao comunicar com o assistente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
          <Typography variant="h5">Assistente Interno NilCar</Typography>
          <Typography variant="body2" color="textSecondary">Converse com a IA para obter informações do estoque.</Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{
              mb: 2,
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  backgroundColor: msg.sender === 'user' ? 'primary.main' : 'grey.200',
                  color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                  borderRadius: msg.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                  maxWidth: '70%'
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
           {loading && <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}><CircularProgress size={24} /></Box>}
           {error && <Alert severity="error">{error}</Alert>}
        </Box>

        <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={loading}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}