import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  propostaPartialSchema,
  cronogramaRowSchema,
  metaRowSchema,
  orcamentoRowSchema,
  indicadorRowSchema,
  entregaDocRowSchema,
  TABLE_KEYS,
} from "./proposta.schemas";

const TABLE_MAP = {
  cronograma: "registration_proposta_cronograma",
  metas: "registration_proposta_metas",
  orcamento: "registration_proposta_orcamento",
  indicadores: "registration_proposta_indicadores",
  entregas_documentais: "registration_proposta_entregas_documentais",
} as const;

const TIPO_ANEXO = ["evidencia_estagio", "registro_titularidade", "complementar"] as const;
const MIME_ANEXO_ALLOWED = [
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
const MAX_ANEXO_BYTES = 10 * 1024 * 1024;

// ============ getProposta ============
const getSchema = z.object({ id: z.string().uuid() });

export const getProposta = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => getSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: reg, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !reg) {
      return { ok: false as const, error: "Inscrição não encontrada." };
    }
    const [cron, metas, orc, ind, entD, arq] = await Promise.all([
      supabaseAdmin.from("registration_proposta_cronograma").select("*").eq("registration_id", data.id).order("ordem"),
      supabaseAdmin.from("registration_proposta_metas").select("*").eq("registration_id", data.id).order("ordem"),
      supabaseAdmin.from("registration_proposta_orcamento").select("*").eq("registration_id", data.id).order("ordem"),
      supabaseAdmin.from("registration_proposta_indicadores").select("*").eq("registration_id", data.id).order("ordem"),
      supabaseAdmin.from("registration_proposta_entregas_documentais").select("*").eq("registration_id", data.id).order("ordem"),
      supabaseAdmin.from("registration_proposta_arquivos").select("*").eq("registration_id", data.id).order("created_at"),
    ]);
    return {
      ok: true as const,
      registration: reg,
      cronograma: cron.data ?? [],
      metas: metas.data ?? [],
      orcamento: orc.data ?? [],
      indicadores: ind.data ?? [],
      entregas_documentais: entD.data ?? [],
      arquivos: arq.data ?? [],
    };
  });

// ============ savePropostaPartial ============
const patchSchema = z.object({
  id: z.string().uuid(),
  patch: propostaPartialSchema,
});

export const savePropostaPartial = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => patchSchema.parse(input))
  .handler(async ({ data }) => {
    // Strip undefined / null values? We allow nulls to clear.
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data.patch)) {
      if (v !== undefined) patch[k] = v;
    }
    if (Object.keys(patch).length === 0) {
      return { ok: true as const, updatedAt: new Date().toISOString() };
    }
    const { error } = await supabaseAdmin
      .from("registrations")
      .update(patch)
      .eq("id", data.id);
    if (error) {
      console.error("savePropostaPartial error", error);
      return { ok: false as const, error: "Falha ao salvar." };
    }
    return { ok: true as const, updatedAt: new Date().toISOString() };
  });

// ============ savePropostaTable ============
const tableSchema = z.discriminatedUnion("table", [
  z.object({ id: z.string().uuid(), table: z.literal("cronograma"), rows: z.array(cronogramaRowSchema).max(15) }),
  z.object({ id: z.string().uuid(), table: z.literal("metas"), rows: z.array(metaRowSchema).max(10) }),
  z.object({ id: z.string().uuid(), table: z.literal("orcamento"), rows: z.array(orcamentoRowSchema).max(20) }),
  z.object({ id: z.string().uuid(), table: z.literal("indicadores"), rows: z.array(indicadorRowSchema).max(10) }),
  z.object({ id: z.string().uuid(), table: z.literal("entregas_documentais"), rows: z.array(entregaDocRowSchema).max(20) }),
]);

