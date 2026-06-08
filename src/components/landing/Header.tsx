import { RainbowStripe } from "./RainbowStripe";
import hubLogo from "@/assets/hub-logo.svg";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm">
      <RainbowStripe className="h-1.5" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="#hero" className="flex items-center"><img src={hubLogo} alt="Hub de Inovação INOVATEC-JP" className="h-12 w-auto" /></a>
        <nav className="hidden gap-7 text-sm font-medium text-slate-700 lg:flex">
          <a href="#edital" className="hover:text-[var(--brand-blue)]">O Edital</a>
          <a href="#eixos" className="hover:text-[var(--brand-blue)]">Eixos</a>
          <a href="#processo" className="hover:text-[var(--brand-blue)]">Processo</a>
          <a href="#origem" className="hover:text-[var(--brand-blue)]">Origem</a>
          <a href="#faq" className="hover:text-[var(--brand-blue)]">Dúvidas</a>
          <a href="/status" className="hover:text-[var(--brand-blue)]">Consultar status</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="/status" className="hidden text-sm font-medium text-slate-700 hover:text-[var(--brand-blue)] md:inline">Status</a>
          <a
            href="#hero"
            className="rounded-full bg-[var(--brand-red)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            Pré-cadastro
          </a>
        </div>
      </div>
    </header>
  );
}
