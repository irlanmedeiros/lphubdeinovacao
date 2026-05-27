import { Users, ChartBar, Trophy, ListOrdered } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { EIXOS } from "@/lib/constants";
import { RegistrationForm } from "./RegistrationForm";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--navy)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="#hero" className="font-bold text-white">Hub de Inovação <span className="text-white/60">· INOVATEC-JP</span></a>
        <nav className="hidden gap-6 text-sm text-white/80 md:flex">
          <a href="#edital" className="hover:text-white">O Edital</a>
          <a href="#processo" className="hover:text-white">Processo</a>
          <a href="#origem" className="hover:text-white">Origem</a>
          <a href="#faq" className="hover:text-white">Dúvidas</a>
        </nav>
        <a href="#hero" className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          Pré-cadastro
        </a>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section id="hero" className="bg-[var(--navy)] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            INOVATEC-JP · Edital Nº 001/2026
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            Transforme sua ideia em <span className="text-[var(--brand-yellow)]">solução pública</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            O Hub de Inovação da INOVATEC-JP está selecionando ideias inovadoras de base tecnológica para desenvolver
            sistemas aplicáveis ao setor público. Inscreva-se e concorra a aporte financeiro e suporte institucional completo.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { n: "9", l: "finalistas selecionados" },
              { n: "3", l: "propostas vencedoras" },
              { n: "100%", l: "aporte + suporte" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="text-3xl font-bold text-[var(--brand-yellow)]">{s.n}</div>
                <div className="text-sm text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div><RegistrationForm /></div>
      </div>
    </section>
  );
}

