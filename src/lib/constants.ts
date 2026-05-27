export const EIXOS = [
  {
    id: "cidades",
    label: "Cidades Inteligentes, Infraestrutura e Sustentabilidade Urbana",
    short: "Cidades Inteligentes",
    icon: "🏙️",
    bg: "bg-[var(--brand-blue)]",
    desc: "Monitoramento, automação, drenagem, iluminação, mobilidade, eficiência energética, gestão de ativos urbanos.",
  },
  {
    id: "gestao",
    label: "Gestão Pública Inteligente, Dados e Eficiência Administrativa",
    short: "Gestão Pública",
    icon: "📊",
    bg: "bg-[var(--navy)]",
    desc: "Automação de processos, uso estratégico de dados, transparência, integração de informações, inteligência institucional.",
  },
  {
    id: "servicos",
    label: "Serviços Públicos Digitais, Cidadania e Inclusão",
    short: "Serviços Digitais",
    icon: "🤝",
    bg: "bg-[var(--brand-green)]",
    desc: "Acesso a serviços públicos, inclusão digital, saúde, educação, assistência social, proteção de grupos prioritários.",
  },
  {
    id: "comunicacao",
    label: "Comunicação Pública Inteligente, Mídias Digitais e Escuta Social",
    short: "Comunicação Pública",
    icon: "📢",
    bg: "bg-[var(--brand-red)]",
    desc: "Gestão de redes sociais, escuta social, combate à desinformação, atendimento digital, transparência.",
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
