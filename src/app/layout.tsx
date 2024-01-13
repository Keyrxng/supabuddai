import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

import "./globals.css"

import Image from "next/image"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SupaBuddAi",
  description:
    "Elevate your Supabase security with SupaBuddAi. Automate, test, and validate your RLS policies and database schema with ease.",
  keywords:
    "Supabase, Security Automation, RLS Testing, Database Schema, Security Tool, AI, ai security, ai database security",
  authors: [
    {
      name: "Keyrxng",
      url: "https://keyrxng.xyz",
    },
  ],
  creator: "Keyrxng",
  twitter: {
    title: "SupaBuddAi: A Supabase Security ChatBot",
    images: [
      {
        url: "https://supabuddai.xyz/supabuddai-logo.png",
        width: 1000,
        height: 1000,
        alt: "SupaBuddAi Logo",
      },
    ],
    description:
      "Automate the testing of your Supabase RLS policies in minutes, not hours.",
    creator: "@keyrxng",
    card: "summary",
  },
}

export default function RootLayout(params: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="min-h-screen" suppressHydrationWarning>
            {params.children}

            <div className="w-full grow" />
          </main>
          <div className="inset-x-0 bottom-0">
            <footer className="flex justify-between border-gray-800 items-center w-full h-24 border-t">
              <p className=" text-gray-400 text-sm ml-12">
                © {new Date().getFullYear()}{" "}
                <span className="text-[#3ecf95]">SupaBuddAi</span>
              </p>

              <div className="text-sm mr-12 text-gray-400">
                Built with 💚 by {"  "}
                <span className="text-[#3ecf95]">
                  <a
                    href="https://twitter.com/keyrxng"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Keyrxng
                  </a>
                </span>
              </div>
            </footer>
          </div>
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
