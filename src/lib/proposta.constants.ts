// Constants for the DADOS DA PROPOSTA wizard

export const TIPOS_SOLUCAO = [
  "Sistema digital",
  "Plataforma tecnológica",
  "Software",
  "Aplicativo",
  "Painel inteligente de monitoramento",
  "Solução baseada em dados",
  "Solução baseada em automação",
  "Solução baseada em inteligência artificial",
  "Tecnologia integrada com componente sistêmico central",
  "Outro",
] as const;

export const ESTAGIOS_DESENVOLVIMENTO = [
  "Ideia inicial ainda não desenvolvida",
  "Protótipo conceitual",
  "Protótipo navegável",
  "MVP em desenvolvimento",
  "MVP já desenvolvido",
  "Solução em fase de testes",
  "Solução já utilizada em ambiente real",
  "Outro",
] as const;

export const ENTREGAS_DOCUMENTAIS_PADRAO = [
  "Plano de desenvolvimento da solução",
  "Relatórios de acompanhamento",
  "Documentação técnica básica",
  "Registro de testes e validações",
  "Relatório final de execução e resultados",
] as const;

export const CRONOGRAMA_SEED = [
  { etapa: "Etapa 1", atividade: "Diagnóstico e levantamento de requisitos", prazo_dias: 0, entrega: "" },
  { etapa: "Etapa 2", atividade: "Planejamento técnico da solução", prazo_dias: 0, entrega: "" },
  { etapa: "Etapa 3", atividade: "Desenvolvimento inicial/protótipo", prazo_dias: 0, entrega: "" },
  { etapa: "Etapa 4", atividade: "Desenvolvimento do MVP", prazo_dias: 0, entrega: "" },
  { etapa: "Etapa 5", atividade: "Testes e validação", prazo_dias: 0, entrega: "" },
  { etapa: "Etapa 6", atividade: "Ajustes e melhorias", prazo_dias: 0, entrega: "" },
  { etapa: "Etapa 7", atividade: "Documentação e apresentação final", prazo_dias: 0, entrega: "" },
];

export const ORCAMENTO_SEED = [
  { item: "Desenvolvimento de software", descricao: "", valor: 0 },
  { item: "Design de interface/experiência do usuário", descricao: "", valor: 0 },
  { item: "Infraestrutura tecnológica, hospedagem ou servidores", descricao: "", valor: 0 },
  { item: "Banco de dados, APIs, licenças ou ferramentas", descricao: "", valor: 0 },
  { item: "Testes, validação e homologação", descricao: "", valor: 0 },
  { item: "Documentação técnica", descricao: "", valor: 0 },
  { item: "Comunicação, apresentação e materiais institucionais", descricao: "", valor: 0 },
  { item: "Gestão do projeto", descricao: "", valor: 0 },
  { item: "Outros custos necessários", descricao: "", valor: 0 },
];

export const METAS_SEED = [
  { meta: "Meta 1", indicador: "", resultado: "", prazo: "" },
  { meta: "Meta 2", indicador: "", resultado: "", prazo: "" },
  { meta: "Meta 3", indicador: "", resultado: "", prazo: "" },
];

export const INDICADORES_SEED = [
  { indicador: "", metodo_medicao: "", resultado_esperado: "" },
  { indicador: "", metodo_medicao: "", resultado_esperado: "" },
  { indicador: "", metodo_medicao: "", resultado_esperado: "" },
];

export const MIME_ANEXO_ALLOWED = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_ANEXO_BYTES = 10 * 1024 * 1024;

export type PropostaStepKey =
  | "proponente"
  | "basica"
  | "solucao"
  | "execucao"
  | "orcamento"
  | "legal";

export const STEP_TITLES: Record<PropostaStepKey, string> = {
  proponente: "Proponente",
  basica: "Proposta",
  solucao: "Solução & Tecnologia",
  execucao: "Execução & Público",
  orcamento: "Orçamento & Resultados",
  legal: "Legal & Anexos",
};

export const STEP_ORDER: PropostaStepKey[] = [
  "proponente",
  "basica",
  "solucao",
  "execucao",
  "orcamento",
  "legal",
];
