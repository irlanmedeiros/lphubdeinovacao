import { ArrowRight, Landmark, Scale, GraduationCap } from "lucide-react";
import { RainbowStripe } from "./RainbowStripe";
import hubLogo from "@/assets/hub-logo.svg";

export function About() {
  return (
    <section className="relative bg-[var(--surface)] py-20">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <div className="mx-auto flex justify-center"><img src={hubLogo} alt="Hub de Inovação INOVATEC-JP" className="h-16 w-auto" /></div>
        <h2 className="mt-6 text-3xl font-extrabold text-[var(--navy)] md:text-4xl">
          Um projeto da Agência de Inovação Tecnológica de João Pessoa
        </h2>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--brand-red)]" />
        <p className="mx-auto mt-6 max-w-3xl text-slate-700">
          A INOVATEC-JP é a primeira agência municipal de inovação do Brasil legalmente estruturada para o fomento à inovação tecnológica.
          Somos o elo entre academia, governo e iniciativa privada — promovendo soluções que tornam João Pessoa mais eficiente, moderna e humana.
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { Icon: Landmark, t: "Serviço Social Autônomo", d: "Transparência pública com agilidade privada", c: "var(--brand-blue)" },
            { Icon: Scale, t: "Validado pelo TCE-PB", d: "Legalidade reconhecida por unanimidade", c: "var(--brand-red)" },
            { Icon: GraduationCap, t: "UFPB + Iniciativa Privada", d: "Ecossistema de inovação real", c: "var(--brand-green)" },
          ].map((p) => (
            <div key={p.t} className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: p.c }}>
                <p.Icon className="h-6 w-6" />
              </div>
              <div className="mt-4 font-bold text-[var(--navy)]">{p.t}</div>
              <p className="mt-1 text-sm text-slate-600">{p.d}</p>
            </div>
          ))}
        </div>
        <a
          href="https://inovatecjp.com"
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--brand-red)] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
        >
          Visitar o site da INOVATEC-JP <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}
