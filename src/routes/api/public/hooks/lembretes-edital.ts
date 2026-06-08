import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendInscricaoEmail } from "@/lib/emails.functions";

// Daily cron endpoint. Set up with pg_cron:
//   select cron.schedule('lembretes-edital', '0 9 * * *',
//     $$ select net.http_post(
//          url := 'https://lphubdeinovacao.lovable.app/api/public/hooks/lembretes-edital',
//          headers := jsonb_build_object('apikey', '<anon>')) $$);

export const Route = createFileRoute("/api/public/hooks/lembretes-edital")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey") ?? "";
        const expected = [
          process.env.SUPABASE_PUBLISHABLE_KEY,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
        ].filter(Boolean) as string[];
        if (!expected.some((k) => apikey === k)) return new Response("Unauthorized", { status: 401 });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: eventos } = await supabaseAdmin
          .from("edital_eventos")
          .select("*")
          .eq("ativo", true);
        if (!eventos?.length) return Response.json({ ok: true, sent: 0 });

        const matches = eventos.filter((e) => {
          const target = new Date(e.data_evento);
          target.setHours(0, 0, 0, 0);
          const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return diffDays === e.dias_antes_avisar;
        });
        if (!matches.length) return Response.json({ ok: true, sent: 0 });

        const { data: regs } = await supabaseAdmin
          .from("registrations")
          .select("id, email, nome_completo, protocolo")
          .eq("cadastro_completo", true);

        let sent = 0;
        for (const ev of matches) {
          for (const r of regs ?? []) {
            const res = await sendInscricaoEmail({
              registrationId: r.id,
              template: "lembrete",
              to: r.email,
              vars: {
                titulo: ev.titulo,
                descricao: ev.descricao ?? "",
                data: new Date(ev.data_evento).toLocaleDateString("pt-BR"),
                diasRestantes: String(ev.dias_antes_avisar),
              },
            });
            if (res.ok) sent++;
          }
        }
        return Response.json({ ok: true, sent });
      },
    },
  },
});
