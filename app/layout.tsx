import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/i18n/Providers";
import es from "@/messages/es.json";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: es.meta.title,
  description: es.meta.description,
};

// Runs before first paint: hides the page until React has swapped in a stored English locale.
// Key must match LOCALE_KEY in i18n/Providers.tsx.
const localeScript = `try{if(localStorage.getItem("locale")==="en"){var h=document.documentElement;h.lang="en";h.dataset.localePending=""}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
