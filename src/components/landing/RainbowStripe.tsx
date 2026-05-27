export function RainbowStripe({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-2 w-full ${className}`} aria-hidden="true">
      <div className="flex-1 bg-[var(--brand-blue)]" />
      <div className="flex-1 bg-[var(--brand-magenta)]" />
      <div className="flex-1 bg-[var(--brand-red)]" />
      <div className="flex-1 bg-[var(--brand-orange)]" />
      <div className="flex-1 bg-[var(--brand-yellow)]" />
      <div className="flex-1 bg-[var(--brand-green)]" />
    </div>
  );
}
