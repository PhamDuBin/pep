import type { Metadata, Viewport } from "next";
import { Noto_Sans, Noto_Sans_JP, Inter } from "next/font/google";
import "@/shared/styles/globals.scss";

const notoSans = Noto_Sans({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PEP Application",
    template: "%s | PEP",
  },
  description: "PEP Application built with Next.js",
  keywords: ["Next.js", "React", "TypeScript"],
  authors: [{ name: "PEP Team" }],
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${notoSans.variable} ${notoSansJP.variable} ${inter.variable} font-noto`}>
        <div id="app-root">{children}</div>
      </body>
    </html>
  );
}
