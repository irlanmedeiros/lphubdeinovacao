export function HubLogo({ className = "", variant = "dark" }: { className?: string; variant?: "dark" | "light" }) {
  const text = variant === "dark" ? "var(--navy)" : "#ffffff";
  const sub = variant === "dark" ? "var(--brand-blue)" : "rgba(255,255,255,0.75)";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
        {/* Hexagonal mark inspired by Hub logo */}
        <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="none" stroke="var(--brand-blue)" strokeWidth="3" />
        <polygon points="32,14 47,22.5 47,41.5 32,50 17,41.5 17,22.5" fill="var(--brand-blue)" />
        <circle cx="32" cy="22" r="3.5" fill="var(--brand-yellow)" />
        <circle cx="22" cy="38" r="3.5" fill="var(--brand-red)" />
        <circle cx="42" cy="38" r="3.5" fill="var(--brand-green)" />
        <path d="M22 38 L32 22 L42 38 Z" fill="none" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
      <div className="leading-tight">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: text }}>
          Hub de
        </div>
        <div className="text-[15px] font-extrabold uppercase tracking-[0.16em] -mt-0.5" style={{ color: text }}>
          Inovação
        </div>
        <div className="text-[9px] font-semibold uppercase tracking-[0.22em] mt-0.5" style={{ color: sub }}>
          INOVATEC-JP
        </div>
      </div>
    </div>
  );
}
