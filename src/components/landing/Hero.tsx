import { FileDown } from "lucide-react";
import { RegistrationForm } from "./RegistrationForm";
import { RainbowStripe } from "./RainbowStripe";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Decorative hexagons */}
      <div className="pointer-events-none absolute -right-24 -top-20 hidden h-[480px] w-[480px] opacity-30 lg:block" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <polygon points="100,10 180,55 180,145 100,190 20,145 20,55" fill="none" stroke="var(--brand-blue)" strokeWidth="1" />
          <polygon points="100,30 162,65 162,135 100,170 38,135 38,65" fill="none" stroke="var(--brand-red)" strokeWidth="1" />
          <polygon points="100,55 138,77 138,123 100,145 62,123 62,77" fill="none" stroke="var(--brand-yellow)" strokeWidth="1" />
        </svg>
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-blue)]/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--brand-blue)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--brand-red)]" />
            INOVATEC-JP · Edital Nº 001/2026
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-[var(--navy)] md:text-5xl lg:text-6xl">
            Transforme sua ideia em <span className="text-[var(--brand-blue)]">solução pública</span>
          </h1>
          <div className="mt-5 h-1.5 w-24 rounded-full bg-[var(--brand-red)]" />
          <p className="mt-6 max-w-xl text-lg text-slate-700">
            O Hub de Inovação da INOVATEC-JP seleciona ideias inovadoras de base tecnológica para resolver
            desafios reais do setor público. Inscreva-se e concorra a aporte financeiro e suporte institucional completo.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { n: "9", l: "finalistas selecionados", c: "var(--brand-blue)" },
              { n: "3", l: "propostas vencedoras", c: "var(--brand-red)" },
              { n: "100%", l: "aporte + suporte", c: "var(--brand-green)" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-3xl font-extrabold" style={{ color: s.c }}>{s.n}</div>
                <div className="mt-1 text-sm text-slate-600">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">✓ Inscrição gratuita</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">✓ Pessoas, equipes e empresas</span>
            <span className="rounded-full bg-white px-3 py-1 shadow-sm">✓ Apoio jurídico, técnico e financeiro</span>
          </div>
          <div className="mt-8 rounded-2xl border-2 border-[var(--brand-red)]/20 bg-white p-5 shadow-md">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--brand-red)]">Documento oficial</div>
                <div className="mt-1 text-base font-extrabold text-[var(--navy)]">Baixe o Edital Completo</div>
                <p className="mt-1 text-xs text-slate-600">Leia o edital antes de se inscrever.</p>
              </div>
              <a
                href="/edital-2026.pdf"
                download
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-red)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                <FileDown className="h-5 w-5" /> Baixar Edital (PDF)
              </a>
            </div>
          </div>
        </div>
        <div className="relative"><RegistrationForm /></div>
      </div>
    </section>
  );
}
