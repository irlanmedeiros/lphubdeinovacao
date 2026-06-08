/**
 * Centralized email sender. Uses the Lovable connector gateway for Resend
 * when RESEND_API_KEY and LOVABLE_API_KEY are present. Otherwise the email
 * is recorded in email_log with status='skipped_no_provider' so admins know
 * to connect the Resend connector.
 *
 * Templates are simple inline HTML — no React Email runtime dependency.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const FROM = "INOVATEC-JP <onboarding@resend.dev>";
const STATUS_URL = "https://lphubdeinovacao.lovable.app/status";

type Template = "submission" | "status_change" | "broadcast" | "lembrete";

interface SendArgs {
  registrationId: string | null;
  template: Template;
  to: string;
  vars: Record<string, string>;
  attachComprovante?: { path: string; filename?: string } | null;
  subjectOverride?: string;
  htmlOverride?: string;
}

function renderTemplate(template: Template, vars: Record<string, string>): { subject: string; html: string } {
  const base = (body: string, cta?: { label: string; url: string }) => `
<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;background:#f6f7fb;margin:0;padding:24px;color:#1a1f36">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <div style="background:#0b2240;padding:20px 24px;color:#fff">
      <div style="font-weight:800;letter-spacing:1px">INOVATEC-JP</div>
      <div style="font-size:12px;opacity:.75">Hub de Inovação · Edital Inova Soluções Públicas</div>
    </div>
    <div style="padding:24px;line-height:1.55;font-size:14px">${body}
      ${cta ? `<p style="margin-top:24px"><a href="${cta.url}" style="display:inline-block;background:#1976d2;color:#fff;padding:10px 20px;border-radius:999px;text-decoration:none;font-weight:600;font-size:13px">${cta.label}</a></p>` : ""}
      <p style="margin-top:24px;color:#6b7280;font-size:12px">Este é um email automático. Para dúvidas, responda esta mensagem.</p>
    </div>
  </div>
</body></html>`;

  switch (template) {
    case "submission":
      return {
        subject: `Inscrição confirmada — Protocolo ${vars.protocolo}`,
        html: base(
          `<h2 style="margin:0 0 16px;color:#0b2240">Olá, ${vars.nome}!</h2>
           <p>Recebemos sua proposta <strong>${vars.titulo}</strong> para o Edital INOVATEC-JP.</p>
           <p>Seu protocolo de submissão é:</p>
           <p style="font-size:22px;font-weight:800;color:#0b2240;background:#f0f4fa;padding:14px;border-radius:8px;text-align:center;letter-spacing:1px">${vars.protocolo}</p>
           <p>Anexamos o <strong>comprovante completo em PDF</strong> com todas as informações enviadas e o hash de integridade. Guarde-o para consulta.</p>
           <p>Você pode acompanhar o andamento informando seu protocolo e e-mail na página de consulta:</p>`,
          { label: "Consultar status", url: STATUS_URL }
        ),
      };
    case "status_change":
      return {
        subject: `Atualização da sua inscrição — ${vars.statusLabel}`,
        html: base(
          `<h2 style="margin:0 0 16px;color:#0b2240">Olá, ${vars.nome}!</h2>
           <p>Houve uma atualização na sua inscrição <strong>${vars.protocolo}</strong>:</p>
           <p style="font-size:16px;font-weight:700;color:#0b2240;background:#f0f4fa;padding:12px;border-radius:8px">${vars.statusLabel}</p>
           ${vars.message ? `<p><strong>Mensagem da equipe:</strong></p><blockquote style="margin:8px 0;padding:12px;background:#f8f9fb;border-left:3px solid #1976d2;color:#374151;white-space:pre-wrap">${vars.message}</blockquote>` : ""}`,
          { label: "Ver detalhes", url: STATUS_URL }
        ),
      };
    case "broadcast":
      return {
        subject: vars.subject || "Aviso do edital INOVATEC-JP",
        html: base(
          `<h2 style="margin:0 0 16px;color:#0b2240">${vars.subject || "Aviso do edital"}</h2>
           <div style="white-space:pre-wrap">${vars.body || ""}</div>`,
          { label: "Acessar portal", url: "https://lphubdeinovacao.lovable.app" }
        ),
      };
    case "lembrete":
      return {
        subject: `Lembrete: ${vars.titulo} em ${vars.diasRestantes} dia(s)`,
        html: base(
          `<h2 style="margin:0 0 16px;color:#0b2240">Lembrete do edital</h2>
           <p>O evento <strong>${vars.titulo}</strong> ocorre em <strong>${vars.data}</strong> — em ${vars.diasRestantes} dia(s).</p>
           ${vars.descricao ? `<p>${vars.descricao}</p>` : ""}`,
          { label: "Consultar status", url: STATUS_URL }
        ),
      };
  }
}

export async function sendInscricaoEmail(args: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const rendered = args.htmlOverride
    ? { subject: args.subjectOverride ?? "Aviso INOVATEC-JP", html: args.htmlOverride }
    : renderTemplate(args.template, args.vars);

  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  // Optional attachment (base64)
  let attachments: { filename: string; content: string }[] | undefined;
  if (args.attachComprovante?.path) {
    try {
      const { data: blob } = await supabaseAdmin.storage
        .from("proposta-anexos")
        .download(args.attachComprovante.path);
      if (blob) {
        const buf = Buffer.from(await blob.arrayBuffer());
        attachments = [
          {
            filename: args.attachComprovante.filename ?? "comprovante.pdf",
            content: buf.toString("base64"),
          },
        ];
      }
    } catch (e) {
      console.error("attach comprovante error", e);
    }
  }

  if (!lovableKey || !resendKey) {
    await supabaseAdmin.from("email_log").insert({
      registration_id: args.registrationId,
      template: args.template,
      destinatario: args.to,
      assunto: rendered.subject,
      status: "skipped_no_provider",
      error: "Resend connector not configured (RESEND_API_KEY missing)",
    });
    return { ok: false, error: "Provedor de email não configurado." };
  }

  try {
    const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: FROM,
        to: [args.to],
        subject: rendered.subject,
        html: rendered.html,
        attachments,
      }),
    });
    const ok = res.ok;
    const body = await res.text();
    await supabaseAdmin.from("email_log").insert({
      registration_id: args.registrationId,
      template: args.template,
      destinatario: args.to,
      assunto: rendered.subject,
      status: ok ? "sent" : "error",
      error: ok ? null : `HTTP ${res.status}: ${body.slice(0, 500)}`,
    });
    return ok ? { ok: true } : { ok: false, error: `HTTP ${res.status}` };
  } catch (e) {
    const err = e instanceof Error ? e.message : "unknown";
    await supabaseAdmin.from("email_log").insert({
      registration_id: args.registrationId,
      template: args.template,
      destinatario: args.to,
      assunto: rendered.subject,
      status: "error",
      error: err,
    });
    return { ok: false, error: err };
  }
}

// === Admin broadcast ===
const broadcastSchema = z.object({
  subject: z.string().trim().min(3).max(200),
  body: z.string().trim().min(10).max(20000),
  onlyComplete: z.boolean().default(true),
});

export const broadcastEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => broadcastSchema.parse(input))
  .handler(async ({ context, data }) => {
    const { data: isAdmin } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!isAdmin) return { ok: false as const, error: "Acesso negado." };

    let q = supabaseAdmin.from("registrations").select("id, email, nome_completo, cadastro_completo");
    if (data.onlyComplete) q = q.eq("cadastro_completo", true);
    const { data: rows } = await q;
    if (!rows?.length) return { ok: false as const, error: "Nenhum destinatário." };

    let sent = 0, errors = 0;
    for (const r of rows) {
      const res = await sendInscricaoEmail({
        registrationId: r.id,
        template: "broadcast",
        to: r.email,
        vars: { subject: data.subject, body: data.body, nome: r.nome_completo },
      });
      if (res.ok) sent++; else errors++;
    }
    return { ok: true as const, sent, errors, total: rows.length };
  });
