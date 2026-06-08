import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";

type AnyRow = Record<string, unknown>;

interface BuildArgs {
  registration: AnyRow;
  membros: AnyRow[];
  arquivos: AnyRow[];
  assinaturaInfo: { ip: string | null; userAgent: string | null; timestamp: string };
}

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 50;
const NAVY = rgb(0.04, 0.13, 0.27);
const RED = rgb(0.85, 0.16, 0.18);
const GREY = rgb(0.35, 0.4, 0.47);

type Ctx = {
  doc: PDFDocument;
  font: PDFFont;
  bold: PDFFont;
  page: PDFPage;
  y: number;
};

function newPage(ctx: Ctx) {
  ctx.page = ctx.doc.addPage([PAGE_W, PAGE_H]);
  ctx.y = PAGE_H - MARGIN;
  // header bar
  ctx.page.drawRectangle({ x: 0, y: PAGE_H - 4, width: PAGE_W, height: 4, color: NAVY });
}

function ensureSpace(ctx: Ctx, needed: number) {
  if (ctx.y - needed < MARGIN + 30) newPage(ctx);
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  const paragraphs = (text || "").split(/\n/);
  for (const para of paragraphs) {
    const words = para.split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > maxWidth) {
        if (line) lines.push(line);
        line = w;
      } else line = test;
    }
    lines.push(line);
  }
  return lines;
}

function drawText(ctx: Ctx, text: string, opts: { size?: number; color?: ReturnType<typeof rgb>; bold?: boolean; indent?: number } = {}) {
  const size = opts.size ?? 10;
  const font = opts.bold ? ctx.bold : ctx.font;
  const color = opts.color ?? rgb(0.1, 0.12, 0.18);
  const x = MARGIN + (opts.indent ?? 0);
  const maxW = PAGE_W - MARGIN * 2 - (opts.indent ?? 0);
  const lines = wrap(text, font, size, maxW);
  for (const line of lines) {
    ensureSpace(ctx, size + 4);
    ctx.page.drawText(line, { x, y: ctx.y, size, font, color });
    ctx.y -= size + 3;
  }
}

function section(ctx: Ctx, title: string) {
  ctx.y -= 10;
  ensureSpace(ctx, 30);
  ctx.page.drawRectangle({ x: MARGIN, y: ctx.y - 2, width: 4, height: 14, color: RED });
  ctx.page.drawText(title.toUpperCase(), {
    x: MARGIN + 10,
    y: ctx.y,
    size: 12,
    font: ctx.bold,
    color: NAVY,
  });
  ctx.y -= 22;
}

function kv(ctx: Ctx, label: string, value: string | null | undefined) {
  if (!value) return;
  ensureSpace(ctx, 16);
  ctx.page.drawText(label, { x: MARGIN, y: ctx.y, size: 9, font: ctx.bold, color: GREY });
  const labelW = ctx.bold.widthOfTextAtSize(label, 9);
  drawTextAt(ctx, value, MARGIN + labelW + 6, ctx.y, 10);
}

function drawTextAt(ctx: Ctx, text: string, x: number, y: number, size: number) {
  const maxW = PAGE_W - x - MARGIN;
  const lines = wrap(text, ctx.font, size, maxW);
  let yy = y;
  for (const line of lines) {
    ctx.page.drawText(line, { x, y: yy, size, font: ctx.font, color: rgb(0.1, 0.12, 0.18) });
    yy -= size + 3;
  }
  ctx.y = Math.min(ctx.y, yy - 4);
}

function block(ctx: Ctx, label: string, value: string | null | undefined) {
  if (!value) return;
  ensureSpace(ctx, 30);
  ctx.page.drawText(label, { x: MARGIN, y: ctx.y, size: 9, font: ctx.bold, color: GREY });
  ctx.y -= 13;
  drawText(ctx, String(value), { size: 10 });
  ctx.y -= 4;
}

function footer(ctx: Ctx, pageNum: number, total: number, hash: string, protocolo: string) {
  const text = `Protocolo ${protocolo}  ·  SHA-256 ${hash.slice(0, 16)}…  ·  Página ${pageNum}/${total}`;
  ctx.page.drawText(text, {
    x: MARGIN,
    y: 24,
    size: 8,
    font: ctx.font,
    color: GREY,
  });
}

