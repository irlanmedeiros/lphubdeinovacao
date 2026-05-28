import { Building2, BarChart3, HeartHandshake, Megaphone } from "lucide-react";
import { EIXOS } from "@/lib/constants";

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
