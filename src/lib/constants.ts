export const EIXOS = [
  {
    id: "cidades",
    label: "Cidades Inteligentes, Infraestrutura e Sustentabilidade Urbana",
    short: "Cidades Inteligentes",
    kicker: "Infraestrutura e Sustentabilidade Urbana",
    icon: "🏙️",
    bg: "bg-[var(--brand-blue)]",
    desc: "Drenagem, iluminação, mobilidade, monitoramento ambiental, resíduos, eficiência energética e gestão de ativos urbanos.",
  },
  {
    id: "gestao",
    label: "Gestão Pública Inteligente, Dados e Eficiência Administrativa",
    short: "Gestão Pública Inteligente",
    kicker: "Dados e Eficiência Administrativa",
    icon: "📊",
    bg: "bg-[var(--brand-red)]",
    desc: "Automação de processos, inteligência institucional, transparência, integração de dados e suporte à tomada de decisão.",
  },
  {
    id: "servicos",
    label: "Serviços Públicos Digitais, Cidadania e Inclusão",
    short: "Serviços Públicos Digitais",
    kicker: "Cidadania e Inclusão",
    icon: "🤝",
    bg: "bg-[var(--brand-green)]",
    desc: "Saúde, educação, assistência social, atendimento ao cidadão, proteção de grupos prioritários e inclusão digital.",
  },
  {
    id: "comunicacao",
    label: "Comunicação Pública Inteligente, Mídias Digitais e Escuta Social",
    short: "Comunicação Pública",
    kicker: "Mídias Digitais e Escuta Social",
    icon: "📢",
    bg: "bg-[var(--brand-yellow)]",
    desc: "Gestão de redes, monitoramento de mídias, escuta social, combate à desinformação e campanhas de interesse público.",
  },
] as const;

export const ESTAGIOS = [
  "Ideia inicial ainda não desenvolvida",
  "Protótipo conceitual",
  "Protótipo navegável",
  "MVP em desenvolvimento",
  "MVP já desenvolvido",
  "Solução em fase de testes",
  "Solução já utilizada em ambiente real",
] as const;

export const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  novo: { label: "Novo", className: "bg-[var(--brand-blue)] text-white" },
  em_analise: { label: "Em análise", className: "bg-[var(--brand-yellow)] text-black" },
  contatado: { label: "Contatado", className: "bg-slate-500 text-white" },
  aprovado: { label: "Aprovado", className: "bg-[var(--brand-green)] text-white" },
  recusado: { label: "Recusado", className: "bg-[var(--brand-red)] text-white" },
};

export const STATUS_OPTIONS = ["novo", "em_analise", "contatado", "aprovado", "recusado"] as const;
