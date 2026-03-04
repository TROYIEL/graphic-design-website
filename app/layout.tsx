import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "TEX-TECH",
  description:
    "Designing brands that speak, sell & scale. Expert branding, logo design, and graphics for tech companies.",
  generator: "tex-technologies",
  icons: {
    icon: [
      {
        url: "",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "",
        type: "image/svg+xml",
      },
    ],
    apple: "",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${poppins.className} font-sans antialiased overflow-hidden`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
