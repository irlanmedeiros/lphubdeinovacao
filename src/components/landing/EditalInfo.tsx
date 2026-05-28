import { Users, ChartBar, Trophy, ListOrdered } from "lucide-react";
import { EIXOS } from "@/lib/constants";

export function EditalInfo() {
  const cards = [
    { icon: Users, color: "var(--brand-blue)", title: "Quem pode participar", body: <p>Pessoas físicas, individualmente ou em equipe. Cada proponente pode inscrever apenas 1 proposta.</p> },
    {
      icon: ChartBar, color: "var(--brand-red)", title: "O que será avaliado (100 pts)",
      body: (
        <ul className="space-y-1 text-sm">
          <li>Relevância do problema público: <b>20pts</b></li>
          <li>Grau de inovação: <b>15pts</b></li>
          <li>Viabilidade técnica e financeira: <b>15pts</b></li>
          <li>Potencial no setor público: <b>15pts</b></li>
          <li>Impacto social: <b>10pts</b></li>
          <li>Escalabilidade: <b>10pts</b></li>
          <li>Sustentabilidade: <b>10pts</b></li>
          <li>Qualidade da apresentação: <b>5pts</b></li>
          <li className="pt-2 text-xs italic text-slate-500">Mínimo de 70 pontos para ser finalista.</li>
        </ul>
      ),
    },
    { icon: Trophy, color: "var(--brand-yellow)", title: "O que os vencedores recebem", body: <p>Aporte financeiro (valor definido na proposta) + apoio jurídico, contábil, técnico, de comunicação e design + inserção no ecossistema de inovação da INOVATEC-JP.</p> },
    {
      icon: ListOrdered, color: "var(--brand-green)", title: "Como funciona o processo",
      body: (
        <ol className="list-inside list-decimal space-y-1 text-sm">
          <li>Inscrição online gratuita</li>
          <li>Análise de habilitação e aderência</li>
          <li>Avaliação técnica das propostas</li>
          <li>Seleção de até 9 finalistas</li>
          <li>Pitch presencial perante banca</li>
          <li>3 vencedoras recebem apoio completo</li>
        </ol>
      ),
    },
  ];
  return (
    <section id="edital" className="bg-[var(--surface)] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">O Edital</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--navy)] md:text-4xl">O que é o Edital Inova Soluções Públicas?</h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--brand-red)]" />
          <p className="mt-4 text-slate-600">Conheça as principais informações antes de se inscrever</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: c.color }}>
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-bold text-[var(--navy)]">{c.title}</h3>
              <div className="mt-2 text-sm text-slate-600">{c.body}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="/edital-2026.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-red)] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
          >
            Baixar Edital Completo (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}
