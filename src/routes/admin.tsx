import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { listRegistrations, updateRegistration, checkAdmin } from "@/lib/registrations.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { STATUS_LABELS, STATUS_OPTIONS, EIXOS } from "@/lib/constants";
import { toast } from "sonner";
import { LogOut, Download } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Hub de Inovação" }] }),
  component: AdminPage,
});

type Reg = {
  id: string; created_at: string; updated_at: string;
  nome_completo: string; cpf: string | null; email: string; whatsapp: string;
  tipo_inscricao: "individual" | "equipe" | "empresa";
  eixo_tematico: string | null; estagio_ideia: string | null;
  status: string; notas_admin: string | null;
  cadastro_completo: boolean;
};

function AdminPage() {
  const navigate = useNavigate();
  const checkAdminFn = useServerFn(checkAdmin);
  const listFn = useServerFn(listRegistrations);
  const updateFn = useServerFn(updateRegistration);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!alive) return;
      if (!data.user) { navigate({ to: "/admin/login" }); return; }
      try {
        const res = await checkAdminFn();
        if (!res.isAdmin) {
          toast.error("Sua conta não tem permissão de administrador.");
          await supabase.auth.signOut();
          navigate({ to: "/admin/login" });
          return;
        }
        setReady(true);
      } catch {
        navigate({ to: "/admin/login" });
      }
    })();
    return () => { alive = false; };
  }, []);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["registrations"],
    queryFn: () => listFn(),
    enabled: ready,
  });

  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fEixo, setFEixo] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");
  const [detail, setDetail] = useState<Reg | null>(null);

  const regs = (data?.registrations ?? []) as Reg[];

  const filtered = useMemo(() => regs.filter((r) => {
    if (search) {
      const s = search.toLowerCase();
      if (!r.nome_completo.toLowerCase().includes(s) && !r.email.toLowerCase().includes(s)) return false;
    }
    if (fStatus && r.status !== fStatus) return false;
    if (fEixo && r.eixo_tematico !== fEixo) return false;
    if (fTipo && r.tipo_inscricao !== fTipo) return false;
    if (fFrom && new Date(r.created_at) < new Date(fFrom)) return false;
    if (fTo && new Date(r.created_at) > new Date(fTo + "T23:59:59")) return false;
    return true;
  }), [regs, search, fStatus, fEixo, fTipo, fFrom, fTo]);

  const counts = useMemo(() => ({
    total: regs.length,
    novo: regs.filter((r) => r.status === "novo").length,
    em_analise: regs.filter((r) => r.status === "em_analise").length,
    contatado: regs.filter((r) => r.status === "contatado").length,
    aprovado: regs.filter((r) => r.status === "aprovado").length,
  }), [regs]);

  const handleStatusChange = async (id: string, status: string) => {
    await updateFn({ data: { id, status: status as any } });
    toast.success("Status atualizado");
    refetch();
    if (detail?.id === id) setDetail({ ...detail, status });
  };

  const handleNotesSave = async (id: string, notes: string) => {
    await updateFn({ data: { id, notas_admin: notes } });
    toast.success("Notas salvas");
    refetch();
  };

  const exportCSV = () => {
    const headers = ["Nome", "CPF", "Email", "WhatsApp", "Tipo", "Eixo", "Estágio", "Status", "Cadastro"];
    const rows = filtered.map((r) => [
      r.nome_completo, r.cpf, r.email, r.whatsapp, r.tipo_inscricao,
      r.eixo_tematico, r.estagio_ideia, r.status, new Date(r.created_at).toLocaleString("pt-BR"),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `cadastros-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Verificando acesso…</div>;
  }

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <aside className="hidden w-60 flex-col bg-[var(--navy)] p-6 text-white md:flex">
        <div className="font-extrabold tracking-wider">INOVATEC-JP</div>
        <div className="mt-1 text-xs text-white/60">Hub de Inovação</div>
        <nav className="mt-8 flex-1 text-sm">
          <div className="rounded-md bg-white/10 px-3 py-2 font-medium">Dashboard</div>
        </nav>
        <Button onClick={logout} variant="ghost" className="justify-start text-white hover:bg-white/10">
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </aside>

      <main className="flex-1 overflow-x-hidden p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--navy)]">Pré-cadastros</h1>
            <p className="text-sm text-slate-600">Gerencie as inscrições recebidas</p>
          </div>
          <Button onClick={exportCSV} variant="outline"><Download className="mr-2 h-4 w-4" /> Exportar CSV</Button>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {[
            { l: "Total", v: counts.total, c: "bg-[var(--navy)]" },
            { l: "Novos", v: counts.novo, c: "bg-[var(--brand-blue)]" },
            { l: "Em análise", v: counts.em_analise, c: "bg-[var(--brand-yellow)] text-black" },
            { l: "Contatados", v: counts.contatado, c: "bg-slate-500" },
            { l: "Aprovados", v: counts.aprovado, c: "bg-[var(--brand-green)]" },
          ].map((s) => (
            <div key={s.l} className={`${s.c} rounded-xl p-4 text-white`}>
              <div className="text-xs uppercase tracking-wider opacity-80">{s.l}</div>
              <div className="mt-1 text-3xl font-bold">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-6">
          <Input placeholder="Buscar nome ou e-mail…" value={search} onChange={(e) => setSearch(e.target.value)} className="md:col-span-2" />
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
            <option value="">Status: todos</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
          </select>
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={fEixo} onChange={(e) => setFEixo(e.target.value)}>
            <option value="">Eixo: todos</option>
            {EIXOS.map((e) => <option key={e.id} value={e.label}>{e.short}</option>)}
          </select>
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={fTipo} onChange={(e) => setFTipo(e.target.value)}>
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={fTipo} onChange={(e) => setFTipo(e.target.value)}>
            <option value="">Tipo: todos</option>
            <option value="individual">Individual</option>
            <option value="equipe">Equipe</option>
            <option value="empresa">Empresa</option>
          </select>
          <div className="flex gap-2">
            <Input type="date" value={fFrom} onChange={(e) => setFFrom(e.target.value)} />
            <Input type="date" value={fTo} onChange={(e) => setFTo(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-3">Nome</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Eixo</th>
                  <th className="p-3">Estágio</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <tr><td colSpan={8} className="p-6 text-center text-slate-500">Carregando…</td></tr>}
                {!isLoading && filtered.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-slate-500">Nenhum cadastro encontrado.</td></tr>}
                {filtered.map((r) => {
                  const eixo = EIXOS.find((e) => e.label === r.eixo_tematico);
                  return (
                    <tr key={r.id} className="border-t hover:bg-slate-50">
                      <td className="cursor-pointer p-3 font-medium" onClick={() => setDetail(r)}>{r.nome_completo}</td>
                      <td className="p-3">{r.email}</td>
                      <td className="p-3"><a className="text-[var(--brand-green)] hover:underline" target="_blank" rel="noreferrer" href={`https://wa.me/55${r.whatsapp.replace(/\D/g, "")}`}>{r.whatsapp}</a></td>
                      <td className="p-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{r.tipo_inscricao === "individual" ? "Individual" : "Equipe"}</span></td>
                      <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs text-white ${eixo?.bg ?? "bg-slate-400"}`}>{eixo?.short ?? r.eixo_tematico}</span></td>
                      <td className="p-3 max-w-[200px] truncate text-xs text-slate-600">{r.estagio_ideia}</td>
                      <td className="p-3">
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_LABELS[r.status]?.className ?? ""}`}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-white text-black">{STATUS_LABELS[s].label}</option>)}
                        </select>
                      </td>
                      <td className="p-3 text-xs text-slate-500">{new Date(r.created_at).toLocaleDateString("pt-BR")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>{detail.nome_completo}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <Field label="E-mail" value={detail.email} />
                <Field label="CPF" value={detail.cpf} />
                <Field label="WhatsApp" value={detail.whatsapp} />
                <Field label="Tipo de inscrição" value={detail.tipo_inscricao === "individual" ? "Pessoa individual" : "Equipe"} />
                <Field label="Eixo temático" value={detail.eixo_tematico} />
                <Field label="Estágio da ideia" value={detail.estagio_ideia} />
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">Status</div>
                  <select
                    value={detail.status}
                    onChange={(e) => handleStatusChange(detail.id, e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
                  </select>
                </div>
                <NotesEditor key={detail.id} initial={detail.notas_admin ?? ""} onSave={(n) => handleNotesSave(detail.id, n)} />
                <div className="text-xs text-slate-500">
                  Criado em {new Date(detail.created_at).toLocaleString("pt-BR")} ·
                  Atualizado em {new Date(detail.updated_at).toLocaleString("pt-BR")}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}

function NotesEditor({ initial, onSave }: { initial: string; onSave: (n: string) => void }) {
  const [v, setV] = useState(initial);
  return (
    <div>
      <div className="text-xs font-semibold uppercase text-slate-500">Notas internas</div>
      <Textarea value={v} onChange={(e) => setV(e.target.value)} rows={4} className="mt-1" />
      <Button onClick={() => onSave(v)} size="sm" className="mt-2 bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue)]/90">Salvar notas</Button>
    </div>
  );
}
