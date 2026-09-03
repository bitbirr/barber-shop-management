import Image from "next/image";
import Link from "next/link";

export const brandAssets = {
  primary: "/brand/logo-primary-horizontal.png",
  stacked: "/brand/logo-stacked.png",
  mark: "/brand/logo-mark.png",
  onDark: "/brand/logo-on-dark.png",
  wordmark: "/brand/logo-wordmark.png",
  favicon: "/brand/logo-favicon.png",
  mono: "/brand/logo-mono.png",
  seal: "/brand/logo-seal.png",
} as const;

type BrandMarkProps = {
  light?: boolean;
  /** Compact mark + type for nav. Use lockup for large hero placements. */
  variant?: "nav" | "lockup" | "mark";
  className?: string;
};

export function BrandMark({ light = false, variant = "nav", className = "" }: BrandMarkProps) {
  if (variant === "lockup") {
    return (
      <Link href="/" className={`inline-block ${className}`} aria-label="Bit-Barber System">
        <Image
          src={light ? brandAssets.onDark : brandAssets.primary}
          alt="Bit-Barber System"
          width={420}
          height={236}
          className="h-12 w-auto sm:h-14"
          priority
        />
      </Link>
    );
  }

  if (variant === "mark") {
    return (
      <Link href="/" className={`inline-grid ${className}`} aria-label="Bit-Barber System">
        <Image src={brandAssets.mark} alt="" width={72} height={72} className="size-9 rounded-2xl object-cover shadow-soft" />
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Bit-Barber System">
      <Image
        src={brandAssets.mark}
        alt=""
        width={72}
        height={72}
        className="size-9 shrink-0 rounded-2xl object-cover shadow-soft ring-1 ring-black/5"
        priority
      />
      <span className="leading-tight">
        <span className={`block text-lg font-900 tracking-tight ${light ? "text-sky-50" : "text-ink-900"}`}>Bit-Barber</span>
        <span className={`block text-[10px] font-800 uppercase tracking-[0.14em] ${light ? "text-ethiopia-yellow" : "text-ethiopia-green"}`}>
          System
        </span>
      </span>
    </Link>
  );
}
