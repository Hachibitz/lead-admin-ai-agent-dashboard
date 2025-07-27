import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TableSortLabel
} from '@mui/material';
import type { Lead } from '../types/lead.model';
import { statusMap, temperatureMap } from '../types/lead.model';

// Tipo para a configuração da ordenação
export type SortConfig = {
  field: string;
  direction: 'asc' | 'desc';
};

interface LeadsTableProps {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
  sortConfig: SortConfig;
  onSort: (field: string) => void;
}

// Cabeçalhos da tabela, para facilitar a renderização e ordenação
const headCells = [
  { id: 'name', label: 'Nome' },
  { id: 'vehicle', label: 'Veículo de Interesse' },
  { id: 'sendDate', label: 'Data do Contato' },
  { id: 'temperature', label: 'Temperatura', align: 'center' as const },
  { id: 'status', label: 'Status', align: 'center' as const },
];

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const getChipColor = (type: 'status' | 'temp', value: number | string): ChipColor => {
  if (type === 'temp') {
    let code = typeof value === 'string'
      ? Object.entries(temperatureMap).find(([, v]) => v.enum === value)?.[0]
      : value;
    code = Number(code);
    switch (code) {
      case 1: return 'info';
      case 2: return 'warning';
      case 3: return 'error';
      case 4: return 'success';
      default: return 'default';
    }
  }
  if (type === 'status') {
    let code = typeof value === 'string'
      ? Object.entries(statusMap).find(([, v]) => v.enum === value)?.[0]
      : value;
    code = Number(code);
    switch (code) {
      case 1: return 'primary';
      case 5: return 'success';
      case 7: return 'warning';
      default: return 'default';
    }
  }
  return 'default';
};

export function LeadsTable({ leads, onRowClick, sortConfig, onSort }: LeadsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="tabela de leads">
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.align || 'left'}
                sortDirection={sortConfig.field === headCell.id ? sortConfig.direction : false}
              >
                <TableSortLabel
                  active={sortConfig.field === headCell.id}
                  direction={sortConfig.field === headCell.id ? sortConfig.direction : 'asc'}
                  onClick={() => onSort(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
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
              <TableCell component="th" scope="row">{lead.name}</TableCell>
              <TableCell>{lead.vehicle || 'Não especificado'}</TableCell>
              <TableCell>{new Date(lead.sendDate!).toLocaleString('pt-BR')}</TableCell>
              <TableCell align="center">
                <Chip
                  label={
                    typeof lead.temperature === 'string'
                      ? Object.values(temperatureMap).find(v => v.enum === String(lead.temperature))?.label || lead.temperature
                      : temperatureMap[lead.temperature]?.label
                  }
                  color={getChipColor('temp', lead.temperature)}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={
                    typeof lead.status === 'string'
                      ? Object.values(statusMap).find(v => v.enum === String(lead.status))?.label || lead.status
                      : statusMap[lead.status]?.label
                  }
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