import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitRegistration } from "@/lib/registrations.functions";
import { TIPOS_INSCRICAO } from "@/lib/constants";
import { maskPhone, digitsOnly } from "@/lib/masks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RainbowStripe } from "./RainbowStripe";
import { ArrowRight } from "lucide-react";

const schema = z.object({
  nome_completo: z.string().trim().min(2, "Informe seu nome completo").max(150),
  email: z.string().trim().email("E-mail inválido"),
  whatsapp: z.string().refine((v) => digitsOnly(v).length >= 10, "WhatsApp inválido"),
  tipo_inscricao: z.enum(["individual", "equipe", "empresa"]),
  aceite: z.literal(true, { errorMap: () => ({ message: "É necessário aceitar a Política de Privacidade" }) }),
});

type FormValues = z.infer<typeof schema>;

const fieldBase =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-[var(--brand-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/20";

const labelBase = "block text-xs font-semibold uppercase tracking-wide text-slate-700";

export function RegistrationForm() {
  const submitFn = useServerFn(submitRegistration);
  const [submitted, setSubmitted] = useState<null | { id: string; tipo: string }>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { tipo_inscricao: "individual" },
    });

  const whatsapp = watch("whatsapp") ?? "";
  const tipo = watch("tipo_inscricao");

  const onSubmit = async (values: FormValues) => {
    const res = await submitFn({
      data: {
        nome_completo: values.nome_completo,
        email: values.email,
        whatsapp: digitsOnly(values.whatsapp),
        tipo_inscricao: values.tipo_inscricao,
      },
    });
    if (res.ok) {
      toast.success("Pré-cadastro enviado!");
      setSubmitted({ id: res.id, tipo: res.tipo });
      reset();
      // Open complete form in a new tab automatically
      const url = `/cadastro?id=${encodeURIComponent(res.id)}&tipo=${encodeURIComponent(res.tipo)}`;
      window.open(url, "_blank", "noopener");
    } else {
      toast.error(res.error);
    }
  };

  if (submitted) {
    const url = `/cadastro?id=${encodeURIComponent(submitted.id)}&tipo=${encodeURIComponent(submitted.tipo)}`;
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-slate-200">
        <RainbowStripe className="absolute inset-x-0 top-0 h-1.5" />
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-green)] text-3xl text-white shadow-lg">✓</div>
        <h3 className="text-xl font-extrabold text-[var(--navy)]">Pré-cadastro confirmado!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Agora finalize sua inscrição preenchendo o cadastro completo com os dados da sua proposta.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-blue)] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
        >
          Preencher cadastro completo <ArrowRight className="h-4 w-4" />
        </a>
        <button
          onClick={() => setSubmitted(null)}
          className="mt-3 text-xs text-slate-500 underline hover:text-slate-700"
        >
          Cadastrar outra pessoa
        </button>
        <p className="mt-4 text-xs text-slate-400">
          O cadastro completo abriu em uma nova aba. Se não abriu, clique no botão acima.
        </p>
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
        <p className="mt-1 text-sm text-slate-600">
          Comece em 30 segundos. Em seguida, abriremos o cadastro completo da proposta.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="nome" className={labelBase}>Nome completo *</label>
          <input id="nome" className={`${fieldBase} mt-1.5`} {...register("nome_completo")} />
          {errors.nome_completo && <p className="mt-1 text-xs text-[var(--brand-red)]">{errors.nome_completo.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className={labelBase}>E-mail *</label>
          <input id="email" type="email" className={`${fieldBase} mt-1.5`} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-[var(--brand-red)]">{errors.email.message}</p>}
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

        <div className="flex items-start gap-2 pt-1">
          <Checkbox
            id="aceite"
            onCheckedChange={(c) => setValue("aceite", (c === true) as true, { shouldValidate: true })}
          />
          <label htmlFor="aceite" className="text-xs leading-relaxed text-slate-600">
            Li e concordo com a{" "}
            <a href="#privacidade" className="text-[var(--brand-blue)] underline">Política de Privacidade</a>.
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
        <p className="text-center text-xs text-slate-500">Inscrição gratuita · Você abrirá o cadastro completo em seguida</p>
      </div>
    </form>
  );
}
