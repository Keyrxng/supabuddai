"use client"

import React from "react"
import { Copy } from "lucide-react"
import { toast } from "sonner"

function CopyToClip({ text }: { text: string }) {
  return (
    <Copy
      size={24}
      id="copy"
      className="cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
      }}
    />
  )
}

export default CopyToClip