export const savePropostaTable = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tableSchema.parse(input))
  .handler(async ({ data }) => {
    if (!TABLE_KEYS.includes(data.table)) {
      return { ok: false as const, error: "Tabela inválida." };
    }
    const tableName = TABLE_MAP[data.table];
    const { error: delErr } = await supabaseAdmin
      .from(tableName)
      .delete()
      .eq("registration_id", data.id);
    if (delErr) {
      console.error("savePropostaTable delete error", delErr);
      return { ok: false as const, error: "Falha ao salvar tabela." };
    }
    if (data.rows.length > 0) {
      const toInsert = data.rows.map((r, i) => ({
        ...r,
        ordem: i,
        registration_id: data.id,
      }));
      const { error: insErr } = await supabaseAdmin.from(tableName).insert(toInsert);
      if (insErr) {
        console.error("savePropostaTable insert error", insErr);
        return { ok: false as const, error: "Falha ao salvar tabela." };
      }
    }
    // Recompute total for orcamento
    if (data.table === "orcamento") {
      const total = data.rows.reduce((acc, r) => acc + (Number(r.valor) || 0), 0);
      await supabaseAdmin
        .from("registrations")
        .update({ valor_total_orcamento: total })
        .eq("id", data.id);
    }
    return { ok: true as const, updatedAt: new Date().toISOString() };
  });

// ============ uploadPropostaAnexo ============
const uploadSchema = z.object({
  id: z.string().uuid(),
  tipo: z.enum(TIPO_ANEXO),
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(100),
  base64: z.string().min(1),
});

