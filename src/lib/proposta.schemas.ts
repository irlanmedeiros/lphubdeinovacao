import { z } from "zod";

// Helper: optional string with max
const optStr = (max: number) => z.string().trim().max(max).optional().nullable();
const optBool = () => z.boolean().optional().nullable();

// Partial schema — every field optional. Used by autosave (savePropostaPartial).
export const propostaPartialSchema = z.object({
  // Básica
  titulo_proposta: optStr(150),
  eixo_tematico: optStr(255),
  justificativa_eixo: optStr(2000),
  resumo_executivo: optStr(3000),
  descricao_problema: optStr(3000),
  publico_afetado: optStr(2000),
  prejuizos: optStr(2000),
  evidencias_problema: optStr(2000),
  objetivo_geral: optStr(1500),
  objetivos_especificos: optStr(2000),

  // Solução & Tecnologia
  descricao_solucao: optStr(4000),
  funcionalidades: optStr(2000),
  utilizacao_admin_publica: optStr(2000),
  beneficio_populacao: optStr(2000),
  tipo_solucao_tecnologica: optStr(255),
  tipo_solucao_tecnologica_outro: optStr(255),
  arquitetura_tecnologica: optStr(2000),
  modulos_telas: optStr(2000),
  tem_integracao: optBool(),
  detalhes_integracao: optStr(1500),
  tecnologias: optStr(1500),
  estagio_desenvolvimento: optStr(255),
  estagio_desenvolvimento_outro: optStr(255),
  estagio_descricao: optStr(2000),
  metodologia: optStr(3000),
  detalhamento_etapas: optStr(5000),

  // Execução & Público
  entregas_tecnicas: optStr(2000),
  outras_entregas: optStr(1500),
  descricao_metas: optStr(2000),
  publico_beneficiario_direto: optStr(1500),
  publico_beneficiario_indireto: optStr(1500),
  estimativa_alcance: optStr(1500),
  areas_publicas: optStr(1500),
  processos_servicos: optStr(1500),
  apoio_decisao: optStr(2000),
  diferenciais: optStr(2000),
  tem_tecnologias_emergentes: optBool(),
  descricao_tecnologias_emergentes: optStr(1500),
  viabilidade_tecnica: optStr(2000),
  recursos_tecnicos: optStr(1500),
  infraestrutura: optStr(1500),
  riscos: optStr(1500),
  mitigacao_riscos: optStr(1500),
  capacidade_equipe: optStr(2000),

  // Orçamento & Resultados
  justificativa_orcamento: optStr(2000),
  tem_contrapartida: optBool(),
  descricao_contrapartida: optStr(1500),
  manutencao: optStr(1500),
  custos_continuos: optStr(1500),
  potencial_expansao: optStr(20),
  escalabilidade: optStr(1500),
  cenarios_replicacao: optStr(1500),
  adaptacoes: optStr(1500),
  retorno_admin_publica: optStr(1500),
  retorno_populacao: optStr(1500),
  retorno_inovatec: optStr(1500),
  retorno_ecossistema: optStr(1500),
  descricao_resultados: optStr(2000),

  // Legal & Anexos
  trata_dados_pessoais: optStr(20),
  tipos_dados_pessoais: optStr(1500),
  medidas_seguranca: optStr(2000),
  tem_ia: optBool(),
  cuidados_ia: optStr(1500),
  de_autoria: optStr(20),
  usa_componentes_terceiros: optBool(),
  detalhes_componentes_terceiros: optStr(1500),
  tem_registros: optBool(),
  detalhes_registros: optStr(1500),
  lista_anexos: optStr(3000),
  links_externos: optStr(2000),
});

export type PropostaPartial = z.infer<typeof propostaPartialSchema>;

// Row schemas for dynamic tables
export const cronogramaRowSchema = z.object({
  etapa: z.string().trim().max(150).default(""),
  atividade: z.string().trim().max(500).default(""),
  prazo_dias: z.number().int().min(0).max(10000).default(0),
  entrega: z.string().trim().max(500).default(""),
});
export const metaRowSchema = z.object({
  meta: z.string().trim().max(150).default(""),
  indicador: z.string().trim().max(500).default(""),
  resultado: z.string().trim().max(500).default(""),
  prazo: z.string().trim().max(150).default(""),
});
export const orcamentoRowSchema = z.object({
  item: z.string().trim().max(255).default(""),
  descricao: z.string().trim().max(500).default(""),
  valor: z.number().min(0).max(99_999_999).default(0),
});
export const indicadorRowSchema = z.object({
  indicador: z.string().trim().max(255).default(""),
  metodo_medicao: z.string().trim().max(500).default(""),
  resultado_esperado: z.string().trim().max(500).default(""),
});
export const entregaDocRowSchema = z.object({
  entrega: z.string().trim().max(255).default(""),
  checked: z.boolean().default(false),
});

export type CronogramaRow = z.infer<typeof cronogramaRowSchema>;
export type MetaRow = z.infer<typeof metaRowSchema>;
export type OrcamentoRow = z.infer<typeof orcamentoRowSchema>;
export type IndicadorRow = z.infer<typeof indicadorRowSchema>;
export type EntregaDocRow = z.infer<typeof entregaDocRowSchema>;

export const TABLE_KEYS = ["cronograma", "metas", "orcamento", "indicadores", "entregas_documentais"] as const;
export type TableKey = (typeof TABLE_KEYS)[number];
