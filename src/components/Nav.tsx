"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { BadgeHelp, Menu, UserCircle, UserPlus, Workflow } from "lucide-react"

import { ConnectedBlinker } from "./connectedBlinker"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"

type Props = {
  children: React.ReactNode
}

const noUserNavItems = [
  {
    name: "Sign in",
    href: "/auth/signin",
    icon: UserCircle,
    action: () => {
      console.log("Sign in")
    },
  },
  {
    name: "Sign up",
    href: "/auth/signup",
    icon: UserPlus,
    action: () => {
      console.log("Sign up")
    },
  },
  {
    name: "Help",
    icon: BadgeHelp,
    children: [
      {
        name: "Docs",
        href: "/help/docs",
      },
      {
        name: "Support",
        href: "/help/support",
      },
    ],
    href: "/help",
  },
]

const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})

function Nav({ children }: Props) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("error: ", error)
        return
      }

      setUser(data)

      console.log("data: ", data)
    }
    load()
  }, [])

  const navItems = [
    {
      name: "Projects",
      icon: Workflow,
      children: [
        {
          name: "All projects",
          href: "/projects",
        },
      ],
      href: "/projects",
    },
    {
      name: "Help",
      icon: BadgeHelp,
      children: [
        {
          name: "Docs",
          href: "/help/docs",
        },
        {
          name: "Support",
          href: "/help/support",
        },
      ],
      href: "/help",
    },
  ]

  const LargeScreenNav = (
    <div className="hidden lg:block w-64 border-r h-screen p-4">
      <div className="flex flex-col h-full">
        {user ? (
          <>
            {navItems.map((item) => (
              <div
                key={item.name}
                className="flex flex-col border-b border-border-200 py-4"
              >
                <div className="font-bold text-xl text-neutral-500/50">
                  {item.name}
                </div>
                {item.children?.map((child) => (
                  <a
                    key={child.name}
                    href={child.href}
                    className="ml-4 font-bold text-neutral-500"
                  >
                    {child.name}
                  </a>
                ))}
              </div>
            ))}
          </>
        ) : (
          <>
            {noUserNavItems.map((item) => (
              <div
                key={item.name}
                className="flex flex-col border-b border-border-200 py-4"
              >
                <div className="font-bold text-xl text-neutral-500/50">
                  {item.name}
                </div>
                {item.children?.map((child) => (
                  <a
                    key={child.name}
                    href={child.href}
                    className="ml-4 font-bold text-neutral-500"
                  >
                    {child.name}
                  </a>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )

  const SmallScreenNav = (
    <>
      <div className="lg:hidden w-16 border-r h-screen p-4">
        <Drawer>
          <DrawerTrigger>
            <Menu />
          </DrawerTrigger>
          <DrawerContent className="w-screen px-4 space-x-2">
            <DrawerHeader>
              <DrawerTitle></DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>

            {user ? (
              <>
                {navItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col border-b border-border-200 py-4"
                  >
                    <div className="font-bold text-xl text-neutral-500/50">
                      {item.icon && (
                        <span className="mr-2 flex m-2 gap-4">
                          <item.icon />
                          {item.name}
                        </span>
                      )}
                    </div>
                    {item.children?.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        className="ml-4 font-bold text-neutral-500"
                      >
                        {child.name}
                      </a>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <>
                {noUserNavItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col border-b border-border-200 py-4"
                  >
                    <div className="font-bold text-xl text-neutral-500/50">
                      {item.icon && (
                        <span className="mr-2 flex m-2 gap-4">
                          <item.icon />
                          {item.name}
                        </span>
                      )}
                    </div>
                    {item.children?.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        className="ml-4 font-bold text-neutral-500"
                      >
                        {child.name}
                      </a>
                    ))}
                  </div>
                ))}
              </>
            )}

            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  )

  return (
    <>
      {/* TopNav */}
      <div className="grid grid-cols-12 min-h-screen ">
        <div className="col-span-12 flex items-center sticky w-full justify-between border-b">
          <div className="border-r h-16 lg:w-64 w-16 flex justify-between align-middle text-center">
            <div className="w-full">
              <Image
                src="/supabuddai.svg"
                alt="Logo"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="col-span-12">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {/* <Button className="mr-4">Search</Button>
                        <Button className="mr-4">Notifications</Button>
                        <Button className="mr-4">Settings</Button> */}
                <ConnectedBlinker />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
        {/* Top Nav */}

        <div className="ml-8 lg:ml-[265px] mt-16 absolute w-auto">
          {children}
        </div>

        {/* Side Nav */}
        {LargeScreenNav}
        {SmallScreenNav}
        {/* Side Nav */}
      </div>
    </>
  )
}

export default Nav
