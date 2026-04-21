import { Timestamp } from "firebase/firestore";

export interface Professional {
  id?: string;
  ownerId: string;
  companyName: string; // Nome ou Razão Social
  service: string; // Título/Profissão
  description: string; // Resumo de conhecimentos/experiência
  whatsapp: string;
  city: string;
  category: string;
  isPremium?: boolean;
  rating?: number;
  createdAt: Timestamp;
}

export interface JobPost {
  id?: string;
  ownerId: string;
  creatorName: string;
  title: string; // Ex: Atendente para lanchonete
  description: string; // Detalhes do serviço
  hours: string; // Horário e diária
  urgency: "immediate" | "weekend" | "flexible";
  whatsapp: string;
  city: string;
  createdAt: Timestamp;
}

export interface Review {
  id?: string;
  professionalId: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: Timestamp;
}

export type Category = 
  | "manutencao" | "beleza" | "saude" | "educacao" | "pet" 
  | "tecnologia" | "eventos" | "fretes" | "casa" | "marketing" 
  | "consultoria" | "automotivo" | "gastronomia" | "outros";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "manutencao", label: "Manutenção e Obras" },
  { value: "casa", label: "Serviços Domésticos" },
  { value: "beleza", label: "Beleza e Estética" },
  { value: "saude", label: "Saúde e Bem-estar" },
  { value: "educacao", label: "Aulas e Educação" },
  { value: "pet", label: "Serviços Pet" },
  { value: "tecnologia", label: "Tecnologia e Informática" },
  { value: "marketing", label: "Marketing e Design" },
  { value: "fretes", label: "Fretes e Mudanças" },
  { value: "eventos", label: "Eventos e Festas" },
  { value: "consultoria", label: "Consultoria e Jurídico" },
  { value: "automotivo", label: "Serviços Automotivos" },
  { value: "gastronomia", label: "Gastronomia e Delivery" },
  { value: "outros", label: "Outros Serviços" },
];

export const TOP_CITIES_SP_INTERIOR = [
  "Barretos",
  "Colina",
  "Jaborandi",
  "Guaíra",
  "Bebedouro",
  "Olímpia",
  "Severínia",
  "Cajobi",
  "Monte Azul Paulista",
  "Altair",
  "Guaraci",
  "Morro Agudo",
  "Viradouro",
  "Terra Roxa",
  "Ipuã",
  "Sales Oliveira",
  "Nuporanga",
  "Orlândia",
  "São Joaquim da Barra",
  "Franca",
  "Ribeirão Preto",
  "Sertãozinho",
  "Jaboticabal",
  "Pitangueiras",
  "Taquaritinga"
];
