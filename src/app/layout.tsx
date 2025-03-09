import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URL Shortener - Perpendek URL dengan Mudah",
  description: "Layanan pemendek URL modern dengan fitur pelacakan klik, kustomisasi link, dan manajemen URL yang lengkap. Gratis, aman, dan mudah digunakan.",
  keywords: "url shortener, pemendek url, short link, custom url, link management, tracking link",
  authors: [{ name: "Bima Dev", url: "https://github.com/bimadevs" }],
  creator: "Bima Dev",
  publisher: "Bima Dev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://url.bimadev.xyz',
  },
  openGraph: {
    type: 'website',
    url: 'https://url.bimadev.xyz',
    title: 'URL Shortener - Perpendek URL dengan Mudah',
    description: 'Layanan pemendek URL modern dengan fitur pelacakan klik, kustomisasi link, dan manajemen URL yang lengkap. Gratis, aman, dan mudah digunakan.',
    siteName: 'URL Shortener',
    images: [{
      url: '/preview.png',
      width: 1200,
      height: 630,
      alt: 'URL Shortener Preview'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Shortener - Perpendek URL dengan Mudah',
    description: 'Layanan pemendek URL modern dengan fitur pelacakan klik, kustomisasi link, dan manajemen URL yang lengkap.',
    images: ['/preview.png'],
    creator: '@bimadevs',
    creatorId: '@bimadevs',
  },
  category: 'technology',
  classification: 'URL Shortener Service',
  metadataBase: new URL('https://url.bimadev.xyz'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${jakarta.className} min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 text-foreground antialiased selection:bg-purple-500/30`}>
        <div className="min-h-screen backdrop-blur-3xl bg-black/30">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
