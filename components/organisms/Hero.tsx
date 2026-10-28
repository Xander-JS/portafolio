"use client";

import { useTranslations } from "next-intl";
import { Avatar } from "@/components/atoms/Avatar";
import { ButtonLink } from "@/components/atoms/Button";
import { ShardPanel } from "@/components/molecules/ShardPanel";
import { profile } from "@/data/profile";
import { heroPattern } from "@/lib/shards";

export function Hero() {
  const t = useTranslations("hero");

  // Rendered once for real (selectable, clickable) and once per shard as the printed copy.
  const content = (printed: boolean) => {
    const Title = printed ? "p" : "h1";
    return (
      <div className="flex h-full flex-col justify-between p-6 md:p-[4.5%]">
        <div className="flex items-start justify-between gap-6 pt-[8vh] md:pt-[10%]">
          <div className="max-w-5xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft md:text-xs">{t("eyebrow")}</p>
            <Title className="mt-5 bg-gradient-to-b from-ink to-ink/75 bg-clip-text text-[clamp(2.75rem,7.8vw,8.5rem)] leading-[0.97] font-medium tracking-[-0.045em] text-transparent">
              {profile.name}
            </Title>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70 md:text-xl">{t("tagline")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <ButtonLink href="#projects">{t("viewProjects")}</ButtonLink>
              <ButtonLink href="#contact" variant="link">
                {t("contact")}
              </ButtonLink>
            </div>
          </div>
          {profile.photo && (
            <div className="hidden shrink-0 lg:block">
              <Avatar name={profile.name} photo={profile.photo} alt={t("photoAlt", { name: profile.name })} size={180} />
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-between gap-2 pt-10 text-[11px] text-ink-faint md:text-xs">
          <span>© {profile.name}</span>
          <span>{t("location", { city: profile.city })}</span>
        </div>
      </div>
    );
  };

  return (
    <section id="top" className="px-4 pt-3 pb-4 md:px-[5.5vw] md:pt-4">
      <ShardPanel pattern={heroPattern} render={content} enter className="h-[calc(100svh-5.5rem)] min-h-[560px] md:h-[calc(100svh-6.5rem)]" />
    </section>
  );
}
