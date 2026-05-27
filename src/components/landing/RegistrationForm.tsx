import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitRegistration } from "@/lib/registrations.functions";
import { EIXOS, ESTAGIOS } from "@/lib/constants";
import { maskCPF, maskPhone, digitsOnly } from "@/lib/masks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RainbowStripe } from "./RainbowStripe";

const schema = z.object({
  nome_completo: z.string().trim().min(2, "Informe seu nome completo").max(150),
  cpf: z.string().refine((v) => digitsOnly(v).length === 11, "CPF inválido"),
  email: z.string().trim().email("E-mail inválido"),
  whatsapp: z.string().refine((v) => digitsOnly(v).length >= 10, "WhatsApp inválido"),
  tipo_inscricao: z.enum(["individual", "equipe"]),
  eixo_tematico: z.string().min(1, "Selecione um eixo"),
  estagio_ideia: z.string().min(1, "Selecione um estágio"),
  aceite: z.literal(true, { errorMap: () => ({ message: "É necessário aceitar os termos" }) }),
});

type FormValues = z.infer<typeof schema>;

const fieldBase =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-[var(--brand-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/20";

const labelBase = "block text-xs font-semibold uppercase tracking-wide text-slate-700";

export function RegistrationForm() {
  const submitFn = useServerFn(submitRegistration);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { tipo_inscricao: "individual" },
    });

  const cpf = watch("cpf") ?? "";
  const whatsapp = watch("whatsapp") ?? "";
  const tipo = watch("tipo_inscricao");

  const onSubmit = async (values: FormValues) => {
    const res = await submitFn({
      data: {
        nome_completo: values.nome_completo,
        cpf: digitsOnly(values.cpf),
        email: values.email,
        whatsapp: digitsOnly(values.whatsapp),
        tipo_inscricao: values.tipo_inscricao,
        eixo_tematico: values.eixo_tematico,
        estagio_ideia: values.estagio_ideia,
      },
    });
    if (res.ok) {
      toast.success("Pré-cadastro enviado! Você receberá novidades por e-mail.");
      setSubmitted(true);
      reset();
    } else {
      toast.error(res.error);
    }
  };

  if (submitted) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-slate-200">
        <RainbowStripe className="-mx-8 -mt-8 mb-6 h-1.5" />
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-green)] text-3xl text-white shadow-lg">✓</div>
        <h3 className="text-xl font-extrabold text-[var(--navy)]">Cadastro confirmado!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Você receberá todas as atualizações do edital por e-mail.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-6">
          Cadastrar outra pessoa
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 md:p-8"
    >
      <RainbowStripe className="absolute inset-x-0 top-0 h-1.5" />
      <div className="mb-5">
        <h3 className="text-xl font-extrabold text-[var(--navy)]">Pré-cadastro de Interesse</h3>
        <p className="mt-1 text-sm text-slate-600">Cadastre-se e receba todas as informações do edital</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="nome" className={labelBase}>Nome completo *</label>
          <input id="nome" className={`${fieldBase} mt-1.5`} {...register("nome_completo")} />
          {errors.nome_completo && <p className="mt-1 text-xs text-[var(--brand-red)]">{errors.nome_completo.message}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="cpf" className={labelBase}>CPF *</label>
            <input
              id="cpf"
              className={`${fieldBase} mt-1.5`}
              value={cpf}
              onChange={(e) => setValue("cpf", maskCPF(e.target.value), { shouldValidate: true })}
              placeholder="000.000.000-00"
            />
            {errors.cpf && <p className="mt-1 text-xs text-[var(--brand-red)]">{errors.cpf.message}</p>}
          </div>
          <div>
            <label htmlFor="whatsapp" className={labelBase}>WhatsApp *</label>
            <input
              id="whatsapp"
              className={`${fieldBase} mt-1.5`}
              value={whatsapp}
              onChange={(e) => setValue("whatsapp", maskPhone(e.target.value), { shouldValidate: true })}
              placeholder="(00) 00000-0000"
            />
            {errors.whatsapp && <p className="mt-1 text-xs text-[var(--brand-red)]">{errors.whatsapp.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelBase}>E-mail *</label>
          <input id="email" type="email" className={`${fieldBase} mt-1.5`} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-[var(--brand-red)]">{errors.email.message}</p>}
        </div>

        <div>
          <span className={labelBase}>Tipo de inscrição *</span>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {[
              { v: "individual", l: "Pessoa individual" },
              { v: "equipe", l: "Equipe" },
            ].map((o) => (
              <label
                key={o.v}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium text-slate-700 transition ${
                  tipo === o.v
                    ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/5 text-[var(--brand-blue)]"
                    : "border-slate-300 bg-white hover:border-slate-400"
                }`}
              >
                <input
                  type="radio"
                  value={o.v}
                  {...register("tipo_inscricao")}
                  className="h-4 w-4 accent-[var(--brand-blue)]"
                />
                {o.l}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="eixo" className={labelBase}>Eixo temático de interesse *</label>
          <select id="eixo" {...register("eixo_tematico")} className={`${fieldBase} mt-1.5`}>
            <option value="">Selecione…</option>
            {EIXOS.map((e) => <option key={e.id} value={e.label}>{e.short}</option>)}
          </select>
          {errors.eixo_tematico && <p className="mt-1 text-xs text-[var(--brand-red)]">{errors.eixo_tematico.message}</p>}
        </div>

        <div>
          <label htmlFor="estagio" className={labelBase}>Estágio da sua ideia *</label>
          <select id="estagio" {...register("estagio_ideia")} className={`${fieldBase} mt-1.5`}>
            <option value="">Selecione…</option>
            {ESTAGIOS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          {errors.estagio_ideia && <p className="mt-1 text-xs text-[var(--brand-red)]">{errors.estagio_ideia.message}</p>}
        </div>

        <div className="flex items-start gap-2 pt-1">
          <Checkbox
            id="aceite"
            onCheckedChange={(c) => setValue("aceite", (c === true) as true, { shouldValidate: true })}
          />
          <label htmlFor="aceite" className="text-xs leading-relaxed text-slate-600">
            Li e concordo com os termos do edital e com a Política de Privacidade.
          </label>
        </div>
        {errors.aceite && <p className="-mt-2 text-xs text-[var(--brand-red)]">{errors.aceite.message}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[var(--brand-red)] py-6 text-base font-semibold text-white shadow-md transition hover:opacity-90"
        >
          {isSubmitting ? "Enviando…" : "Quero participar →"}
        </Button>
        <p className="text-center text-xs text-slate-500">Inscrição gratuita · Receba atualizações por e-mail</p>
      </div>
    </form>
  );
}
