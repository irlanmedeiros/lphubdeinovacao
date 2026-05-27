import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const preSchema = z.object({
  nome_completo: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().min(10).max(25),
  tipo_inscricao: z.enum(["individual", "equipe", "empresa"]),
});

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => preSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("registrations")
      .insert(data)
      .select("id, tipo_inscricao")
      .single();
    if (error) {
      if (error.code === "23505") {
        return { ok: false as const, error: "Este e-mail já foi cadastrado." };
      }
      console.error("submitRegistration error", error);
      return { ok: false as const, error: "Não foi possível enviar. Tente novamente." };
    }
    return { ok: true as const, id: row.id as string, tipo: row.tipo_inscricao as string };
  });

const memberSchema = z.object({
  nome: z.string().trim().min(2).max(150),
  cpf: z.string().trim().min(11).max(20),
  email: z.string().trim().email().max(255),
  telefone: z.string().trim().min(10).max(25),
  funcao: z.string().trim().min(1).max(150),
  area_atuacao: z.string().trim().min(1).max(150),
  formacao: z.string().trim().min(1).max(150),
});

const fullSchema = z.object({
  id: z.string().uuid(),
  // proposta
  titulo_proposta: z.string().trim().min(2).max(255),
  eixo_tematico: z.string().trim().min(1).max(255),
  estagio_ideia: z.string().trim().min(1).max(255),
  // proponente
  nome_completo: z.string().trim().min(2).max(150),
  cpf: z.string().trim().min(11).max(20),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().min(10).max(25),
  telefone: z.string().trim().max(25).optional().nullable(),
  endereco: z.string().trim().min(2).max(300),
  municipio: z.string().trim().min(2).max(150),
  estado: z.string().trim().length(2),
  cep: z.string().trim().min(8).max(10),
  // PF
  nome_social: z.string().trim().max(150).optional().nullable(),
  // PJ
  razao_social: z.string().trim().max(255).optional().nullable(),
  cnpj: z.string().trim().max(20).optional().nullable(),
  nome_fantasia: z.string().trim().max(255).optional().nullable(),
  representante_nome: z.string().trim().max(150).optional().nullable(),
  representante_cpf: z.string().trim().max(20).optional().nullable(),
  comprovacao_path: z.string().trim().max(500).optional().nullable(),
  // tipo + equipe
  tipo_inscricao: z.enum(["individual", "equipe", "empresa"]),
  membros: z.array(memberSchema).max(20).optional().default([]),
});

export const submitFullRegistration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => fullSchema.parse(input))
  .handler(async ({ data }) => {
    const { id, membros, ...patch } = data;
    if (data.tipo_inscricao === "empresa") {
      if (!patch.razao_social || !patch.cnpj || !patch.representante_nome || !patch.representante_cpf) {
        return { ok: false as const, error: "Preencha todos os dados da empresa e do representante legal." };
      }
    }
    if (data.tipo_inscricao === "equipe" && (!membros || membros.length < 1)) {
      return { ok: false as const, error: "Adicione ao menos um membro da equipe." };
    }

    const { error: updErr } = await supabaseAdmin
      .from("registrations")
      .update({ ...patch, cadastro_completo: true, status: "em_analise" })
      .eq("id", id);

    if (updErr) {
      console.error("submitFullRegistration update error", updErr);
      return { ok: false as const, error: "Não foi possível salvar. Verifique os dados e tente novamente." };
    }

    if (membros && membros.length) {
      await supabaseAdmin
        .from("registration_team_members")
        .delete()
        .eq("registration_id", id);
      const { error: memErr } = await supabaseAdmin
        .from("registration_team_members")
        .insert(membros.map((m) => ({ ...m, registration_id: id })));
      if (memErr) {
        console.error("team members insert error", memErr);
        return { ok: false as const, error: "Falha ao salvar membros da equipe." };
      }
    }

    return { ok: true as const };
  });

const uploadSchema = z.object({
  id: z.string().uuid(),
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(100),
  base64: z.string().min(1), // raw base64, no data: prefix
});

const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"];

export const uploadComprovacao = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => uploadSchema.parse(input))
  .handler(async ({ data }) => {
    if (!ALLOWED_MIME.includes(data.contentType)) {
      return { ok: false as const, error: "Formato inválido. Use PDF, JPG ou PNG." };
    }
    const bytes = Buffer.from(data.base64, "base64");
    if (bytes.length > 5 * 1024 * 1024) {
      return { ok: false as const, error: "Arquivo maior que 5 MB." };
    }
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
    const path = `${data.id}/${Date.now()}_${safeName}`;
    const { error } = await supabaseAdmin.storage
      .from("comprovacoes")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (error) {
      console.error("upload error", error);
      return { ok: false as const, error: "Falha no upload do arquivo." };
    }
    return { ok: true as const, path };
  });

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error("Erro ao verificar permissões");
  if (!data) throw new Error("Acesso negado");
}

export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

export const listRegistrations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return { registrations: data ?? [] };
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["novo", "em_analise", "contatado", "aprovado", "recusado"]).optional(),
  notas_admin: z.string().max(5000).nullable().optional(),
});

export const updateRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...patch } = data;
    const { error } = await supabaseAdmin.from("registrations").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
