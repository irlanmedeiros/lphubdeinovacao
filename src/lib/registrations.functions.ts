import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const submitSchema = z.object({
  nome_completo: z.string().trim().min(2).max(150),
  cpf: z.string().trim().min(11).max(20),
  email: z.string().trim().email().max(255),
  whatsapp: z.string().trim().min(10).max(25),
  tipo_inscricao: z.enum(["individual", "equipe"]),
  eixo_tematico: z.string().trim().min(1).max(255),
  estagio_ideia: z.string().trim().min(1).max(255),
});

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("registrations").insert(data);
    if (error) {
      if (error.code === "23505") {
        return { ok: false as const, error: "Este e-mail já foi cadastrado." };
      }
      console.error("submitRegistration error", error);
      return { ok: false as const, error: "Não foi possível enviar. Tente novamente." };
    }
    return { ok: true as const };
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
