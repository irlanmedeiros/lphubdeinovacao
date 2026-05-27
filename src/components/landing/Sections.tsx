import { Users, ChartBar, Trophy, ListOrdered, Building2, BarChart3, HeartHandshake, Megaphone, FileDown, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EIXOS } from "@/lib/constants";
import { RegistrationForm } from "./RegistrationForm";
import { HubLogo } from "./HubLogo";
import { RainbowStripe } from "./RainbowStripe";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm">
      <RainbowStripe className="h-1.5" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="#hero"><HubLogo /></a>
        <nav className="hidden gap-7 text-sm font-medium text-slate-700 lg:flex">
          <a href="#edital" className="hover:text-[var(--brand-blue)]">O Edital</a>
          <a href="#eixos" className="hover:text-[var(--brand-blue)]">Eixos</a>
          <a href="#processo" className="hover:text-[var(--brand-blue)]">Processo</a>
          <a href="#origem" className="hover:text-[var(--brand-blue)]">Origem</a>
          <a href="#faq" className="hover:text-[var(--brand-blue)]">Dúvidas</a>
        </nav>
        <a
          href="#hero"
          className="rounded-full bg-[var(--brand-red)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
        >
          Pré-cadastro
        </a>
      </div>
    </header>
  );
}

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
            <FileDown className="h-5 w-5" /> Baixar Edital Completo (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}

export function Eixos() {
  const icons = [Building2, BarChart3, HeartHandshake, Megaphone];
  return (
    <section id="eixos" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">Eixos Temáticos</span>
          <h2 className="mt-2 text-3xl font-extrabold uppercase text-[var(--navy)] md:text-4xl">
            4 Frentes, todos com potencial de transformar JP
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--brand-red)]" />
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EIXOS.map((e, i) => {
            const Icon = icons[i];
            const isYellow = e.id === "comunicacao";
            const textColor = isYellow ? "text-[var(--navy)]" : "text-white";
            const subText = isYellow ? "text-[var(--navy)]/80" : "text-white/90";
            const iconBg = isYellow ? "bg-[var(--navy)]" : "bg-white";
            const iconColor = isYellow ? "text-[var(--brand-yellow)]" : "";
            return (
              <div key={e.id} className={`relative overflow-hidden rounded-2xl ${e.bg} ${textColor} p-6 shadow-lg`}>
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}>
                  <Icon className={`h-7 w-7 ${iconColor}`} style={!isYellow ? { color: e.bg.includes("brand-blue") ? "var(--brand-blue)" : e.bg.includes("brand-red") ? "var(--brand-red)" : "var(--brand-green)" } : undefined} />
                </div>
                <h3 className="mt-5 text-base font-extrabold uppercase leading-tight tracking-wide">{e.short}</h3>
                <p className={`mt-1 text-xs font-semibold uppercase tracking-wide ${subText}`}>{e.kicker}</p>
                <div className={`my-4 h-px ${isYellow ? "bg-[var(--navy)]/30" : "bg-white/30"}`} />
                <p className={`text-sm ${subText}`}>{e.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

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

export function About() {
  return (
    <section className="relative bg-[var(--surface)] py-20">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <div className="mx-auto flex justify-center"><HubLogo /></div>
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
            { e: "🏛️", t: "Serviço Social Autônomo", d: "Transparência pública com agilidade privada", c: "var(--brand-blue)" },
            { e: "⚖️", t: "Validado pelo TCE-PB", d: "Legalidade reconhecida por unanimidade", c: "var(--brand-red)" },
            { e: "🎓", t: "UFPB + Iniciativa Privada", d: "Ecossistema de inovação real", c: "var(--brand-green)" },
          ].map((p) => (
            <div key={p.t} className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-white" style={{ backgroundColor: p.c }}>
                {p.e}
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
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">Dúvidas Frequentes</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--navy)] md:text-4xl">Perguntas mais comuns</h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--brand-red)]" />
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {items.map(([q, a], i) => (
            <AccordionItem key={i} value={`q${i}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white px-4 shadow-sm data-[state=open]:border-[var(--brand-blue)]">
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
    <footer className="bg-[var(--navy)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <HubLogo variant="light" />
          <p className="mt-4 text-sm text-white/70">
            Inovar não é apenas criar — é transformar realidades com inteligência, criatividade e responsabilidade.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-semibold uppercase tracking-wider text-white/90">Navegação</div>
          <ul className="mt-4 space-y-2 text-white/70">
            <li><a href="#hero" className="hover:text-white">Início</a></li>
            <li><a href="#edital" className="hover:text-white">O Edital</a></li>
            <li><a href="#eixos" className="hover:text-white">Eixos Temáticos</a></li>
            <li><a href="/edital-2026.pdf" download className="hover:text-white">Baixar Edital (PDF)</a></li>
            <li><a href="#faq" className="hover:text-white">Dúvidas</a></li>
            <li><a href="/admin/login" className="hover:text-white">Acesso administrativo</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-semibold uppercase tracking-wider text-white/90">Contato</div>
          <ul className="mt-4 space-y-2 text-white/70">
            <li>Instagram: <a href="https://instagram.com/inovatecjp" className="hover:text-white">@inovatecjp</a></li>
            <li>E-mail: hubdeinovacaoinovatec@gmail.com</li>
            <li>WhatsApp: +55 (83) 99684-1932</li>
            <li>Site: <a href="https://inovatecjp.com" className="hover:text-white">inovatecjp.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/60">
          © 2026 INOVATEC-JP — Agência de Inovação Tecnológica de João Pessoa · Política de Privacidade · Termos de Uso
        </div>
      </div>
      <RainbowStripe className="h-1.5" />
    </footer>
  );
}
