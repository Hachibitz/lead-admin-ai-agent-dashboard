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
export const subjectMap: { [key: number]: { label: string; enum: string } } = {
  1: { label: "Ligamos para você", enum: "CALL_YOU" },
  2: { label: "Vender veículo", enum: "SELL_VEHICLE" },
  3: { label: "Solicite o seu carro", enum: "REQUEST_CAR" },
  4: { label: "Não encontrou o seu veículo", enum: "NOT_FOUND" },
  5: { label: "Simular financiamento", enum: "SIMULATE_FINANCING" },
  6: { label: "Estou interessado", enum: "INTERESTED" },
  7: { label: "Fale conosco", enum: "CONTACT_US" },
  8: { label: "Trabalhe conosco", enum: "WORK_WITH_US" },
  9: { label: "Enviar proposta", enum: "SEND_PROPOSAL" },
  10: { label: "Comprar/trocar veículo", enum: "BUY_CHANGE_VEHICLE" },
  11: { label: "Contato Classificados", enum: "CLASSFIEDS_CONTACT" },
  12: { label: "Contato via chat", enum: "CHAT_CONTACT" },
  13: { label: "Agenciamento", enum: "SALES_AGENCY" },
  14: { label: "Chatbot", enum: "CHATBOT_CONTACT" },
  15: { label: "Loja", enum: "STORE_CONTACT" },
  16: { label: "Leads UTalk", enum: "LEADS_UTALK" },
  17: { label: "Simulação via Credere", enum: "CREDERE_SIMULATION" }
};

export const statusMap: { [key: number]: { label: string; enum: string } } = {
  1: { label: "Aguardando contato", enum: "WAITING_CONTACT" },
  5: { label: "Venda realizada", enum: "SALE_MADE" },
  7: { label: "Encerrado", enum: "CLOSED" }
};

export const temperatureMap: { [key: number]: { label: string; enum: string } } = {
  1: { label: "Fria", enum: "COLD" },
  2: { label: "Morna", enum: "WARM" },
  3: { label: "Quente", enum: "HOT" },
  4: { label: "Super Lead", enum: "SUPER_LEAD" }
};

export const portalMap: { [key: number]: { label: string; enum: string } } = {
  1: { label: "OLX", enum: "OLX" },
  2: { label: "WebMotors", enum: "WEBMOTORS" },
  3: { label: "Vrum", enum: "VRUM" },
  4: { label: "Mercado Livre", enum: "MERCADO_LIVRE" },
  5: { label: "ICarros", enum: "ICARROS" },
  6: { label: "MeuCarango", enum: "MEUCARANGO" },
  7: { label: "OQTDB", enum: "OQTDB" },
  8: { label: "Tribuna do Norte", enum: "TRIBUNA_DO_NORTE" },
  9: { label: "Carango", enum: "CARANGO" },
  10: { label: "Autoline", enum: "AUTOLINE" },
  11: { label: "Facebook", enum: "FACEBOOK" },
  12: { label: "Instagram", enum: "INSTAGRAM" },
  13: { label: "Youtube", enum: "YOUTUBE" },
  14: { label: "Whatsapp", enum: "WHATSAPP" },
  15: { label: "Site Próprio", enum: "SITE_PROPRIO" },
  16: { label: "Meu Carro Novo", enum: "MEU_CARRO_NOVO" },
  17: { label: "BomDaPeste", enum: "BOMDAPESTE" },
  18: { label: "Moto.com.br", enum: "MOTO_COM_BR" },
  19: { label: "Portal Montadora", enum: "PORTAL_MONTADORA" },
  20: { label: "TROVIT", enum: "TROVIT" },
  21: { label: "Seminovos BH", enum: "SEMINOVOS_BH" },
  22: { label: "Outros", enum: "OTHER" },
  23: { label: "Google", enum: "GOOGLE" },
  24: { label: "Mobiauto", enum: "MOBIAUTO" },
  25: { label: "Usados.br", enum: "USADOS_BR_PONTO" },
  26: { label: "Usados BR", enum: "USADOS_BR" },
  27: { label: "Usadosbr", enum: "USADOSBR" },
  28: { label: "Napista", enum: "NAPISTA" }
};