const FIELD_GROUPS: { title: string; fields: { key: string; label: string }[] }[] = [
  {
    title: "Fase 1 — Identificação e Problema",
    fields: [
      { key: "titulo_proposta", label: "Título da proposta" },
      { key: "eixo_tematico", label: "Eixo temático" },
      { key: "justificativa_eixo", label: "Justificativa do eixo" },
      { key: "resumo_executivo", label: "Resumo executivo" },
      { key: "descricao_problema", label: "Descrição do problema" },
      { key: "publico_afetado", label: "Público afetado" },
      { key: "prejuizos", label: "Prejuízos / gargalos" },
      { key: "evidencias_problema", label: "Evidências do problema" },
      { key: "objetivo_geral", label: "Objetivo geral" },
      { key: "objetivos_especificos", label: "Objetivos específicos" },
    ],
  },
  {
    title: "Fase 2 — Solução & Tecnologia",
    fields: [
      { key: "descricao_solucao", label: "Descrição da solução" },
      { key: "funcionalidades", label: "Funcionalidades" },
      { key: "utilizacao_admin_publica", label: "Utilização na adm. pública" },
      { key: "beneficio_populacao", label: "Benefício para a população" },
      { key: "tipo_solucao_tecnologica", label: "Tipo de solução" },
      { key: "arquitetura_tecnologica", label: "Arquitetura tecnológica" },
      { key: "modulos_telas", label: "Módulos / telas" },
      { key: "tecnologias", label: "Tecnologias" },
      { key: "estagio_desenvolvimento", label: "Estágio de desenvolvimento" },
      { key: "estagio_descricao", label: "Descrição do estágio" },
      { key: "metodologia", label: "Metodologia" },
      { key: "detalhamento_etapas", label: "Detalhamento das etapas" },
    ],
  },
  {
    title: "Fase 3 — Execução & Público",
    fields: [
      { key: "entregas_tecnicas", label: "Entregas técnicas" },
      { key: "descricao_metas", label: "Descrição das metas" },
      { key: "publico_beneficiario_direto", label: "Público beneficiário direto" },
      { key: "publico_beneficiario_indireto", label: "Público beneficiário indireto" },
      { key: "estimativa_alcance", label: "Estimativa de alcance" },
      { key: "areas_publicas", label: "Áreas públicas" },
      { key: "processos_servicos", label: "Processos / serviços" },
      { key: "apoio_decisao", label: "Apoio à decisão" },
      { key: "diferenciais", label: "Diferenciais" },
      { key: "viabilidade_tecnica", label: "Viabilidade técnica" },
      { key: "recursos_tecnicos", label: "Recursos técnicos" },
      { key: "infraestrutura", label: "Infraestrutura" },
      { key: "riscos", label: "Riscos" },
      { key: "mitigacao_riscos", label: "Mitigação de riscos" },
    ],
  },
  {
    title: "Fase 4 — Orçamento & Resultados",
    fields: [
      { key: "justificativa_orcamento", label: "Justificativa do orçamento" },
      { key: "manutencao", label: "Manutenção" },
      { key: "custos_continuos", label: "Custos contínuos" },
      { key: "potencial_expansao", label: "Potencial de expansão" },
      { key: "escalabilidade", label: "Escalabilidade" },
      { key: "cenarios_replicacao", label: "Cenários de replicação" },
      { key: "adaptacoes", label: "Adaptações" },
      { key: "retorno_admin_publica", label: "Retorno para adm. pública" },
      { key: "retorno_populacao", label: "Retorno para a população" },
      { key: "retorno_inovatec", label: "Retorno para a INOVATEC-JP" },
      { key: "retorno_ecossistema", label: "Retorno para o ecossistema" },
      { key: "descricao_resultados", label: "Descrição dos resultados" },
    ],
  },
  {
    title: "Fase 5 — Legal & Dados",
    fields: [
      { key: "trata_dados_pessoais", label: "Trata dados pessoais" },
      { key: "tipos_dados_pessoais", label: "Tipos de dados pessoais" },
      { key: "medidas_seguranca", label: "Medidas de segurança" },
      { key: "cuidados_ia", label: "Cuidados com IA" },
      { key: "de_autoria", label: "De autoria própria" },
      { key: "detalhes_componentes_terceiros", label: "Componentes de terceiros" },
      { key: "detalhes_registros", label: "Registros / patentes" },
    ],
  },
];

