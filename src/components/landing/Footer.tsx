import { ArrowRight } from "lucide-react";
import { RainbowStripe } from "./RainbowStripe";
import hubLogo from "@/assets/hub-logo.svg";
import PrivacyDialog from "./PrivacyDialog";

export function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <img src={hubLogo} alt="Hub de Inovação INOVATEC-JP" className="h-14 w-auto brightness-0 invert" />
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
            <li>
              <PrivacyDialog trigger={<a className="hover:text-white">Política de Privacidade</a>} />
            </li>
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
          © 2026 INOVATEC-JP — Agência de Inovação Tecnológica de João Pessoa
        </div>
      </div>
      <RainbowStripe className="h-1.5" />
    </footer>
  );
}
