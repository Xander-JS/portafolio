export function Tag({ children }: { children: string }) {
  return <li className="rounded-md bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-soft-ink">{children}</li>;
}
