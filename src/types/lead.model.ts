// Interface que representa a estrutura de uma Lead
export interface Lead {
  id: number; // Adicionamos um ID para ser a chave na listagem
  name: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  birthday?: string | null;      // Formato: YYYY-MM-DD
  sendDate?: string | null;      // Formato: YYYY-MM-DD HH:MM:SS
  message?: string | null;
  subject: number;
  status: number;
  temperature: number;
  portal: number;
  vehicle?: string | null;
  licensePlate?: string | null;
}

// Mapeadores para transformar códigos em texto legível
export const subjectMap: { [key: number]: string } = {
  1: "Ligamos para você", 2: "Vender veículo", 3: "Solicite o seu carro",
  4: "Não encontrou o seu veículo", 5: "Simular financiamento", 6: "Estou interessado",
  7: "Fale conosco", 8: "Trabalhe conosco", 9: "Enviar proposta", 10: "Comprar/trocar veículo",
  11: "Contato Classificados", 12: "Contato via chat", 13: "Agenciamento", 14: "Chatbot",
  15: "Loja", 16: "Leads UTalk", 17: "Simulação via Credere"
};

export const statusMap: { [key: number]: string } = {
  1: "Aguardando contato",
  5: "Venda realizada",
  7: "Encerrado"
};

export const temperatureMap: { [key: number]: string } = {
  1: "Fria",
  2: "Morna",
  3: "Quente",
  4: "Super Lead"
};

export const portalMap: { [key: number]: string } = {
  1: "OLX", 2: "WebMotors", 3: "Vrum", 4: "Mercado Livre", 5: "ICarros", 6: "MeuCarango",
  7: "OQTDB", 8: "Tribuna do Norte", 9: "Carango", 10: "Autoline", 11: "Facebook",
  12: "Instagram", 13: "Youtube", 14: "Whatsapp", 15: "Site Próprio", 16: "Meu Carro Novo",
  17: "BomDaPeste", 18: "Moto.com.br", 19: "Portal Montadora", 20: "TROVIT", 21: "Seminovos BH",
  22: "Outros", 23: "Google", 24: "Mobiauto", 25: "Usados.br", 26: "Usados BR", 27: "Usadosbr",
  28: "Napista"
};