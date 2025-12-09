import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Link Verse",
  description: "Your personal link page — share everything with one simple URL",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${dmSans.variable} font-sans antialiased bg-[#F7F7F7] min-h-screen`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
