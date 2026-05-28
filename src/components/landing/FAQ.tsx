import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQ() {
  const items = [
    ["Empresas podem participar deste edital?", "Sim, o edital é aberto a pessoas físicas, equipes e pessoas jurídicas. Porém, esta landing page é focada no cadastro de pessoas e equipes. Empresas interessadas em se cadastrar na INOVATEC-JP devem acessar o portal de fornecedores em inovatec-connect-hub.lovable.app"],
    ["O cadastro nesta página já é a inscrição oficial no edital?", "Não. O pré-cadastro aqui é para você demonstrar interesse e receber todas as informações e atualizações sobre o edital por e-mail. A inscrição oficial será realizada pelo formulário eletrônico disponibilizado no período de inscrições."],
    ["O que acontece depois que eu me cadastrar?", "Você receberá um e-mail de confirmação e passará a ser notificado sobre todas as etapas do processo: abertura das inscrições, datas de pitch, resultados e próximos passos."],
    ["Posso participar sozinho ou preciso de uma equipe?", "Você pode participar individualmente ou em equipe. Caso se inscreva em equipe, um representante deverá ser indicado como responsável oficial pela interlocução com a INOVATEC-JP."],
    ["Qual o valor do aporte financeiro para os vencedores?", "O valor do aporte é definido pela própria proposta do proponente e avaliado pela INOVATEC-JP. O pitch é o momento decisivo — é ele que determina o investimento a ser feito."],
    ["A INOVATEC-JP fica com direitos sobre minha ideia?", "Não automaticamente. A inscrição não implica cessão de propriedade intelectual. Os termos de direitos serão definidos em instrumento jurídico específico com os vencedores. A INOVATEC-JP terá participação de 15% sobre o produto desenvolvido durante o período de parceria."]
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
