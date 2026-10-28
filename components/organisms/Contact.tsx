"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Glass } from "@/components/atoms/Glass";
import { Section } from "@/components/atoms/Section";
import { ShardPanel } from "@/components/molecules/ShardPanel";
import { SocialLinks } from "@/components/molecules/SocialLinks";
import { profile } from "@/data/profile";
import { contactPattern } from "@/lib/shards";

const field = "w-full rounded-xl bg-ink/[0.06] px-4 py-3.5 text-lg text-ink placeholder:text-ink-faint outline-offset-2";

/**
 * The form is written on a pane of glass. Sending breaks the pane (the words fly off on the shards),
 * opens the visitor's email app with the message filled in, and leaves a "Back" sliver to rebuild it.
 */
export function Contact() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const email = profile.email || t("emailMissing");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    requestAnimationFrame(() => backRef.current?.focus({ preventScroll: true }));
    const subject = encodeURIComponent(t("subject", { name }));
    // shortcut: mailto has no backend and no delivery check; swap for a form service if you need one.
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(message)}`;
  };

  const back = () => {
    setSent(false);
    requestAnimationFrame(() => nameRef.current?.focus({ preventScroll: true }));
  };

  const content = (printed: boolean) => (
    <div className="grid h-full gap-12 p-6 md:p-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16 lg:p-16">
      <form onSubmit={submit} className="flex flex-col gap-5">
        {printed ? (
          <p className="text-4xl font-medium tracking-[-0.04em] text-ink md:text-6xl">{t("heading")}</p>
        ) : (
          <h2 id="contact-title" className="text-4xl font-medium tracking-[-0.04em] text-ink md:text-6xl">
            {t("heading")}
          </h2>
        )}
        <p className="max-w-xl text-lg leading-relaxed text-ink-soft">{t("intro")}</p>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-ink-soft">{t("name")}</span>
          {printed ? (
            <span className={`${field} block min-h-[3.75rem]`}>{name}</span>
          ) : (
            <input ref={nameRef} name="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
          )}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-ink-soft">{t("message")}</span>
          {printed ? (
            <span className={`${field} block min-h-[9.5rem] whitespace-pre-wrap break-words ${message ? "" : "text-ink-faint"}`}>
              {message || t("messagePlaceholder")}
            </span>
          ) : (
            // field-sizing keeps the real box as tall as the printed copy (shortcut: Firefox scrolls instead).
            <textarea
              name="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              className={`${field} block min-h-[9.5rem] resize-none [field-sizing:content]`}
            />
          )}
        </label>
        <div>
          <Button type="submit" className="mt-2 h-12 px-6 text-base">
            {t("send")}
          </Button>
        </div>
      </form>

      <div className="flex flex-col justify-end gap-8 lg:pb-2">
        <div>
          <p className="text-sm text-ink-soft">{t("emailLabel")}</p>
          {profile.email ? (
            <a href={`mailto:${profile.email}`} className="mt-1 inline-block text-2xl font-medium tracking-[-0.02em] break-all text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-current">
              {profile.email}
            </a>
          ) : (
            <p className="mt-1 text-2xl font-medium tracking-[-0.02em] text-ink">{email}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-ink-soft">{t("elsewhere")}</p>
          <SocialLinks className="-ml-3 mt-1" />
        </div>
      </div>
    </div>
  );

  const after = (
    <div className="relative flex h-full flex-col justify-center px-6 py-16 md:px-[18%]">
      <Glass
        as="button"
        ref={backRef}
        type="button"
        onClick={back}
        className="back-sliver mb-12 self-start rounded-[14px] px-7 py-4 text-sm font-medium text-ink hover:text-[#b9abff] md:absolute md:top-[12%] md:left-[8%] md:mb-0"
      >
        {t("back")}
      </Glass>
      <p className="text-3xl font-semibold tracking-[-0.022em] text-ink md:text-4xl" role="status">
        {sent ? t("sentTitle") : ""}
      </p>
      <p className="mt-5 max-w-[52ch] text-lg leading-[1.72] text-ink-soft">{t("sentBody", { email })}</p>
    </div>
  );

  return (
    <Section id="contact">
      <ShardPanel pattern={contactPattern} render={content} shattered={sent} after={after} className="min-h-[640px]" />
    </Section>
  );
}
