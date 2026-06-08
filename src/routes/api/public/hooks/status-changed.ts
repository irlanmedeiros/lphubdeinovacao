import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendInscricaoEmail } from "@/lib/emails.functions";

const STATUS_LABELS: Record<string, string> = {
  novo: "Recebido",
  em_analise: "Em análise",
  contatado: "Contatado",
  pendencias: "Com pendências",
  aprovado: "Aprovado",
  recusado: "Não habilitado",
};

const schema = z.object({
  registration_id: z.string().uuid(),
  old_status: z.string().optional().nullable(),
  new_status: z.string(),
  status_message: z.string().optional().nullable(),
});

export const Route = createFileRoute("/api/public/hooks/status-changed")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Bearer-token check (any of: anon, publishable, service role).
        // pg_cron / pg_net sends `apikey: <anon>`; service_role calls from
        // edge tools send `authorization: Bearer <service_role>`.
        const apikey = request.headers.get("apikey") ?? "";
        const auth = request.headers.get("authorization") ?? "";
        const expected = [
          process.env.SUPABASE_PUBLISHABLE_KEY,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
        ].filter(Boolean) as string[];
        const ok = expected.some((k) => apikey === k || auth === `Bearer ${k}`);
        if (!ok) return new Response("Unauthorized", { status: 401 });

        let payload: z.infer<typeof schema>;
        try {
          payload = schema.parse(await request.json());
        } catch {
          return new Response("Bad request", { status: 400 });
        }

        const { data: reg } = await supabaseAdmin
          .from("registrations")
          .select("id, email, nome_completo, protocolo")
          .eq("id", payload.registration_id)
          .maybeSingle();
        if (!reg) return new Response("Not found", { status: 404 });

        await sendInscricaoEmail({
          registrationId: reg.id,
          template: "status_change",
          to: reg.email,
          vars: {
            nome: reg.nome_completo,
            protocolo: reg.protocolo ?? reg.id,
            statusLabel: STATUS_LABELS[payload.new_status] ?? payload.new_status,
            message: payload.status_message ?? "",
          },
        });

        return Response.json({ ok: true });
      },
    },
  },
});
