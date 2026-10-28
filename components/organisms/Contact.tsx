"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Section } from "@/components/atoms/Section";
import { ModuleHeading } from "@/components/molecules/ModuleHeading";
import { SocialLinks } from "@/components/molecules/SocialLinks";
import { profile } from "@/data/profile";

const field =
  "w-full rounded-xl bg-surface px-4 py-3.5 text-lg text-ink ring-1 ring-ink/10 transition-shadow placeholder:text-ink-faint hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-ring";

/** A plain form: sending opens the visitor's email app with the message filled in. */
export function Contact({ summary = false }: { summary?: boolean }) {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const email = profile.email || t("emailMissing");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    const subject = encodeURIComponent(t("subject", { name }));
    // shortcut: mailto has no backend and no delivery check; swap for a form service if you need one.
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(message)}`;
  };

  return (
    <Section id="contact">
      <ModuleHeading id="contact" summary={summary} />
      <div className="grid gap-12 rounded-3xl bg-primary-soft p-6 md:p-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-primary-soft-ink">{t("name")}</span>
            <input name="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-primary-soft-ink">{t("message")}</span>
            <textarea
              name="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              className={`${field} block resize-y`}
            />
          </label>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button type="submit" variant="primary" className="h-12 px-6 text-base">
              {t("send")}
            </Button>
            <p role="status" className="text-sm text-ink-soft">
              {sent && (
                <>
                  <strong className="font-medium text-ink">{t("sentTitle")}</strong> {t("sentBody", { email })}
                </>
              )}
            </p>
          </div>
        </form>

        <div className="flex flex-col gap-8 lg:justify-end">
          <div>
            <p className="text-sm font-medium text-primary-soft-ink">{t("emailLabel")}</p>
            {profile.email ? (
              <a href={`mailto:${profile.email}`} className="mt-1 inline-block text-2xl font-medium tracking-[-0.02em] break-all text-primary-text underline decoration-primary-text/30 underline-offset-4 hover:decoration-current">
                {profile.email}
              </a>
            ) : (
              <p className="mt-1 text-2xl font-medium tracking-[-0.02em] text-ink">{email}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-primary-soft-ink">{t("elsewhere")}</p>
            <SocialLinks className="mt-1 -ml-3" />
          </div>
        </div>
      </div>
    </Section>
  );
}
