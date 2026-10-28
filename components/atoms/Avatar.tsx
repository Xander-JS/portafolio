import Image from "next/image";

/** A photo, or the person's initials when there is none. */
export function Avatar({ name, photo, alt, size }: { name: string; photo: string; alt: string; size: number }) {
  if (photo) {
    return <Image src={photo} alt={alt} width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  const initials = name
    .replace(/\[|\]|TODO/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-medium text-primary-soft-ink"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials || "?"}
    </span>
  );
}