export const uploadPropostaAnexo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => uploadSchema.parse(input))
  .handler(async ({ data }) => {
    if (!MIME_ANEXO_ALLOWED.includes(data.contentType)) {
      return { ok: false as const, error: "Formato de arquivo não permitido." };
    }
    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.length > MAX_ANEXO_BYTES) {
      return { ok: false as const, error: "Arquivo maior que 10 MB." };
    }
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
    const path = `${data.id}/${data.tipo}/${Date.now()}_${safeName}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("proposta-anexos")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (upErr) {
      console.error("upload anexo error", upErr);
      return { ok: false as const, error: "Falha no upload." };
    }
    const { data: row, error: insErr } = await supabaseAdmin
      .from("registration_proposta_arquivos")
      .insert({
        registration_id: data.id,
        tipo: data.tipo,
        path,
        filename: data.filename,
        mime: data.contentType,
        size_bytes: bytes.length,
      })
      .select("*")
      .single();
    if (insErr || !row) {
      console.error("insert anexo error", insErr);
      return { ok: false as const, error: "Falha ao registrar anexo." };
    }
    return { ok: true as const, anexo: row };
  });

const removeSchema = z.object({ id: z.string().uuid(), anexoId: z.string().uuid() });
export const removePropostaAnexo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => removeSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: row } = await supabaseAdmin
      .from("registration_proposta_arquivos")
      .select("path")
      .eq("id", data.anexoId)
      .eq("registration_id", data.id)
      .maybeSingle();
    if (row?.path) {
      await supabaseAdmin.storage.from("proposta-anexos").remove([row.path]);
    }
    await supabaseAdmin
      .from("registration_proposta_arquivos")
      .delete()
      .eq("id", data.anexoId)
      .eq("registration_id", data.id);
    return { ok: true as const };
  });

// ============ finalizarProposta ============
const finalizeSchema = z.object({ id: z.string().uuid() });

// Required text fields (proposta only — proponente data is already saved by submitFullRegistration)
const REQUIRED_TEXT_FIELDS: { field: string; min: number; label: string }[] = [
  { field: "titulo_proposta", min: 10, label: "Título da proposta" },
  { field: "eixo_tematico", min: 1, label: "Eixo temático" },
  { field: "justificativa_eixo", min: 50, label: "Justificativa do eixo" },
  { field: "resumo_executivo", min: 100, label: "Resumo executivo" },
  { field: "descricao_problema", min: 100, label: "Descrição do problema" },
  { field: "publico_afetado", min: 50, label: "Público afetado" },
  { field: "prejuizos", min: 50, label: "Prejuízos / gargalos" },
  { field: "evidencias_problema", min: 50, label: "Evidências do problema" },
  { field: "objetivo_geral", min: 50, label: "Objetivo geral" },
  { field: "objetivos_especificos", min: 50, label: "Objetivos específicos" },
  { field: "descricao_solucao", min: 100, label: "Descrição da solução" },
  { field: "funcionalidades", min: 50, label: "Funcionalidades principais" },
  { field: "utilizacao_admin_publica", min: 50, label: "Utilização na administração pública" },
  { field: "beneficio_populacao", min: 50, label: "Benefício para a população" },
  { field: "tipo_solucao_tecnologica", min: 1, label: "Tipo de solução tecnológica" },
  { field: "arquitetura_tecnologica", min: 50, label: "Arquitetura tecnológica" },
  { field: "modulos_telas", min: 50, label: "Módulos / telas" },
  { field: "tecnologias", min: 30, label: "Tecnologias e ferramentas" },
  { field: "estagio_desenvolvimento", min: 1, label: "Estágio de desenvolvimento" },
  { field: "estagio_descricao", min: 50, label: "Descrição do estágio atual" },
  { field: "metodologia", min: 100, label: "Metodologia" },
  { field: "detalhamento_etapas", min: 200, label: "Detalhamento das etapas" },
  { field: "entregas_tecnicas", min: 50, label: "Entregas técnicas" },
  { field: "descricao_metas", min: 50, label: "Descrição das metas" },
  { field: "publico_beneficiario_direto", min: 50, label: "Público beneficiário direto" },
  { field: "publico_beneficiario_indireto", min: 30, label: "Público beneficiário indireto" },
  { field: "estimativa_alcance", min: 50, label: "Estimativa de alcance" },
  { field: "areas_publicas", min: 30, label: "Áreas públicas" },
  { field: "processos_servicos", min: 50, label: "Processos / serviços a melhorar" },
  { field: "apoio_decisao", min: 50, label: "Apoio à tomada de decisão" },
  { field: "diferenciais", min: 50, label: "Diferenciais inovadores" },
  { field: "viabilidade_tecnica", min: 100, label: "Viabilidade técnica" },
  { field: "recursos_tecnicos", min: 50, label: "Recursos técnicos" },
  { field: "infraestrutura", min: 50, label: "Infraestrutura" },
  { field: "riscos", min: 50, label: "Riscos" },
  { field: "mitigacao_riscos", min: 50, label: "Mitigação dos riscos" },
  { field: "justificativa_orcamento", min: 100, label: "Justificativa do orçamento" },
  { field: "manutencao", min: 50, label: "Manutenção" },
  { field: "custos_continuos", min: 30, label: "Custos contínuos" },
  { field: "potencial_expansao", min: 1, label: "Potencial de expansão" },
  { field: "escalabilidade", min: 50, label: "Escalabilidade" },
  { field: "cenarios_replicacao", min: 50, label: "Cenários de replicação" },
  { field: "adaptacoes", min: 50, label: "Adaptações necessárias" },
  { field: "retorno_admin_publica", min: 50, label: "Retorno para a Administração Pública" },
  { field: "retorno_populacao", min: 50, label: "Retorno para a população" },
  { field: "retorno_inovatec", min: 50, label: "Retorno para a INOVATEC-JP" },
  { field: "retorno_ecossistema", min: 50, label: "Retorno para o ecossistema" },
  { field: "descricao_resultados", min: 100, label: "Descrição dos resultados" },
  { field: "trata_dados_pessoais", min: 1, label: "Tratamento de dados pessoais" },
  { field: "de_autoria", min: 1, label: "Autoria da proposta" },
];

export const finalizarProposta = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => finalizeSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: reg, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !reg) return { ok: false as const, errors: { _: "Inscrição não encontrada." } };

    const errors: Record<string, string> = {};

    for (const { field, min, label } of REQUIRED_TEXT_FIELDS) {
      const v = (reg as Record<string, unknown>)[field];
      if (typeof v !== "string" || v.trim().length < min) {
        errors[field] = `${label}: mínimo ${min} caracteres.`;
      }
    }

    // Conditional fields
    if (reg.tem_integracao === true && (!reg.detalhes_integracao || reg.detalhes_integracao.length < 30)) {
      errors.detalhes_integracao = "Detalhe as integrações (mínimo 30 caracteres).";
    }
    if (reg.tem_tecnologias_emergentes === true && (!reg.descricao_tecnologias_emergentes || reg.descricao_tecnologias_emergentes.length < 50)) {
      errors.descricao_tecnologias_emergentes = "Descreva as tecnologias emergentes (mínimo 50 caracteres).";
    }
    if (reg.tem_contrapartida === true && (!reg.descricao_contrapartida || reg.descricao_contrapartida.length < 50)) {
      errors.descricao_contrapartida = "Descreva a contrapartida (mínimo 50 caracteres).";
    }
    if (reg.trata_dados_pessoais === "sim") {
      if (!reg.tipos_dados_pessoais || reg.tipos_dados_pessoais.length < 30) errors.tipos_dados_pessoais = "Indique os dados (mínimo 30 caracteres).";
      if (!reg.medidas_seguranca || reg.medidas_seguranca.length < 50) errors.medidas_seguranca = "Descreva medidas de segurança (mínimo 50 caracteres).";
    }
    if (reg.tem_ia === true && (!reg.cuidados_ia || reg.cuidados_ia.length < 50)) {
      errors.cuidados_ia = "Descreva cuidados com IA (mínimo 50 caracteres).";
    }
    if (reg.usa_componentes_terceiros === true && (!reg.detalhes_componentes_terceiros || reg.detalhes_componentes_terceiros.length < 30)) {
      errors.detalhes_componentes_terceiros = "Detalhe os componentes de terceiros (mínimo 30 caracteres).";
    }
    if (reg.tem_registros === true && (!reg.detalhes_registros || reg.detalhes_registros.length < 30)) {
      errors.detalhes_registros = "Detalhe os registros / patentes (mínimo 30 caracteres).";
    }

    // Required child-table counts
    const [{ count: cronCount }, { count: metasCount }, { count: orcCount }, { count: indCount }, { count: entCount }] = await Promise.all([
      supabaseAdmin.from("registration_proposta_cronograma").select("*", { count: "exact", head: true }).eq("registration_id", data.id),
      supabaseAdmin.from("registration_proposta_metas").select("*", { count: "exact", head: true }).eq("registration_id", data.id),
      supabaseAdmin.from("registration_proposta_orcamento").select("*", { count: "exact", head: true }).eq("registration_id", data.id),
      supabaseAdmin.from("registration_proposta_indicadores").select("*", { count: "exact", head: true }).eq("registration_id", data.id),
      supabaseAdmin.from("registration_proposta_entregas_documentais").select("*", { count: "exact", head: true }).eq("registration_id", data.id).eq("checked", true),
    ]);

    if ((cronCount ?? 0) < 5) errors.cronograma = "Cronograma: preencha ao menos 5 linhas.";
    if ((metasCount ?? 0) < 3) errors.metas = "Metas: preencha ao menos 3 linhas.";
    if ((orcCount ?? 0) < 5) errors.orcamento = "Orçamento: preencha ao menos 5 itens.";
    if ((indCount ?? 0) < 3) errors.indicadores = "Indicadores: preencha ao menos 3 linhas.";
    if ((entCount ?? 0) < 3) errors.entregas_documentais = "Selecione ao menos 3 entregas documentais.";

    if (Object.keys(errors).length > 0) {
      return { ok: false as const, errors };
    }

    const { error: updErr } = await supabaseAdmin
      .from("registrations")
      .update({ cadastro_completo: true, status: "em_analise" })
      .eq("id", data.id);
    if (updErr) {
      console.error("finalizarProposta update error", updErr);
      return { ok: false as const, errors: { _: "Falha ao finalizar." } };
    }
    return { ok: true as const };
  });
