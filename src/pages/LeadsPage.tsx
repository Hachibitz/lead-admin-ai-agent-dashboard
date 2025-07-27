import { useState, useEffect } from 'react';
import {
  Container, Typography, CircularProgress, Alert, Box, TextField,
  Select, MenuItem, InputLabel, FormControl, Button, Paper, Pagination
} from '@mui/material';
import { type Lead, statusMap, temperatureMap, portalMap, subjectMap } from '../types/lead.model';
import { LeadsTable, type SortConfig } from '../components/LeadsTable';
import { LeadDetailModal } from '../components/LeadDetailModal';
import { useDebounce } from '../hooks/useDebounce';
import type { Page } from '../types/pagination.model';

export function LeadsPage() {
  // --- ESTADO DA APLICAÇÃO ---
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- ESTADO DOS FILTROS E PAGINAÇÃO ---
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const [temperature, setTemperature] = useState('');
  const [portal, setPortal] = useState('');
  const [subject, setSubject] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // --- ESTADO DA ORDENAÇÃO ---
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'sendDate', direction: 'desc' });

  // Debounce para o campo de busca
  const debouncedSearchText = useDebounce(searchText, 500);

  // --- EFEITO PRINCIPAL PARA BUSCAR DADOS ---
  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        // Filtros
        if (debouncedSearchText) params.append('searchText', debouncedSearchText);
        if (status) params.append('status', status);
        if (temperature) params.append('temperature', temperature);
        if (portal) params.append('portal', portal);
        if (subject) params.append('subject', subject);

        // Paginação e Ordenação
        params.append('page', page.toString());
        params.append('size', '10');
        params.append('sort', `${sortConfig.field},${sortConfig.direction}`);

        const response = await fetch(`http://localhost:8091/api/leads?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar os dados dos leads.');
        }
        
        const data: Page<Lead> = await response.json();
        setLeads(data.content);
        setTotalPages(data.page.totalPages);

      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro inesperado.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [debouncedSearchText, status, temperature, portal, subject, page, sortConfig]); // Array de dependências

  // --- HANDLERS (MANIPULADORES DE EVENTOS) ---
  const handleSort = (field: string) => {
    const isAsc = sortConfig.field === field && sortConfig.direction === 'asc';
    setSortConfig({ field, direction: isAsc ? 'desc' : 'asc' });
  };
  
  const handleClearFilters = () => {
      setSearchText('');
      setStatus('');
      setTemperature('');
      setPortal('');
      setSubject('');
      setPage(0);
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Painel de Leads
      </Typography>

      {/* --- SEÇÃO DE FILTROS --- */}
      <Box component={Paper} elevation={2} sx={{ p: 2, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField 
          label="Buscar por nome, email..."
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, minWidth: '200px' }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value=""><em>Todos</em></MenuItem>
            {Object.entries(statusMap).map(([code, value]) => (
              <MenuItem key={code} value={value.enum}>{value.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Temperatura</InputLabel>
          <Select value={temperature} label="Temperatura" onChange={(e) => setTemperature(e.target.value)}>
            <MenuItem value=""><em>Todas</em></MenuItem>
            {Object.entries(temperatureMap).map(([code, value]) => (
              <MenuItem key={code} value={value.enum}>{value.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Portal</InputLabel>
          <Select value={portal} label="Portal" onChange={(e) => setPortal(e.target.value)}>
            <MenuItem value=""><em>Todos</em></MenuItem>
            {Object.entries(portalMap).map(([code, value]) => (
              <MenuItem key={code} value={value.enum}>{value.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Assunto</InputLabel>
          <Select value={subject} label="Assunto" onChange={(e) => setSubject(e.target.value)}>
            <MenuItem value=""><em>Todos</em></MenuItem>
            {Object.entries(subjectMap).map(([code, value]) => (
              <MenuItem key={code} value={value.enum}>{value.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={handleClearFilters}>Limpar Filtros</Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <LeadsTable leads={leads} onRowClick={(lead) => setSelectedLead(lead)} sortConfig={sortConfig} onSort={handleSort} />
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(_e, value) => setPage(value - 1)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </Container>
  );
}