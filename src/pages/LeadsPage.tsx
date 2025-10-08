import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Box, Pagination } from '@mui/material';
import type { FilterValues, Lead } from '../types/lead.model';
import { LeadsTable, type SortConfig } from '../components/LeadsTable';
import { LeadDetailModal } from '../components/LeadDetailModal';
import { LeadsFilterBar } from '../components/LeadsFilterBar';
import { useDebounce } from '../hooks/useDebounce';
import type { Page } from '../types/pagination.model';
import { fetchWithAuth } from '../utils/fetchWithAuth';

// Estado inicial para os filtros, para facilitar o reset
const initialFilters: FilterValues = {
  searchText: '',
  status: '',
  temperature: '',
  portal: '',
  subject: ''
};

export function LeadsPage() {
  // --- ESTADO DA APLICAÇÃO ---
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- ESTADO DOS FILTROS (AGRUPADO) E PAGINAÇÃO ---
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // --- ESTADO DA ORDENAÇÃO ---
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'sendDate', direction: 'desc' });

  // Debounce para o campo de busca
  const debouncedSearchText = useDebounce(filters.searchText, 500);

  // --- EFEITO PRINCIPAL PARA BUSCAR DADOS ---
  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        // Filtros
        if (debouncedSearchText) params.append('searchText', debouncedSearchText);
        if (filters.status) params.append('status', filters.status);
        if (filters.temperature) params.append('temperature', filters.temperature);
        if (filters.portal) params.append('portal', filters.portal);
        if (filters.subject) params.append('subject', filters.subject);

        // Paginação e Ordenação
        params.append('page', page.toString());
        params.append('size', '10');
        params.append('sort', `${sortConfig.field},${sortConfig.direction}`);

        const response = await fetchWithAuth(`http://localhost:8091/api/leads?${params.toString()}`); //TODO() configurar variável de ambiente para dev e prod (k8s)
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
  }, [debouncedSearchText, filters.status, filters.temperature, filters.portal, filters.subject, page, sortConfig]);

  // --- HANDLERS (MANIPULADORES DE EVENTOS) ---
  const handleSort = (field: string) => {
    setPage(0); // Volta para a primeira página ao reordenar
    const isAsc = sortConfig.field === field && sortConfig.direction === 'asc';
    setSortConfig({ field, direction: isAsc ? 'desc' : 'asc' });
  };
  
  const handleFilterChange = (field: keyof FilterValues, value: string) => {
    setPage(0); // Volta para a primeira página ao aplicar um filtro
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [field]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setPage(0);
  };

  const handleSendMessage = async (lead: Lead) => {
    if (!lead.phone) {
      alert('Este lead não possui um número de telefone.');
      return;
    }
    
    // Pergunta ao agente antes de enviar
    if (!confirm(`Deseja enviar a mensagem de promoção para ${lead.name} no número ${lead.phone}?`)) {
      return;
    }

    try {
      // ATENÇÃO: Substitua pelo SID do seu template real do Twilio
      const templateSid = 'HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; 
      
      const requestBody = {
        // Formato esperado pelo Twilio: "whatsapp:+5511999998888"
        to: `whatsapp:${lead.phone.replace(/\D/g, '')}`, 
        templateSid: templateSid,
        variables: {
          // As chaves "1", "2", etc., correspondem a {{1}}, {{2}} no seu template
          '1': lead.name,
          '2': lead.vehicle || 'o veículo de seu interesse',
        }
      };

      const response = await fetchWithAuth('http://localhost:8091/api/whatsapp/messages/send-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Falha ao enviar mensagem: ${errorBody}`);
      }

      alert('Mensagem de promoção enviada com sucesso!');

    } catch (err: any) {
      console.error('Erro ao enviar mensagem via WhatsApp:', err);
      alert(err.message || 'Ocorreu um erro inesperado ao enviar a mensagem.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Painel de Leads do Nil
      </Typography>

      {/* --- SEÇÃO DE FILTROS AGORA É UM COMPONENTE --- */}
      <LeadsFilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <LeadsTable leads={leads} onRowClick={(lead) => setSelectedLead(lead)} sortConfig={sortConfig} onSort={handleSort} onSendMessage={handleSendMessage} />
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