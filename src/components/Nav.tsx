"use client"

import React, { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { BadgeHelp, Menu, UserCircle, UserPlus, Workflow } from "lucide-react"

import TopNav from "./TopNav"
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
    <div className="hidden lg:block w-64 border-r border-gray-800 h-[110vh]">
      <div className="flex flex-col h-full">
        {user ? (
          <>
            {navItems.map((item) => (
              <div
                key={item.name}
                className="flex flex-col border-b border-gray-800 py-4"
              >
                <div className="font-bold flex flex-col text-lg p-2 text-neutral-500/50">
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
              </div>
            ))}
          </>
        ) : (
          <>
            {noUserNavItems.map((item) => (
              <div
                key={item.name}
                className="flex flex-col border-b border-gray-800 py-4"
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
      <div className="lg:hidden w-16 border-r border-gray-800 h-screen p-4">
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
                    className="flex flex-col border-b border-gray-800 py-4"
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
                    className="flex flex-col border-b border-gray-800 py-4"
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
      <div className="grid grid-cols-12 min-h-screen ">
        <TopNav />

        <div className="ml-8 lg:ml-[265px] mt-16 absolute w-auto">
          {children}
        </div>

        {LargeScreenNav}
        {SmallScreenNav}
      </div>
    </>
  )
}

export default Nav
