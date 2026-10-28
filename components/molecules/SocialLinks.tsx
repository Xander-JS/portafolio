import { Icon } from "@/components/atoms/Icon";
import { profile } from "@/data/profile";

const labels = { facebook: "Facebook", linkedin: "LinkedIn" };

export function SocialLinks({ withEmail = false, className = "" }: { withEmail?: boolean; className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {withEmail && profile.email && (
        <li>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="inline-flex size-11 items-center justify-center rounded-md text-ink-soft transition-colors hover:text-ink">
            <Icon name="mail" className="size-5" />
          </a>
        </li>
      )}
      {profile.socials.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels[s.id]}
            className="inline-flex size-11 items-center justify-center rounded-md text-ink-soft transition-colors hover:text-ink"
          >
            <Icon name={s.id} className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
