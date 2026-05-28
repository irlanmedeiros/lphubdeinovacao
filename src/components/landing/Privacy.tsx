export function Privacy() {
  return (
    <section id="privacidade" className="bg-[var(--surface)] py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]">Política de Privacidade</span>
          <h2 className="mt-2 text-2xl font-extrabold text-[var(--navy)] md:text-3xl">Como tratamos os seus dados</h2>
          <div className="mt-3 h-1 w-12 rounded-full bg-[var(--brand-red)]" />
          <div className="mt-6 space-y-3 text-sm leading-relaxed text-slate-700">
            <p>Os dados pessoais informados no pré-cadastro e no cadastro completo (nome, e-mail, WhatsApp, CPF/CNPJ, dados da proposta e demais informações) são coletados e tratados pela INOVATEC-JP exclusivamente para fins de avaliação, comunicação e acompanhamento das inscrições do Edital Inova Soluções Públicas.</p>
            <p>O tratamento é realizado em conformidade com a <b>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</b>. Seus dados não são compartilhados com terceiros sem sua autorização, salvo por obrigação legal ou no âmbito do processo seletivo do edital.</p>
            <p>Você pode, a qualquer momento, solicitar acesso, correção, anonimização ou exclusão dos seus dados entrando em contato pelo e-mail <a href="mailto:hubdeinovacaoinovatec@gmail.com" className="font-semibold text-[var(--brand-blue)] hover:underline">hubdeinovacaoinovatec@gmail.com</a>.</p>
            <p>Os dados são mantidos pelo período necessário ao processo do edital e às obrigações legais aplicáveis, sendo armazenados em ambiente seguro com controles de acesso restritos.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
