import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { buildComprovantePdf } from "./comprovante/pdf-builder";
import { sendInscricaoEmail } from "./emails.functions";

const idSchema = z.object({ id: z.string().uuid() });

/**
 * Generates the comprovante PDF for a finalized registration, stores it in
 * the proposta-anexos bucket, records hash/path on the registration, and
 * triggers the submission confirmation email.
 *
 * Safe to call multiple times — overwrites the existing comprovante.
 */
export const gerarComprovante = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => idSchema.parse(input))
  .handler(async ({ data }) => {
    const ip = (() => {
      try {
        return getRequestIP({ xForwardedFor: true }) ?? null;
      } catch {
        return null;
      }
    })();
    const ua = (() => {
      try {
        return getRequestHeader("user-agent") ?? null;
      } catch {
        return null;
      }
    })();

    const { data: reg, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !reg) return { ok: false as const, error: "Inscrição não encontrada." };

    // Assign protocolo if absent
    let protocolo = reg.protocolo as string | null;
    if (!protocolo) {
      const { data: p } = await supabaseAdmin.rpc("next_protocolo");
      protocolo = (p as string) ?? null;
    }

    // Fetch team members + attachments if present
    const [{ data: membros }, { data: arquivos }] = await Promise.all([
      supabaseAdmin.from("registration_team_members").select("*").eq("registration_id", data.id),
      supabaseAdmin.from("registration_proposta_arquivos").select("*").eq("registration_id", data.id).order("created_at"),
    ]);

    const pdfBytes = await buildComprovantePdf({
      registration: { ...reg, protocolo },
      membros: membros ?? [],
      arquivos: arquivos ?? [],
      assinaturaInfo: {
        ip,
        userAgent: ua,
        timestamp: new Date().toISOString(),
      },
    });

    // SHA-256
    const pdfBuf = Buffer.from(pdfBytes);
    const hashBuf = await crypto.subtle.digest("SHA-256", new Uint8Array(pdfBuf));
    const hashHex = Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const path = `${data.id}/comprovante.pdf`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("proposta-anexos")
      .upload(path, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (upErr) {
      console.error("comprovante upload error", upErr);
      return { ok: false as const, error: "Falha ao salvar comprovante." };
    }

    const nowIso = new Date().toISOString();
    await supabaseAdmin
      .from("registrations")
      .update({
        protocolo,
        comprovante_path: path,
        comprovante_hash: hashHex,
        comprovante_generated_at: nowIso,
        assinatura_ip: ip,
        assinatura_ua: ua,
        assinatura_at: nowIso,
      })
      .eq("id", data.id);

    // Send confirmation email (graceful — never throws)
    await sendInscricaoEmail({
      registrationId: data.id,
      template: "submission",
      to: reg.email,
      vars: {
        nome: reg.nome_completo,
        protocolo: protocolo ?? "—",
        titulo: reg.titulo_proposta ?? "(sem título)",
      },
    });

    return { ok: true as const, protocolo, hash: hashHex };
  });

const downloadSchema = z.object({ id: z.string().uuid(), email: z.string().email() });
export const baixarComprovante = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => downloadSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: reg } = await supabaseAdmin
      .from("registrations")
      .select("id, email, comprovante_path")
      .eq("id", data.id)
      .maybeSingle();
    if (!reg || reg.email.toLowerCase() !== data.email.toLowerCase()) {
      return { ok: false as const, error: "Inscrição não encontrada ou email não confere." };
    }
    if (!reg.comprovante_path) {
      return { ok: false as const, error: "Comprovante ainda não foi gerado." };
    }
    const { data: signed, error } = await supabaseAdmin.storage
      .from("proposta-anexos")
      .createSignedUrl(reg.comprovante_path, 60 * 60);
    if (error || !signed) return { ok: false as const, error: "Falha ao gerar link." };
    return { ok: true as const, url: signed.signedUrl };
  });
