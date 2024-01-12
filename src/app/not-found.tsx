"use client"

import React, { useEffect } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

function Page({}) {
  const [isClient, setIsClient] = React.useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <div className="grid  items-center justify-center h-screen space-y-4">
      <div className="flex flex-col items-center -space-y-2 ">
        <h1 className="text-3xl font-bold mb-4 text-[#3ecf95]">
          You&apos;re off the beaten track
        </h1>
        <a href="/" className="z-10" rel="noopener noreferrer">
          {isClient && (
            <Button
              size="lg"
              variant="outline"
              className="mt-1 animate-bounce text-lg h-min w-min border-[0.1px] shadow-md drop-shadow-md shadow-[#1a1a1a] border-[#ffffff4b] bg-[#3ecf95]/65 hover:bg-[#3ecf95]/55"
            >
              <span className="">Go Back</span>{" "}
            </Button>
          )}
        </a>{" "}
      </div>
      <Image
        src="/supabuddai-logo.png"
        priority
        quality={100}
        className={`absolute opacity-35 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
        width={1000}
        height={1000}
        alt="SupaBuddAi Logo"
      />{" "}
    </div>
  )
}

export default Page
