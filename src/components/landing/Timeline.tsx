export function Timeline() {
  const steps = [
    { e: "📝", t: "Inscrição", d: "Formulário online gratuito" },
    { e: "✅", t: "Habilitação", d: "Análise de aderência ao edital" },
    { e: "🔍", t: "Avaliação", d: "Banca avalia (0–100 pts)" },
    { e: "🏆", t: "Finalistas", d: "Até 9 propostas convocadas" },
    { e: "🎤", t: "Pitch", d: "Apresentação presencial" },
    { e: "🥇", t: "Vencedores", d: "3 propostas selecionadas" },
    { e: "🤝", t: "Formalização", d: "Instrumento + apoio completo" },
  ];
  return (
    <section id="processo" className="bg-[var(--surface)] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">A Jornada</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--navy)] md:text-4xl">7 etapas, processo transparente</h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--brand-red)]" />
        </div>
        <div className="relative mt-14">
          <div
            className="absolute left-0 right-0 top-6 hidden h-1.5 rounded-full lg:block"
            style={{ background: "var(--gradient-rainbow)" }}
            aria-hidden="true"
          />
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {steps.map((s, i) => (
              <li key={s.t} className="relative">
                <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-[var(--surface)] bg-[var(--brand-blue)] text-sm font-extrabold text-white shadow-md">
                  {i + 1}
                </div>
                <div className="mt-4 rounded-xl bg-white p-4 text-center shadow-sm">
                  <div className="text-2xl">{s.e}</div>
                  <div className="mt-1 text-sm font-bold text-[var(--navy)]">{s.t}</div>
                  <p className="mt-1 text-xs text-slate-600">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-10 text-center text-sm text-slate-600">
          Inscrição gratuita · Assinatura via GOV.BR · Recurso administrativo garantido · Mínimo de 70 pontos para finalista
        </p>
      </div>
    </section>
  );
}
