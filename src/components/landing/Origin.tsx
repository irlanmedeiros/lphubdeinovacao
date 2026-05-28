import { ArrowRight } from "lucide-react";
import { RainbowStripe } from "./RainbowStripe";

export function Origin() {
  return (
    <section id="origem" className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">Nossa Origem</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--navy)] md:text-4xl">Por que o Hub de Inovação nasceu?</h2>
          <div className="mt-4 h-1 w-16 rounded-full bg-[var(--brand-red)]" />
          <div className="mt-6 space-y-4 text-slate-700">
            <p>A INOVATEC-JP observou de perto os editais propostos por diversas secretarias municipais ao longo dos últimos anos. Com base nessa análise sistemática, identificou erros recorrentes: editais incompletos, critérios vagos, processos sem estrutura de acompanhamento e ausência de apoio real aos proponentes após a seleção.</p>
            <p>A partir dessas observações, a INOVATEC-JP consolidou um modelo próprio — mais justo, mais transparente e mais eficaz. O Hub de Inovação nasce como resultado dessa experiência.</p>
            <p>Diferente de outros editais, aqui <b>o pitch é o que decide o investimento</b>. E os vencedores recebem acompanhamento técnico, jurídico, contábil, de comunicação e institucional — não apenas dinheiro.</p>
          </div>
          <a
            href="https://inovatecjp.com"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[var(--brand-blue)] px-6 py-3 text-sm font-semibold text-[var(--brand-blue)] transition hover:bg-[var(--brand-blue)] hover:text-white"
          >
            Conhecer a INOVATEC-JP <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-[var(--navy)] p-8 text-white shadow-xl">
          <RainbowStripe className="absolute inset-x-0 top-0 h-1.5" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">Resultados que comprovam</h3>
          <div className="mt-6 space-y-5">
            {[
              { n: "R$ 500 milhões", l: "investidos em projetos de inovação em JP", c: "var(--brand-yellow)" },
              { n: "207 serviços", l: "digitais no app JP na Palma da Mão", c: "var(--brand-green)" },
              { n: "ROI de 8x", l: "no projeto de recuperação de faturamento do SUS", c: "var(--brand-orange)" },
              { n: "1ª agência", l: "municipal de inovação legalmente estruturada do Brasil", c: "var(--brand-red)" },
            ].map((s) => (
              <div key={s.l} className="border-b border-white/10 pb-4 last:border-0">
                <div className="text-2xl font-extrabold" style={{ color: s.c }}>{s.n}</div>
                <div className="text-sm text-white/80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
