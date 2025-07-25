import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import type { Lead } from '../types/lead.model';
import { LeadsTable } from '../components/LeadsTable';
import { LeadDetailModal } from '../components/LeadDetailModal';

// Dados mockados para simular a resposta da sua API.
// No futuro, você vai remover isso e fazer uma chamada fetch real.
const MOCK_LEADS: Lead[] = [
  { id: 1, name: 'João da Silva', email: 'joao@email.com', phone: '84999998888', cpf: '111.222.333-44', birthday: '1990-05-15', sendDate: '2025-07-24 10:30:00', message: 'Gostaria de saber mais sobre o financiamento do Onix.', subject: 5, status: 1, temperature: 3, portal: 14, vehicle: 'Chevrolet Onix 1.0', licensePlate: 'QWE-1234' },
  { id: 2, name: 'Maria Oliveira', email: 'maria@email.com', phone: '84988887777', sendDate: '2025-07-23 15:00:00', message: 'Tenho interesse no Corolla, podemos agendar uma visita?', subject: 6, status: 1, temperature: 4, portal: 15, vehicle: 'Toyota Corolla XEi' },
  { id: 3, name: 'Pedro Souza', phone: '84977776666', sendDate: '2025-07-22 09:12:00', message: 'Vi o anúncio no Instagram.', subject: 12, status: 5, temperature: 2, portal: 12, vehicle: 'Honda Civic Sport' },
  { id: 4, name: 'Ana Costa', email: 'ana.costa@email.com', phone: '84966665555', sendDate: '2025-07-21 20:45:00', message: 'Contato via site', subject: 7, status: 7, temperature: 1, portal: 22, vehicle: 'Hyundai HB20' }
];


export function LeadsPage() {
  // --- ESTADO (State) ---
  // A "memória" do nosso componente.
  
  // Armazena a lista de leads que vem da API. Inicia como um array vazio.
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Armazena a lead que foi clicada para ser exibida no modal. Inicia como null (nenhuma selecionada).
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Controla a exibição do ícone de carregamento.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Armazena mensagens de erro, caso a busca falhe.
  const [error, setError] = useState<string | null>(null);

  // --- EFEITOS (Effects) ---
  // Código que executa em resposta a eventos do ciclo de vida do componente.
  
  // useEffect com array de dependências vazio `[]` executa UMA VEZ, quando o componente "monta" na tela.
  // Perfeito para buscar dados iniciais.
  useEffect(() => {
    // Função para buscar os dados. `async` permite usar `await`.
    const fetchLeads = async () => {
      try {
        setIsLoading(true); // Começa a carregar
        setError(null); // Limpa erros anteriores

        // --- PONTO DE INTEGRAÇÃO COM O BACKEND ---
        // Aqui você vai substituir o mock pela chamada real.
        // const response = await fetch('http://localhost:8080/api/leads'); // Exemplo de URL
        // if (!response.ok) {
        //   throw new Error('Falha ao buscar os dados das leads.');
        // }
        // const data: Lead[] = await response.json();
        // setLeads(data);
        
        // Simulação com os dados mockados e um atraso de 1.5s
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLeads(MOCK_LEADS);

      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro inesperado.');
      } finally {
        setIsLoading(false); // Termina de carregar (com sucesso ou erro)
      }
    };

    fetchLeads(); // Chama a função que acabamos de definir.
  }, []); // O array vazio significa: "execute este efeito apenas uma vez".

  // --- HANDLERS (Manipuladores de Eventos) ---
  const handleOpenModal = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
  };

  // --- RENDERIZAÇÃO ---
  // O que o usuário vai ver na tela.
  
  // Se estiver carregando, mostra um spinner.
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Se der erro, mostra uma mensagem de alerta.
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Painel de Leads
      </Typography>
      
      <LeadsTable leads={leads} onRowClick={handleOpenModal} />
      
      <LeadDetailModal lead={selectedLead} onClose={handleCloseModal} />
    </Container>
  );
}