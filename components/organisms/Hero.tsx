"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/atoms/Avatar";
import { ButtonLink } from "@/components/atoms/Button";
import { ShardPanel } from "@/components/molecules/ShardPanel";
import { profile } from "@/data/profile";
import { cvUrl } from "@/data/site";
import { heroPattern } from "@/lib/shards";

export function Hero() {
  const t = useTranslations("hero");
  const photoAlt = t("photoAlt", { name: profile.name });

  // Rendered once for real (selectable, clickable) and once per shard as the printed copy.
  const content = (printed: boolean) => {
    const Title = printed ? "p" : "h1";
    return (
      <div className="flex h-full flex-col justify-between p-6 md:p-[4.5%]">
        <div className="flex items-center justify-between gap-10 pt-[6vh] md:pt-[6%]">
          <div className="max-w-5xl">
            {profile.photo && (
              <div className="mb-6 lg:hidden">
                <Avatar name={profile.name} photo={profile.photo} alt={photoAlt} size={88} />
              </div>
            )}
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft md:text-xs">{t("eyebrow")}</p>
            <Title className="mt-5 bg-gradient-to-b from-ink to-ink/75 bg-clip-text text-[clamp(2.75rem,5.6vw,6.5rem)] leading-[0.97] font-medium tracking-[-0.045em] text-transparent">
              {profile.name}
            </Title>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70 md:text-xl">{t("tagline")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
              {cvUrl && (
                <ButtonLink variant="primary" href={cvUrl} target="_blank" rel="noopener noreferrer" hrefLang="es">
                  <Download className="size-4" aria-hidden />
                  {t("downloadCv")}
                </ButtonLink>
              )}
              <ButtonLink href="#projects">{t("viewProjects")}</ButtonLink>
              <ButtonLink href="#contact" variant="link" className="px-2">
                {t("contact")}
              </ButtonLink>
            </div>
          </div>
          {profile.photo && (
            // The photo is the hero's main visual on wide screens.
            <div className="relative hidden aspect-[4/5] w-[clamp(240px,26vw,400px)] shrink-0 overflow-hidden rounded-[20px] bg-primary-soft lg:block">
              <Image src={profile.photo} alt={printed ? "" : photoAlt} fill sizes="26vw" className="object-cover" />
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
      <ShardPanel pattern={heroPattern} render={content} enter className="h-[calc(100svh-5.5rem)] min-h-[620px] md:h-[calc(100svh-6.5rem)]" />
    </section>
  );
}
