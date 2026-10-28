export function Tag({ children }: { children: string }) {
  return (
    <li className="rounded-md bg-ink/[0.07] px-2.5 py-1 text-xs font-medium text-ink-soft">{children}</li>
  );
}
