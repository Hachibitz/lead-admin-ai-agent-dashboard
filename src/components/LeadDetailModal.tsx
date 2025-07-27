import { Modal, Box, Typography, IconButton, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import type { Lead } from '../types/lead.model';
import { subjectMap, statusMap, temperatureMap, portalMap } from '../types/lead.model';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'clamp(300px, 80vw, 800px)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
};

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  if (!lead) {
    return null;
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Modal open={!!lead} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h4" component="h2" gutterBottom>
          Detalhes do Lead: {lead.name}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* O código JSX abaixo já estava correto. O problema era apenas no import. */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1"><strong>Nome:</strong> {lead.name}</Typography>
            <Typography variant="subtitle1"><strong>Telefone:</strong> {lead.phone || 'N/A'}</Typography>
            <Typography variant="subtitle1"><strong>Email:</strong> {lead.email || 'N/A'}</Typography>
            <Typography variant="subtitle1"><strong>CPF:</strong> {lead.cpf || 'N/A'}</Typography>
            <Typography variant="subtitle1"><strong>Nascimento:</strong> {lead.birthday || 'N/A'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1"><strong>Veículo de Interesse:</strong> {lead.vehicle || 'N/A'}</Typography>
            <Typography variant="subtitle1"><strong>Placa:</strong> {lead.licensePlate || 'N/A'}</Typography>
            <Typography variant="subtitle1"><strong>Status:</strong> {statusMap[lead.status]?.label || 'Desconhecido'}</Typography>
            <Typography variant="subtitle1"><strong>Temperatura:</strong> {temperatureMap[lead.temperature]?.label || 'Desconhecida'}</Typography>
            <Typography variant="subtitle1"><strong>Portal:</strong> {portalMap[lead.portal]?.label || 'Desconhecido'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1"><strong>Assunto:</strong> {subjectMap[lead.subject]?.label || 'Desconhecido'}</Typography>
            <Typography variant="subtitle1"><strong>Data do Contato:</strong> {formatDate(lead.sendDate)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1"><strong>Mensagem:</strong></Typography>
            <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              {lead.message || 'Nenhuma mensagem.'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}