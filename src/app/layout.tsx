import type { Metadata } from "next"
import { Inter } from "next/font/google"

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
  // twitter: {
  //   title: "SupaBuddAi: AI-Driven Security Automation for Supabase",
  //   description:
  //     "Streamline your database security protocols with SupaBuddAi - your AI companion in enforcing robust RLS policies and schema validation.",
  //   creator: "@keyrxng",
  // },
}

export default function RootLayout(params: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="min-h-screen">
            {params.children}

            <div className="w-full grow" />
          </main>
          <div className="inset-x-0 bottom-0">
            <footer className="flex justify-between border-gray-800 items-center w-full h-24 border-t">
              <p className="hidden sm:inline-block text-gray-400 text-sm ml-12">
                © {new Date().getFullYear()}{" "}
                <span className="text-[#3ecf95]">SupaBuddAi</span>
              </p>
              <Image
                src="/supabuddai.svg"
                alt="Supabase Logo"
                width={200}
                height={200}
                className="h-12 ml-4"
              />

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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
