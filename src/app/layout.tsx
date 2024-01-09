import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

import { Toaster } from "@/components/ui/sonner"
import Nav from "@/components/Nav"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SupaBuddAi",
  description: "A Supabase specific RLS AI security tool",
}

export default function RootLayout(params: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="min-h-screen">
            <Nav>{params.children}</Nav>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
