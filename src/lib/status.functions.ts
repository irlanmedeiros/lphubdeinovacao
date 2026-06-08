import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const schema = z.object({
  identificador: z.string().trim().min(4).max(80),
  email: z.string().trim().email().max(255),
});

const STATUS_LABEL: Record<string, { label: string; tone: "green" | "blue" | "yellow" | "red" | "slate" }> = {
  novo: { label: "Recebido", tone: "blue" },
  em_analise: { label: "Em análise", tone: "blue" },
  contatado: { label: "Contatado", tone: "slate" },
  pendencias: { label: "Com pendências", tone: "yellow" },
  aprovado: { label: "Aprovado", tone: "green" },
  recusado: { label: "Não habilitado", tone: "red" },
};

export const consultarStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const ident = data.identificador.trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ident);
    const isProtocolo = /^INOVA-\d{4}-\d{1,8}$/i.test(ident);
    if (!isUuid && !isProtocolo) {
      return { ok: false as const, error: "Informe um Protocolo (INOVA-AAAA-XXXXXX) ou o ID da inscrição." };
    }
    let q = supabaseAdmin
      .from("registrations")
      .select(
        "id, protocolo, email, nome_completo, municipio, estado, cnpj, razao_social, titulo_proposta, eixo_tematico, status, status_message, cadastro_completo, comprovante_path, created_at, updated_at"
      );
    q = isUuid ? q.eq("id", ident) : q.eq("protocolo", ident.toUpperCase());
    const { data: reg } = await q.maybeSingle();
    if (!reg) return { ok: false as const, error: "Inscrição não encontrada." };
    if (reg.email.toLowerCase() !== data.email.toLowerCase()) {
      return { ok: false as const, error: "O e-mail informado não confere com a inscrição." };
    }

    const { data: arquivos } = await supabaseAdmin
      .from("registration_proposta_arquivos")
      .select("filename, tipo, size_bytes, created_at")
      .eq("registration_id", reg.id)
      .order("created_at");

    const label = STATUS_LABEL[reg.status] ?? { label: reg.status, tone: "slate" as const };

    return {
      ok: true as const,
      registration: {
        id: reg.id,
        protocolo: reg.protocolo,
        nome: reg.razao_social || reg.nome_completo,
        cnpj: reg.cnpj,
        localizacao: [reg.municipio, reg.estado].filter(Boolean).join("/"),
        titulo: reg.titulo_proposta,
        eixo: reg.eixo_tematico,
        cadastro_completo: reg.cadastro_completo,
        comprovante_disponivel: !!reg.comprovante_path,
        submetido_em: reg.created_at,
        atualizado_em: reg.updated_at,
        status: reg.status,
        statusLabel: label.label,
        statusTone: label.tone,
        statusMessage: reg.status_message,
      },
      arquivos: arquivos ?? [],
    };
  });
