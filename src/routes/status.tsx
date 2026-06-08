import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { consultarStatus } from "@/lib/status.functions";
import { baixarComprovante } from "@/lib/comprovante.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RainbowStripe } from "@/components/landing/RainbowStripe";
import hubLogo from "@/assets/hub-logo.svg";
import { Search, Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Consultar status — Hub de Inovação INOVATEC-JP" },
      { name: "description", content: "Consulte a situação da sua inscrição no Edital Inova Soluções Públicas informando seu protocolo e e-mail." },
    ],
  }),
  component: StatusPage,
});

type ConsultaResult = Awaited<ReturnType<ReturnType<typeof useServerFn<typeof consultarStatus>>>>;

function StatusPage() {
  const consultar = useServerFn(consultarStatus);
  const baixar = useServerFn(baixarComprovante);
  const [ident, setIdent] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [result, setResult] = useState<ConsultaResult | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await consultar({ data: { identificador: ident, email } });
      setResult(res);
      if (!res.ok) toast.error(res.error);
    } catch {
      toast.error("Falha ao consultar.");
    } finally {
      setLoading(false);
    }
  };

  const onDownload = async () => {
    if (!result?.ok) return;
    setDownloading(true);
    try {
      const res = await baixar({ data: { id: result.registration.id, email } });
      if (res.ok) window.open(res.url, "_blank");
      else toast.error(res.error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <RainbowStripe className="h-1.5" />
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <a href="/"><img src={hubLogo} alt="Hub de Inovação INOVATEC-JP" className="h-12 w-auto" /></a>
          <a href="/" className="text-xs font-semibold text-[var(--brand-blue)] hover:underline">
            ← Voltar à página inicial
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-blue)]">Consulta</span>
          <h1 className="mt-2 text-4xl font-extrabold text-[var(--navy)] md:text-5xl">Consultar status</h1>
          <p className="mt-3 max-w-xl text-slate-600">
            Informe o <strong>protocolo</strong> recebido por e-mail (ou o ID da inscrição) e o <strong>e-mail do responsável</strong> usado no cadastro.
          </p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-600">Protocolo ou ID</label>
              <Input
                value={ident}
                onChange={(e) => setIdent(e.target.value)}
                placeholder="INOVA-2026-000123"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-600">E-mail do responsável</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="responsavel@exemplo.com"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Não recebeu o protocolo? Verifique sua caixa de spam.</p>
            <Button type="submit" disabled={loading} className="bg-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Consultar
            </Button>
          </div>
        </form>

        {result?.ok === false && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {result.error}
          </div>
        )}

        {result?.ok && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-bold text-[var(--navy)]">
                  {result.registration.nome}
                </h2>
                <div className="mt-1 text-xs text-slate-500">
                  {result.registration.protocolo && (
                    <>Protocolo <span className="font-mono font-semibold text-[var(--navy)]">{result.registration.protocolo}</span> · </>
                  )}
                  {result.registration.localizacao}
                </div>
                {result.registration.titulo && (
                  <div className="mt-3 text-sm text-slate-700">
                    <span className="font-semibold">{result.registration.titulo}</span>
                    {result.registration.eixo && <> · <span className="text-slate-500">{result.registration.eixo}</span></>}
                  </div>
                )}
              </div>
              <StatusBadge tone={result.registration.statusTone} label={result.registration.statusLabel} />
            </div>

            {result.registration.statusMessage && (
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <div className="text-xs font-semibold uppercase text-slate-500">Mensagem da equipe</div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{result.registration.statusMessage}</p>
              </div>
            )}

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Info label="Submetido em" value={new Date(result.registration.submetido_em).toLocaleString("pt-BR")} />
              <Info label="Atualização" value={new Date(result.registration.atualizado_em).toLocaleString("pt-BR")} />
              <Info label="Cadastro" value={result.registration.cadastro_completo ? "Completo" : "Pendente"} />
              {result.registration.cnpj && <Info label="CNPJ" value={result.registration.cnpj} />}
            </div>

            {result.arquivos.length > 0 && (
              <div className="border-t border-slate-100 p-6">
                <div className="text-xs font-semibold uppercase text-slate-500">Anexos enviados</div>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {result.arquivos.map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{a.filename}</span>
                      <span className="text-xs text-slate-400">· {Math.round(Number(a.size_bytes) / 1024)} KB</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.registration.comprovante_disponivel && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
                <div className="text-sm text-slate-600">Comprovante de submissão em PDF disponível.</div>
                <Button onClick={onDownload} disabled={downloading} variant="outline">
                  {downloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                  Baixar PDF
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm text-slate-800">{value}</div>
    </div>
  );
}

const TONE: Record<string, string> = {
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  yellow: "bg-amber-100 text-amber-700 border-amber-200",
  red: "bg-rose-100 text-rose-700 border-rose-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

function StatusBadge({ tone, label }: { tone: string; label: string }) {
  return (
    <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${TONE[tone] ?? TONE.slate}`}>
      • {label}
    </span>
  );
}
