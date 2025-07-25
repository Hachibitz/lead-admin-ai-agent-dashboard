import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  TableSortLabel, Box
} from '@mui/material';
import type { Lead } from '../types/lead.model';
import { statusMap, temperatureMap } from '../types/lead.model';

interface LeadsTableProps {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
}

// Helper para dar cor aos chips de status e temperatura
const getChipColor = (type: 'status' | 'temp', value: number) => {
  if (type === 'status') {
    if (value === 1) return 'warning'; // Aguardando
    if (value === 5) return 'success'; // Venda Realizada
    if (value === 7) return 'default'; // Encerrado
  }
  if (type === 'temp') {
    if (value === 1) return 'info';    // Fria
    if (value === 2) return 'secondary'; // Morna
    if (value === 3) return 'warning'; // Quente
    if (value === 4) return 'error';   // Super Lead
  }
  return 'default';
};


export function LeadsTable({ leads, onRowClick }: LeadsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela de leads">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Veículo de Interesse</TableCell>
            <TableCell>Data do Contato</TableCell>
            <TableCell align="center">Temperatura</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              hover
              onClick={() => onRowClick(lead)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell component="th" scope="row">
                {lead.name}
              </TableCell>
              <TableCell>{lead.vehicle || 'Não especificado'}</TableCell>
              <TableCell>{new Date(lead.sendDate!).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell align="center">
                <Chip 
                  label={temperatureMap[lead.temperature]} 
                  color={getChipColor('temp', lead.temperature)}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label={statusMap[lead.status]} 
                  color={getChipColor('status', lead.status)}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}