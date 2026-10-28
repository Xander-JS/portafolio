"use client";

import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

export type Locale = "es" | "en";
export const LOCALE_KEY = "locale";
const messages = { es, en };

// The page is static, so the chosen language lives in the browser (localStorage), not in the URL.
let memory: Locale | null = null; // fallback when storage is blocked
const listeners = new Set<() => void>();

function readLocale(): Locale {
  if (memory) return memory;
  try {
    return localStorage.getItem(LOCALE_KEY) === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

export function setLocale(locale: Locale) {
  memory = locale;
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useLocale() {
  return useSyncExternalStore(subscribe, readLocale, () => "es" as Locale);
}

export function Providers({ children }: { children: ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    document.title = messages[locale].meta.title;
    // The inline script in layout hides the page while an English visitor's first render is still Spanish.
    if (locale === readLocale()) delete html.dataset.localePending;
  }, [locale]);

  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="America/Bogota">
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
