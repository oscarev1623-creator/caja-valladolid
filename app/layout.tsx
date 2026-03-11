import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script" // 👈 IMPORTAR SCRIPT
import "./globals.css"

export const metadata: Metadata = {
  title: "Caja Valladolid - Créditos Fáciles sin Buró | Tasa Fija 11%",
  description:
    "Obtén tu crédito sin revisión de buró de crédito. Tasa fija del 11% anual, aprobación rápida y pagos flexibles.",
  keywords: [
    "créditos sin buró",
    "préstamos México",
    "tasa fija 11%",
    "créditos rápidos",
    "financiamiento",
    "Caja Valladolid",
  ],
  authors: [{ name: "Caja Valladolid" }],
  metadataBase: new URL("https://cajavalladolid.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://cajavalladolid.com",
    title: "Caja Valladolid - Créditos Fáciles sin Buró",
    description:
      "Tu crédito aprobado sin revisión de buró. Tasa fija 11% anual, simulación en línea y acompañamiento profesional.",
    siteName: "Caja Valladolid",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caja Valladolid - Créditos sin Buró",
    description:
      "Obtén tu crédito con tasa fija del 11% anual. Sin revisión de buró de crédito.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/logotipo.png", type: "image/png" },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1F8A4B" },
    { media: "(prefers-color-scheme: dark)", color: "#16623A" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* PIXEL DE FACEBOOK */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2190339731374417');
              fbq('track', 'PageView');
            `
          }}
        />
        {/* Fallback para navegadores sin JavaScript */}
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2190339731374417&ev=PageView&noscript=1"
            alt="facebook-pixel"
          />
        </noscript>
      </head>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}