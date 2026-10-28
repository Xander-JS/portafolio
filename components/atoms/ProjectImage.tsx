import Image from "next/image";

/** A project screenshot, or a red-tinted placeholder with the project's initial and a note while there is none. */
export function ProjectImage({ src, alt, label, note, sizes }: { src: string; alt: string; label: string; note: string; sizes: string }) {
  if (src) return <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />;
  return (
    <div className="absolute inset-0 bg-primary-600 dark:bg-primary-800">
      <svg viewBox="0 0 160 100" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <path d="M0 0H52L70 72L44 100H0Z" className="fill-primary-700 dark:fill-primary-900" />
        <path d="M58 0H160V44L76 62Z" className="fill-primary-500 dark:fill-primary-700" />
        <circle cx="128" cy="78" r="14" className="fill-primary-300/40" />
        <circle cx="140" cy="78" r="14" className="fill-primary-200/30" />
        <text x="50%" y="58%" textAnchor="middle" className="fill-white/85 text-[34px] font-medium">
          {label.replace(/^TODO:?\s*/, "").charAt(0)}
        </text>
      </svg>
      <span className="absolute bottom-3 left-3 rounded-md bg-primary-950/60 px-2 py-1 text-xs font-medium text-white">{note}</span>
    </div>
  );
}