export function EditalInfo() {
  const cards = [
    { icon: Users, title: "Quem pode participar", body: <p>Pessoas físicas, individualmente ou em equipe. Cada proponente pode inscrever apenas 1 proposta.</p> },
    {
      icon: ChartBar, title: "O que será avaliado (100 pontos)",
      body: (
        <ul className="space-y-1 text-sm">
          <li>Relevância do problema público: <b>20pts</b></li>
          <li>Grau de inovação: <b>15pts</b></li>
          <li>Viabilidade técnica e financeira: <b>15pts</b></li>
          <li>Potencial de aplicação no setor público: <b>15pts</b></li>
          <li>Impacto social: <b>10pts</b></li>
          <li>Escalabilidade: <b>10pts</b></li>
          <li>Sustentabilidade: <b>10pts</b></li>
          <li>Qualidade da apresentação: <b>5pts</b></li>
          <li className="pt-2 text-xs italic text-slate-500">Mínimo de 70 pontos para ser finalista.</li>
        </ul>
      ),
    },
    { icon: Trophy, title: "O que os vencedores recebem", body: <p>Aporte financeiro (valor definido na proposta) + apoio jurídico, contábil, técnico, de comunicação e design + inserção no ecossistema de inovação da INOVATEC-JP.</p> },
    {
      icon: ListOrdered, title: "Como funciona o processo",
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
    <section id="edital" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--navy)] md:text-4xl">O que é o Edital Inova Soluções Públicas?</h2>
          <p className="mt-3 text-slate-600">Conheça as principais informações antes de se inscrever</p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="grid gap-5 sm:grid-cols-2">
            {cards.map((c) => (
              <div key={c.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-[var(--navy)]">{c.title}</h3>
                <div className="mt-2 text-sm text-slate-600">{c.body}</div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-[var(--navy)]">4 Eixos Temáticos</h3>
            {EIXOS.map((e) => (
              <div key={e.id} className={`rounded-xl ${e.bg} p-5 text-white`}>
                <div className="font-bold">{e.icon} {e.label}</div>
                <p className="mt-2 text-sm text-white/90">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <a href="/edital-2026.pdf" download className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-red)] px-8 py-4 text-base font-semibold text-white shadow-lg hover:opacity-90">
            📄 Baixar Edital Completo (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}

export function Timeline() {
  const steps = [
    { e: "📝", t: "Inscrição", d: "Formulário online gratuito com dados da proposta, equipe e ideia" },
    { e: "✅", t: "Habilitação", d: "Análise de aderência ao edital e requisitos mínimos" },
    { e: "🔍", t: "Avaliação Técnica", d: "Banca especializada avalia as propostas habilitadas (0–100 pts)" },
    { e: "🏆", t: "Finalistas", d: "Até 9 propostas finalistas são convocadas" },
    { e: "🎤", t: "Pitch", d: "Apresentação oral presencial perante banca avaliadora" },
    { e: "🥇", t: "Vencedores", d: "3 propostas vencedoras são selecionadas" },
    { e: "🤝", t: "Formalização", d: "Instrumento jurídico + plano de trabalho + início do apoio" },
  ];
  return (
    <section id="processo" className="bg-[var(--surface)] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--navy)] md:text-4xl">Como funciona o processo seletivo</h2>
          <p className="mt-3 text-slate-600">7 etapas do edital à execução da sua solução</p>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {steps.map((s, i) => (
            <li key={s.t} className="relative rounded-xl bg-white p-5 shadow-sm">
              <div className="absolute -top-3 left-5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-blue)] text-xs font-bold text-white">{i + 1}</div>
              <div className="text-2xl">{s.e}</div>
              <div className="mt-2 font-bold text-[var(--navy)]">{s.t}</div>
              <p className="mt-1 text-xs text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Origin() {
  return (
    <section id="origem" className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-[var(--brand-blue)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--brand-blue)]">Nossa origem</span>
          <h2 className="mt-4 text-3xl font-bold text-[var(--navy)] md:text-4xl">Por que o Hub de Inovação nasceu?</h2>
          <div className="mt-6 space-y-4 text-slate-700">
            <p>A INOVATEC-JP observou de perto os editais propostos por diversas secretarias municipais ao longo dos últimos anos. Com base nessa análise sistemática, identificou erros recorrentes: editais incompletos, critérios vagos, processos sem estrutura de acompanhamento e ausência de apoio real aos proponentes após a seleção.</p>
            <p>A partir dessas observações, a INOVATEC-JP consolidou um modelo próprio — mais justo, mais transparente e mais eficaz. O Hub de Inovação nasce como resultado dessa experiência: um espaço onde ideias realmente recebem o suporte necessário para se tornarem soluções públicas reais.</p>
            <p>Diferente de outros editais, aqui <b>o pitch é o que decide o investimento</b>. Sua apresentação vale mais do que qualquer formulário. E os vencedores recebem acompanhamento técnico, jurídico, contábil, de comunicação e institucional — não apenas dinheiro.</p>
          </div>
          <a href="https://inovatecjp.com" target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-md border-2 border-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-white">
            Conhecer a INOVATEC-JP →
          </a>
        </div>
        <div className="rounded-2xl bg-[var(--navy)] p-8 text-white">
          <h3 className="text-lg font-semibold text-white/70">Resultados que comprovam</h3>
          <div className="mt-6 space-y-6">
            {[
              { n: "R$ 500 milhões", l: "investidos em projetos de inovação em JP" },
              { n: "207 serviços", l: "digitais no app JP na Palma da Mão" },
              { n: "ROI de 8x", l: "no projeto de recuperação de faturamento do SUS" },
              { n: "1ª agência", l: "municipal de inovação legalmente estruturada do Brasil" },
            ].map((s) => (
              <div key={s.l} className="border-b border-white/10 pb-4 last:border-0">
                <div className="text-2xl font-bold text-[var(--brand-yellow)]">{s.n}</div>
                <div className="text-sm text-white/80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="bg-[var(--navy)] py-20 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <div className="text-2xl font-extrabold tracking-wider">INOVATEC-JP</div>
        <h2 className="mt-4 text-3xl font-bold md:text-4xl">Um projeto da Agência de Inovação Tecnológica de João Pessoa</h2>
        <p className="mx-auto mt-6 max-w-3xl text-white/80">
          A INOVATEC-JP é a primeira agência municipal de inovação do Brasil legalmente estruturada para o fomento à inovação tecnológica.
          Somos o elo entre academia, governo e iniciativa privada — promovendo soluções que tornam João Pessoa mais eficiente, moderna e humana.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { e: "🏛️", t: "Serviço Social Autônomo", d: "Transparência pública com agilidade privada" },
            { e: "⚖️", t: "Validado pelo TCE-PB", d: "Legalidade reconhecida por unanimidade" },
            { e: "🎓", t: "UFPB + Iniciativa Privada", d: "Ecossistema de inovação real" },
          ].map((p) => (
            <div key={p.t} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="text-3xl">{p.e}</div>
              <div className="mt-3 font-bold">{p.t}</div>
              <p className="mt-1 text-sm text-white/70">{p.d}</p>
            </div>
          ))}
        </div>
        <Button asChild className="mt-10 bg-[var(--brand-red)] px-8 py-6 text-base font-semibold text-white hover:opacity-90">
          <a href="https://inovatecjp.com" target="_blank" rel="noreferrer">Visitar o site da INOVATEC-JP</a>
        </Button>
      </div>
    </section>
  );
}

export function FAQ() {
  const items = [
    ["Empresas podem participar deste edital?", "Sim, o edital é aberto a pessoas físicas, equipes e pessoas jurídicas. Porém, esta landing page é focada no cadastro de pessoas e equipes. Empresas interessadas em se cadastrar na INOVATEC-JP devem acessar o portal de fornecedores em inovatec-connect-hub.lovable.app"],
    ["O cadastro nesta página já é a inscrição oficial no edital?", "Não. O pré-cadastro aqui é para você demonstrar interesse e receber todas as informações e atualizações sobre o edital por e-mail. A inscrição oficial será realizada pelo formulário eletrônico disponibilizado no período de inscrições."],
    ["O que acontece depois que eu me cadastrar?", "Você receberá um e-mail de confirmação e passará a ser notificado sobre todas as etapas do processo: abertura das inscrições, datas de pitch, resultados e próximos passos."],
    ["Posso participar sozinho ou preciso de uma equipe?", "Você pode participar individualmente ou em equipe. Caso se inscreva em equipe, um representante deverá ser indicado como responsável oficial pela interlocução com a INOVATEC-JP."],
    ["Qual o valor do aporte financeiro para os vencedores?", "O valor do aporte é definido pela própria proposta do proponente e avaliado pela INOVATEC-JP. O pitch é o momento decisivo — é ele que determina o investimento a ser feito."],
    ["A INOVATEC-JP fica com direitos sobre minha ideia?", "Não automaticamente. A inscrição não implica cessão de propriedade intelectual. Os termos de direitos serão definidos em instrumento jurídico específico com os vencedores. A INOVATEC-JP terá participação de 15% sobre o produto desenvolvido durante o período de parceria."],
  ];
  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center text-3xl font-bold text-[var(--navy)] md:text-4xl">Dúvidas frequentes</h2>
        <Accordion type="single" collapsible className="mt-10">
          {items.map(([q, a], i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left font-semibold text-[var(--navy)]">{q}</AccordionTrigger>
              <AccordionContent className="text-slate-600">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--navy)] py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3">
        <div>
          <div className="font-bold">Hub de Inovação · INOVATEC-JP</div>
          <p className="mt-2 text-sm text-white/70">Inovar não é apenas criar — é transformar realidades.</p>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-white/90">Navegação</div>
          <ul className="mt-3 space-y-2 text-white/70">
            <li><a href="#hero" className="hover:text-white">Início</a></li>
            <li><a href="#edital" className="hover:text-white">O Edital</a></li>
            <li><a href="/edital-2026.pdf" download className="hover:text-white">Baixar Edital (PDF)</a></li>
            <li><a href="#hero" className="hover:text-white">Pré-cadastro</a></li>
            <li><a href="#faq" className="hover:text-white">Dúvidas</a></li>
            <li><a href="/admin/login" className="hover:text-white">Acesso administrativo</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-white/90">Contato</div>
          <ul className="mt-3 space-y-2 text-white/70">
            <li>Instagram: @inovatecjp</li>
            <li>E-mail: inovatecjp@inovatecjp.com.br</li>
            <li>Site: <a href="https://inovatecjp.com" className="hover:text-white">inovatecjp.com</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-6 text-center text-xs text-white/60">
        © 2026 INOVATEC-JP — Agência de Inovação Tecnológica de João Pessoa · Política de Privacidade · Termos de Uso
      </div>
    </footer>
  );
}
