import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Caja Valladolid - Créditos Fáciles sin Buró | Tasa Fija 6.9%",
  description:
    "Obtén tu crédito sin revisión de buró de crédito. Tasa fija del 6.9% anual, aprobación rápida y pagos flexibles.",
  keywords: [
    "créditos sin buró",
    "préstamos México",
    "tasa fija 6.9%",
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
      "Tu crédito aprobado sin revisión de buró. Tasa fija 6.9% anual, simulación en línea y acompañamiento profesional.",
    siteName: "Caja Valladolid",
  },
  twitter: {
    card: "summary_large_image",
    title: "Caja Valladolid - Créditos sin Buró",
    description:
      "Obtén tu crédito con tasa fija del 6.9% anual. Sin revisión de buró de crédito.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    // Cambia aquí el favicon por tu logo (logotipo.png)
    icon: [
      { url: "/logotipo.png", type: "image/png" }, // Logo como favicon
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
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
