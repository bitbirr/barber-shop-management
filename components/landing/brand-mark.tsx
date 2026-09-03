import "iconify-icon";
import Link from "next/link";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-coral-400 text-white shadow-soft">
        <iconify-icon icon="ph:scissors-fill" width="18" />
      </span>
      <span className="leading-tight">
        <span className={`block text-lg font-900 tracking-tight ${light ? "text-sky-50" : "text-ink-900"}`}>Bit-Barber</span>
        <span className={`block text-[10px] font-800 uppercase tracking-[0.14em] ${light ? "text-sky-200/80" : "text-sky-600"}`}>System</span>
      </span>
    </Link>
  );
}
