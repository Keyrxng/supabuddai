import type { Metadata } from "next"

import { Toaster } from "@/components/ui/sonner"
import Nav from "@/components/Nav"

export const metadata: Metadata = {
  title: "SupaBuddAi",
  description: "A Supabase specific RLS AI security tool",
}

export default function Layout(params: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen">
        <Nav>{params.children}</Nav>
      </div>
      <Toaster />
    </>
  )
}
