"use client"

import React from "react"
import Image from "next/image"

import { ConnectedBlinker } from "./ConnectedBlinker"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"

function TopNav() {
  return (
    <div className="col-span-12 flex items-center sticky w-full justify-between border-gray-800 border-b">
      <div className="border-r border-gray-800 h-16 lg:w-64 w-16 flex justify-between align-middle text-center">
        <div className="w-full">
          <a href="/">
            <Image
              src="/supabuddai.svg"
              alt="Logo"
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </a>
        </div>
      </div>
      <div className="col-span-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button className="mr-4">Search</Button>
            <Button className="mr-4">Notifications</Button>
            <ConnectedBlinker />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNav
