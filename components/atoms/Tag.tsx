export function Tag({ children, className = "" }: { children: string; className?: string }) {
  return (
    <li
      className={`list-none marker:hidden before:hidden after:hidden inline-flex items-center rounded-lg border border-primary/20 bg-primary-soft/80 px-3 py-1 font-sans text-xs font-medium text-primary-soft-ink shadow-xs backdrop-blur-xs transition-colors hover:border-primary/40 dark:border-primary/30 dark:bg-primary-soft/40 dark:text-primary-300 ${className}`}
    >
      {children}
    </li>
  );
}
