import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitFullRegistration, uploadComprovacao } from "@/lib/registrations.functions";
import { EIXOS, ESTAGIOS, ESTADOS_BR, TIPOS_INSCRICAO } from "@/lib/constants";
import { maskCPF, maskPhone, digitsOnly } from "@/lib/masks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import hubLogo from "@/assets/hub-logo.svg";
import { RainbowStripe } from "@/components/landing/RainbowStripe";
import { Plus, Trash2, Upload, CheckCircle2 } from "lucide-react";
import PrivacyDialog from "@/components/landing/PrivacyDialog";

type SearchParams = { id?: string; tipo?: "individual" | "equipe" | "empresa" };

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro Completo — Hub de Inovação INOVATEC-JP" },
      { name: "description", content: "Finalize sua inscrição no edital do Hub de Inovação preenchendo todos os dados da proposta." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    id: typeof s.id === "string" ? s.id : undefined,
    tipo:
      s.tipo === "individual" || s.tipo === "equipe" || s.tipo === "empresa"
        ? s.tipo
        : undefined,
  }),
  component: CadastroPage,
});

const memberSchema = z.object({
  nome: z.string().min(2, "Obrigatório").max(150),
  cpf: z.string().refine((v) => digitsOnly(v).length === 11, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().refine((v) => digitsOnly(v).length >= 10, "Telefone inválido"),
  funcao: z.string().min(1, "Obrigatório").max(150),
  area_atuacao: z.string().min(1, "Obrigatório").max(150),
  formacao: z.string().min(1, "Obrigatório").max(150),
});

const baseSchema = z.object({
  // proposta
  titulo_proposta: z.string().min(2, "Obrigatório").max(255),
  eixo_tematico: z.string().min(1, "Selecione um eixo"),
  estagio_ideia: z.string().min(1, "Selecione um estágio"),
  // proponente
  nome_completo: z.string().min(2, "Obrigatório").max(150),
  cpf: z.string().refine((v) => digitsOnly(v).length === 11, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().refine((v) => digitsOnly(v).length >= 10, "WhatsApp inválido"),
  telefone: z.string().optional().or(z.literal("")),
  endereco: z.string().min(2, "Obrigatório").max(300),
  municipio: z.string().min(2, "Obrigatório").max(150),
  estado: z.string().length(2, "UF"),
  cep: z.string().min(8, "CEP inválido").max(10),
  nome_social: z.string().max(150).optional().or(z.literal("")),
  // PJ
  razao_social: z.string().max(255).optional().or(z.literal("")),
  cnpj: z.string().max(20).optional().or(z.literal("")),
  nome_fantasia: z.string().max(255).optional().or(z.literal("")),
  representante_nome: z.string().max(150).optional().or(z.literal("")),
  representante_cpf: z.string().max(20).optional().or(z.literal("")),
  membros: z.array(memberSchema).optional(),
  aceite: z.literal(true, { errorMap: () => ({ message: "Você precisa aceitar o edital e a Política de Privacidade" }) }),
});

type FormValues = z.infer<typeof baseSchema>;

function CadastroPage() {
  const search = useSearch({ from: "/cadastro" });
  const initialTipo = search.tipo ?? "individual";
  const id = search.id;

  const [tipo, setTipo] = useState<"individual" | "equipe" | "empresa">(initialTipo);
  const [uploading, setUploading] = useState(false);
  const [comprovacao, setComprovacao] = useState<{ path: string; name: string } | null>(null);
  const [done, setDone] = useState(false);

  const submitFn = useServerFn(submitFullRegistration);
  const uploadFn = useServerFn(uploadComprovacao);

  const form = useForm<FormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      titulo_proposta: "",
      eixo_tematico: "",
      estagio_ideia: "",
      nome_completo: "",
      cpf: "",
      email: "",
      whatsapp: "",
      telefone: "",
      endereco: "",
      municipio: "",
      estado: "PB",
      cep: "",
      membros: [],
    },
  });

  const { register, handleSubmit, setValue, watch, control, formState: { errors, isSubmitting } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "membros" });

  const cpf = watch("cpf") ?? "";
  const whatsapp = watch("whatsapp") ?? "";
  const telefone = watch("telefone") ?? "";
  const cnpj = watch("cnpj") ?? "";
  const repCpf = watch("representante_cpf") ?? "";

  const handleFile = async (file: File) => {
    if (!id) {
      toast.error("ID do pré-cadastro ausente. Volte à página inicial e refaça o pré-cadastro.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo deve ter no máximo 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((acc, b) => acc + String.fromCharCode(b), "")
      );
      const res = await uploadFn({
        data: { id, filename: file.name, contentType: file.type, base64 },
      });
      if (res.ok) {
        setComprovacao({ path: res.path, name: file.name });
        toast.success("Arquivo enviado");
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      console.error(e);
      toast.error("Falha no upload");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!id) {
      toast.error("Pré-cadastro não encontrado. Volte à página inicial.");
      return;
    }
    if (tipo === "empresa" && !comprovacao) {
      toast.error("Envie o documento de comprovação de poderes de representação.");
      return;
    }
    if (tipo === "equipe" && (!values.membros || values.membros.length < 1)) {
      toast.error("Adicione ao menos um membro da equipe.");
      return;
    }

    const payload = {
      id,
      titulo_proposta: values.titulo_proposta,
      eixo_tematico: values.eixo_tematico,
      estagio_ideia: values.estagio_ideia,
      nome_completo: values.nome_completo,
      cpf: digitsOnly(values.cpf),
      email: values.email,
      whatsapp: digitsOnly(values.whatsapp),
      telefone: values.telefone ? digitsOnly(values.telefone) : null,
      endereco: values.endereco,
      municipio: values.municipio,
      estado: values.estado,
      cep: digitsOnly(values.cep),
      nome_social: values.nome_social || null,
      razao_social: values.razao_social || null,
      cnpj: values.cnpj ? digitsOnly(values.cnpj) : null,
      nome_fantasia: values.nome_fantasia || null,
      representante_nome: values.representante_nome || null,
      representante_cpf: values.representante_cpf ? digitsOnly(values.representante_cpf) : null,
      comprovacao_path: comprovacao?.path ?? null,
      tipo_inscricao: tipo,
      membros: (values.membros ?? []).map((m) => ({
        ...m,
        cpf: digitsOnly(m.cpf),
        telefone: digitsOnly(m.telefone),
      })),
    };

    const res = await submitFn({ data: payload });
    if (res.ok) {
      toast.success("Inscrição enviada com sucesso!");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error(res.error);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[var(--surface)]">
        <RainbowStripe className="h-1.5" />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-20 w-20 text-[var(--brand-green)]" />
          <h1 className="mt-6 text-3xl font-extrabold text-[var(--navy)]">Inscrição enviada!</h1>
          <p className="mt-3 text-slate-600">
            Recebemos sua proposta. A INOVATEC-JP analisará a habilitação e entrará em contato
            por e-mail com as próximas etapas do edital.
          </p>
          <a href="/" className="mt-8 inline-flex rounded-full bg-[var(--brand-blue)] px-6 py-3 text-sm font-semibold text-white shadow-md">
            Voltar à página inicial
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <RainbowStripe className="h-1.5" />
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <img src={hubLogo} alt="Hub de Inovação INOVATEC-JP" className="h-12 w-auto" />
          <a href="/edital-2026.pdf" download className="text-xs font-semibold text-[var(--brand-blue)] hover:underline">
            Baixar Edital (PDF)
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">Formulário de Inscrição</span>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--navy)] md:text-4xl">Cadastro Completo</h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-[var(--brand-red)]" />
          <p className="mt-4 max-w-2xl text-sm text-slate-600">
            <strong>Observação:</strong> a marcação incorreta do tipo de inscrição poderá ensejar
            solicitação de ajuste, esclarecimento ou complementação documental pela INOVATEC-JP.
            Caso a inconsistência comprometa a análise de habilitação, poderá acarretar a não
            habilitação ou desclassificação da inscrição.
          </p>
        </div>

        {!id && (
          <div className="mb-6 rounded-xl border border-[var(--brand-yellow)] bg-[var(--brand-yellow)]/10 p-4 text-sm text-slate-700">
            Você acessou esta página diretamente. Para vincular ao seu pré-cadastro, preencha-o
            primeiro em <a href="/" className="font-semibold underline">/</a>.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tipo de inscrição */}
          <Card title="Tipo de inscrição">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {TIPOS_INSCRICAO.map((o) => (
                <button
                  type="button"
                  key={o.value}
                  onClick={() => setTipo(o.value)}
                  className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                    tipo === o.value
                      ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Proposta */}
          <Card title="Sobre a proposta">
            <Field label="Título da proposta *" error={errors.titulo_proposta?.message}>
              <input className={input} {...register("titulo_proposta")} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Eixo temático *" error={errors.eixo_tematico?.message}>
                <select className={input} {...register("eixo_tematico")}>
                  <option value="">Selecione…</option>
                  {EIXOS.map((e) => <option key={e.id} value={e.label}>{e.short}</option>)}
                </select>
              </Field>
              <Field label="Estágio da ideia *" error={errors.estagio_ideia?.message}>
                <select className={input} {...register("estagio_ideia")}>
                  <option value="">Selecione…</option>
                  {ESTAGIOS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </Field>
            </div>
          </Card>

          {/* Dados do proponente */}
          <Card title={tipo === "empresa" ? "Dados da empresa proponente" : "Dados do proponente responsável"}>
            {tipo === "empresa" ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Razão social *" error={errors.razao_social?.message}>
                    <input className={input} {...register("razao_social")} />
                  </Field>
                  <Field label="CNPJ *" error={errors.cnpj?.message}>
                    <input
                      className={input}
                      value={cnpj}
                      onChange={(e) => setValue("cnpj", maskCNPJ(e.target.value), { shouldValidate: true })}
                      placeholder="00.000.000/0000-00"
                    />
                  </Field>
                </div>
                <Field label="Nome fantasia (se houver)">
                  <input className={input} {...register("nome_fantasia")} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Nome do representante legal *" error={errors.representante_nome?.message}>
                    <input className={input} {...register("representante_nome")} />
                  </Field>
                  <Field label="CPF do representante legal *" error={errors.representante_cpf?.message}>
                    <input
                      className={input}
                      value={repCpf}
                      onChange={(e) => setValue("representante_cpf", maskCPF(e.target.value), { shouldValidate: true })}
                      placeholder="000.000.000-00"
                    />
                  </Field>
                </div>
                <Field label="Comprovação de poderes de representação *" hint="PDF, JPG ou PNG · máx. 5 MB">
                  <FileInput onFile={handleFile} loading={uploading} done={!!comprovacao} fileName={comprovacao?.name} />
                </Field>
              </>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Nome completo *" error={errors.nome_completo?.message}>
                    <input className={input} {...register("nome_completo")} />
                  </Field>
                  <Field label="CPF *" error={errors.cpf?.message}>
                    <input
                      className={input}
                      value={cpf}
                      onChange={(e) => setValue("cpf", maskCPF(e.target.value), { shouldValidate: true })}
                      placeholder="000.000.000-00"
                    />
                  </Field>
                </div>
                <Field label="Nome social (se houver)">
                  <input className={input} {...register("nome_social")} />
                </Field>
              </>
            )}

            {/* Endereço comum */}
            {tipo === "empresa" && (
              <Field label="Nome completo do responsável pelo contato *" error={errors.nome_completo?.message}>
                <input className={input} {...register("nome_completo")} />
              </Field>
            )}
            <Field label="Endereço completo *" error={errors.endereco?.message}>
              <input className={input} {...register("endereco")} placeholder="Rua, número, bairro, complemento" />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Município *" error={errors.municipio?.message}>
                <input className={input} {...register("municipio")} />
              </Field>
              <Field label="Estado *" error={errors.estado?.message}>
                <select className={input} {...register("estado")}>
                  {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </Field>
              <Field label="CEP *" error={errors.cep?.message}>
                <input className={input} {...register("cep")} placeholder="00000-000" />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Telefone">
                <input
                  className={input}
                  value={telefone}
                  onChange={(e) => setValue("telefone", maskPhone(e.target.value))}
                  placeholder="(00) 0000-0000"
                />
              </Field>
              <Field label="WhatsApp *" error={errors.whatsapp?.message}>
                <input
                  className={input}
                  value={whatsapp}
                  onChange={(e) => setValue("whatsapp", maskPhone(e.target.value), { shouldValidate: true })}
                  placeholder="(00) 00000-0000"
                />
              </Field>
              <Field label="E-mail principal *" error={errors.email?.message}>
                <input className={input} type="email" {...register("email")} />
              </Field>
            </div>
            <p className="rounded-md bg-slate-50 p-3 text-xs text-slate-600">
              O proponente declara estar ciente de que o e-mail informado neste formulário será
              utilizado como canal oficial de comunicação para notificações, diligências, convocações,
              envio de documentos, resultados e demais atos relacionados ao presente Edital.
            </p>
          </Card>

          {/* Equipe */}
          {tipo === "equipe" && (
            <Card title="Dados da equipe">
              <p className="mb-4 text-xs text-slate-600">
                Cada membro da equipe deverá preencher individualmente seus dados completos. Não é
                permitido participar de mais de uma equipe ou proposta.
              </p>
              <div className="space-y-4">
                {fields.map((f, i) => (
                  <div key={f.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-[var(--navy)]">Membro {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="inline-flex items-center gap-1 text-xs text-[var(--brand-red)] hover:underline"
                      >
                        <Trash2 className="h-3 w-3" /> Remover
                      </button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Nome completo" error={errors.membros?.[i]?.nome?.message}>
                        <input className={input} {...register(`membros.${i}.nome` as const)} />
                      </Field>
                      <Field label="CPF" error={errors.membros?.[i]?.cpf?.message}>
                        <input
                          className={input}
                          {...register(`membros.${i}.cpf` as const, {
                            onChange: (e) =>
                              setValue(`membros.${i}.cpf` as const, maskCPF(e.target.value)),
                          })}
                          placeholder="000.000.000-00"
                        />
                      </Field>
                      <Field label="E-mail" error={errors.membros?.[i]?.email?.message}>
                        <input className={input} type="email" {...register(`membros.${i}.email` as const)} />
                      </Field>
                      <Field label="Telefone" error={errors.membros?.[i]?.telefone?.message}>
                        <input
                          className={input}
                          {...register(`membros.${i}.telefone` as const, {
                            onChange: (e) =>
                              setValue(`membros.${i}.telefone` as const, maskPhone(e.target.value)),
                          })}
                          placeholder="(00) 00000-0000"
                        />
                      </Field>
                      <Field label="Função na equipe" error={errors.membros?.[i]?.funcao?.message}>
                        <input className={input} {...register(`membros.${i}.funcao` as const)} />
                      </Field>
                      <Field label="Área de atuação" error={errors.membros?.[i]?.area_atuacao?.message}>
                        <input className={input} {...register(`membros.${i}.area_atuacao` as const)} />
                      </Field>
                      <Field label="Formação" error={errors.membros?.[i]?.formacao?.message}>
                        <input className={input} {...register(`membros.${i}.formacao` as const)} />
                      </Field>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      nome: "",
                      cpf: "",
                      email: "",
                      telefone: "",
                      funcao: "",
                      area_atuacao: "",
                      formacao: "",
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar membro
                </Button>
              </div>
              <p className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
                Cada membro declara estar ciente de que não poderá compor, participar ou figurar em
                qualquer outra equipe ou proposta submetida ao presente Edital. A identificação de
                participação duplicada implicará na desclassificação imediata das propostas envolvidas.
              </p>
            </Card>
          )}

          {/* Aceite */}
          <Card title="Declaração">
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <Checkbox
                id="aceite-full"
                onCheckedChange={(c) => setValue("aceite", (c === true) as true, { shouldValidate: true })}
              />
              <span>
                Declaro que li, compreendi e concordo com os termos do <strong>Edital INOVATEC-JP 001/2026</strong>{" "}
                e com a <PrivacyDialog trigger={<a className="text-[var(--brand-blue)] underline">Política de Privacidade</a>} />.
              </span>
            </label>
            {errors.aceite && <p className="mt-2 text-xs text-[var(--brand-red)]">{errors.aceite.message}</p>}
          </Card>

          <div className="flex flex-col items-center gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md bg-[var(--brand-red)] py-6 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              {isSubmitting ? "Enviando inscrição…" : "Enviar inscrição"}
            </Button>
            <p className="text-xs text-slate-500">Revise todos os dados antes de enviar.</p>
          </div>
        </form>
      </main>
    </div>
  );
}

const input =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-[var(--brand-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/20";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
      <RainbowStripe className="absolute inset-x-0 top-0 h-1" />
      <h2 className="mb-5 text-lg font-extrabold text-[var(--navy)]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">{label}</label>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-[var(--brand-red)]">{error}</p>}
    </div>
  );
}

function FileInput({
  onFile,
  loading,
  done,
  fileName,
}: {
  onFile: (f: File) => void;
  loading: boolean;
  done: boolean;
  fileName?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-6 text-sm transition ${
        done
          ? "border-[var(--brand-green)] bg-[var(--brand-green)]/5 text-[var(--brand-green)]"
          : "border-slate-300 bg-white text-slate-600 hover:border-[var(--brand-blue)]"
      }`}
    >
      <input
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      {loading ? (
        <span>Enviando…</span>
      ) : done ? (
        <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> {fileName} (substituir)</span>
      ) : (
        <span className="flex items-center gap-2"><Upload className="h-5 w-5" /> Clique para enviar PDF, JPG ou PNG</span>
      )}
    </label>
  );
}

function maskCNPJ(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}