export async function buildComprovantePdf(args: BuildArgs): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ctx: Ctx = { doc, font, bold, page: null as unknown as PDFPage, y: 0 };
  newPage(ctx);

  const r = args.registration;
  const protocolo = (r.protocolo as string) ?? "—";
  const submittedAt = r.updated_at ? new Date(r.updated_at as string) : new Date();

  // === Capa ===
  ctx.page.drawRectangle({ x: 0, y: PAGE_H - 80, width: PAGE_W, height: 76, color: NAVY });
  ctx.page.drawText("INOVATEC-JP", { x: MARGIN, y: PAGE_H - 38, size: 16, font: bold, color: rgb(1, 1, 1) });
  ctx.page.drawText("Hub de Inovação · Edital Inova Soluções Públicas", {
    x: MARGIN,
    y: PAGE_H - 58,
    size: 9,
    font,
    color: rgb(0.8, 0.85, 0.95),
  });
  ctx.y = PAGE_H - 130;
  ctx.page.drawText("Comprovante de Submissão", { x: MARGIN, y: ctx.y, size: 22, font: bold, color: NAVY });
  ctx.y -= 28;
  ctx.page.drawRectangle({ x: MARGIN, y: ctx.y, width: 60, height: 3, color: RED });
  ctx.y -= 30;

  // Big protocolo box
  ctx.page.drawRectangle({
    x: MARGIN, y: ctx.y - 70, width: PAGE_W - MARGIN * 2, height: 70,
    color: rgb(0.96, 0.98, 1), borderColor: NAVY, borderWidth: 1,
  });
  ctx.page.drawText("PROTOCOLO", { x: MARGIN + 16, y: ctx.y - 22, size: 9, font: bold, color: GREY });
  ctx.page.drawText(protocolo, { x: MARGIN + 16, y: ctx.y - 48, size: 22, font: bold, color: NAVY });
  ctx.page.drawText(`Submetido em ${submittedAt.toLocaleString("pt-BR")}`, {
    x: MARGIN + 16, y: ctx.y - 62, size: 9, font, color: GREY,
  });
  ctx.y -= 90;

  drawText(ctx, "Este documento comprova a submissão da proposta abaixo descrita ao Edital Inova Soluções Públicas da INOVATEC-JP. Para consultar o status da inscrição, acesse a página de consulta no portal e informe o protocolo e o e-mail do responsável.", { size: 10, color: GREY });

  // === Proponente ===
  section(ctx, "Dados do Proponente");
  kv(ctx, "Tipo de inscrição:", String(r.tipo_inscricao ?? "—"));
  kv(ctx, "Nome / Responsável:", String(r.nome_completo ?? "—"));
  if (r.nome_social) kv(ctx, "Nome social:", String(r.nome_social));
  kv(ctx, "CPF:", String(r.cpf ?? "—"));
  kv(ctx, "E-mail:", String(r.email ?? "—"));
  kv(ctx, "WhatsApp:", String(r.whatsapp ?? "—"));
  if (r.telefone) kv(ctx, "Telefone:", String(r.telefone));
  kv(ctx, "Endereço:", String(r.endereco ?? "—"));
  kv(ctx, "Município/UF:", `${r.municipio ?? "—"} / ${r.estado ?? "—"}`);
  if (r.cep) kv(ctx, "CEP:", String(r.cep));

  if (r.tipo_inscricao === "empresa") {
    ctx.y -= 6;
    if (r.razao_social) kv(ctx, "Razão social:", String(r.razao_social));
    if (r.cnpj) kv(ctx, "CNPJ:", String(r.cnpj));
    if (r.nome_fantasia) kv(ctx, "Nome fantasia:", String(r.nome_fantasia));
    if (r.representante_nome) kv(ctx, "Representante legal:", String(r.representante_nome));
    if (r.representante_cpf) kv(ctx, "CPF do representante:", String(r.representante_cpf));
  }

  // === Equipe ===
  if (args.membros.length) {
    section(ctx, "Equipe");
    args.membros.forEach((m, i) => {
      ensureSpace(ctx, 60);
      drawText(ctx, `${i + 1}. ${m.nome ?? "—"} — ${m.funcao ?? "—"}`, { size: 10, bold: true });
      kv(ctx, "CPF:", String(m.cpf ?? "—"));
      kv(ctx, "E-mail:", String(m.email ?? "—"));
      kv(ctx, "Telefone:", String(m.telefone ?? "—"));
      kv(ctx, "Formação:", String(m.formacao ?? "—"));
      kv(ctx, "Área de atuação:", String(m.area_atuacao ?? "—"));
      ctx.y -= 4;
    });
  }

  // === Proposta (Fases) ===
  for (const group of FIELD_GROUPS) {
    const hasAny = group.fields.some((f) => {
      const v = r[f.key];
      return typeof v === "string" ? v.trim().length > 0 : v != null;
    });
    if (!hasAny) continue;
    section(ctx, group.title);
    for (const f of group.fields) {
      const v = r[f.key];
      if (v === null || v === undefined || v === "") continue;
      block(ctx, f.label, String(v));
    }
  }

  // === Anexos ===
  if (args.arquivos.length) {
    section(ctx, "Anexos enviados");
    args.arquivos.forEach((a) => {
      const sizeKb = a.size_bytes ? Math.round(Number(a.size_bytes) / 1024) : 0;
      ensureSpace(ctx, 14);
      drawText(ctx, `• [${a.tipo ?? "anexo"}] ${a.filename ?? "(sem nome)"} — ${sizeKb} KB`, { size: 9 });
    });
  }

  // === Assinatura digital ===
  section(ctx, "Aceite e Assinatura Digital");
  drawText(
    ctx,
    'Declaro, sob as penas da lei, que as informações prestadas neste formulário são verdadeiras, completas e atualizadas, e que estou ciente de que dados falsos podem ensejar a desclassificação da proposta e demais sanções cabíveis nos termos do Edital INOVATEC-JP e da legislação aplicável.',
    { size: 9, color: GREY }
  );
  ctx.y -= 6;
  kv(ctx, "Responsável:", String(r.nome_completo ?? "—"));
  if (r.cpf) kv(ctx, "CPF:", String(r.cpf));
  kv(ctx, "E-mail confirmado:", String(r.email ?? "—"));
  kv(ctx, "Data/Hora do aceite:", new Date(args.assinaturaInfo.timestamp).toLocaleString("pt-BR"));
  if (args.assinaturaInfo.ip) kv(ctx, "IP de origem:", args.assinaturaInfo.ip);
  if (args.assinaturaInfo.userAgent) kv(ctx, "Navegador:", args.assinaturaInfo.userAgent.slice(0, 120));

  ctx.y -= 14;
  ensureSpace(ctx, 40);
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y }, end: { x: MARGIN + 280, y: ctx.y },
    thickness: 0.8, color: NAVY,
  });
  ctx.y -= 12;
  ctx.page.drawText(`${r.nome_completo ?? "—"}`, { x: MARGIN, y: ctx.y, size: 9, font: bold, color: NAVY });
  ctx.y -= 11;
  ctx.page.drawText("Responsável pela proposta · Assinatura digital com hash de integridade", {
    x: MARGIN, y: ctx.y, size: 8, font, color: GREY,
  });

  // === Hash & footers (second pass) ===
  // First serialize to compute hash, then re-issue with the real hash in footers.
  const tempBytes = await doc.save();
  const hashBuf = await crypto.subtle.digest("SHA-256", new Uint8Array(tempBytes));
  const hash = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Draw footer on every page
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    p.drawText(`Protocolo ${protocolo}  ·  SHA-256 ${hash.slice(0, 16)}…  ·  Página ${i + 1}/${pages.length}`, {
      x: MARGIN, y: 24, size: 8, font, color: GREY,
    });
  });

  return doc.save();
}
