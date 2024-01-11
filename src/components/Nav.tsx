"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import router from "next/router"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format, parseISO } from "date-fns"
import {
  BadgeHelp,
  CreditCard,
  Github,
  LifeBuoy,
  LogOut,
  Menu,
  MoveRight,
  Settings,
  User,
  UserCircle,
  UserPlus,
  Workflow,
} from "lucide-react"
import { toast } from "sonner"

import LoadingLogo from "./LoadingLogo"
import TopNav from "./TopNav"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
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
  const [projects, setProjects] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("error: ", error)
        return
      }

      setUser(data.session?.user)

      const { data: userProjects, error: projectsError } = await supabase
        .from("user_projects")
        .select("*")
        .eq("user_id", data.session?.user?.id)

      setProjects(userProjects)
    }
    load()
  }, [])

  const ListItems = [
    {
      name: "My Account",
      icon: User,
      children: [
        {
          name: "Profile",
          icon: User,
          href: "/account/profile",
          action: () => {
            router.push("/account/profile")
          },
        },
        {
          name: "Billing",
          icon: CreditCard,
          href: "/account/billing",
          action: () => {
            router.push("/account/billing")
          },
        },
        {
          name: "View all projects",
          href: "/projects",
          action: () => {
            router.push("/projects")
          },
        },
        {
          name: "Create new project",
          href: "/projects/create-new-project",
          action: () => {
            router.push("/projects/create-new-project")
          },
        },
      ],
    },

    {
      name: "Help",
      icon: BadgeHelp,
      children: [
        {
          name: "Support",
          icon: LifeBuoy,
          href: "/support",
          action: () => {
            router.push("/support")
          },
        },
        {
          name: "Settings",
          icon: Settings,
          href: "/account/settings",
          action: () => {
            router.push("/account/settings")
          },
        },
        {
          name: "Log out",
          icon: LogOut,
          action: () => {
            toast.promise(supabase.auth.signOut(), {
              loading: "The page will reload once you are logged out.",
              success: (df) => {
                window.location.href = window.location.href
                return "You have been logged out."
              },
              error: (err) => {
                return `An error occurred: ${err.toString()}`
              },
            })
          },
        },
      ],
    },
  ]

  const LargeScreenNav = (
    <div className="hidden lg:block w-64 border-r border-gray-800 h-[110vh]">
      <div className="flex flex-col h-full">
        {user ? (
          <>
            {ListItems.map((item) => (
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

  const CardComp = ({ project }: { project: any }) => {
    const [hover, setHover] = useState(false)

    return (
      <Card
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() =>
          window.location.replace(
            `/projects/${project?.db_name.replace(/\s/g, "-")}`
          )
        }
        className={`${
          hover ? " bg-gray-800/25" : " bg-accent-foreground"
        }  grid gap-4 text-left col-span-2 my-2 w-96 cursor-pointer`}
      >
        <CardHeader>
          <div className="flex flex-row justify-between">
            <CardTitle>{project?.db_name}</CardTitle>
            <MoveRight
              id="arrowRight"
              size={16}
              className={`top-1/2 hidden lg:block ${
                hover ? "animate-move-right-fixed" : ""
              }`}
            />
          </div>
          <CardDescription className="text-xs font-light grid grid-cols-2 justify-between gap-1 text-muted">
            <Badge className="bg-gray-500/50 text-white font-light text-xs text-muted">
              {project?.db_ref}
            </Badge>
            <div className="text-right w-full flex justify-end">
              <Badge className="bg-gray-500/50 text-white text-xs font-light right-0 flex justify-end text-muted">
                {project?.updated_at
                  ? format(parseISO(project?.updated_at), "PP")
                  : "N/A"}
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="container flex flex-row">
          <ul className="flex flex-row gap-4">
            <li className="text-sm text-muted">
              <Badge className="bg-green-500 text-white">Working</Badge>
            </li>
            <li className="text-sm text-muted">
              <Badge className="bg-green-500 text-white">Working</Badge>
            </li>
            <li className="text-sm text-muted">
              <Badge className="bg-green-500 text-white">Working</Badge>
            </li>
          </ul>
        </CardContent>
      </Card>
    )
  }

  const SmallScreenNav = (
    <>
      <div className="lg:hidden w-16 border-r border-gray-800 h-screen p-4">
        <Drawer>
          <DrawerTrigger>
            <Menu />
          </DrawerTrigger>
          <DrawerContent className="w-screen px-4 space-x-2">
            <DrawerHeader>
              <DrawerTitle className="grid grid-cols-1">
                <Image
                  src="/SupaBuddAi.svg"
                  alt="Logo"
                  width={600}
                  height={600}
                  className="w-full h-full object-contain"
                />
              </DrawerTitle>
              <DrawerDescription className="relative">
                {/* <LoadingLogo className="opacity-5 -z-10 absolute justify-center align-middle object-contain" /> */}
                <Image
                  src="/supabuddai-logo.png"
                  alt="Logo"
                  width={600}
                  height={600}
                  className="opacity-5 absolute justify-center align-middle object-contain"
                />
              </DrawerDescription>
            </DrawerHeader>

            {user ? (
              <>
                {projects && projects.length > 0 && (
                  <>
                    <ul className="[&>:children:not(:last-child)]:mb-4 [&>:nth-last-child(1)]:mb-8 border-b border-gray-800">
                      {projects.slice(0, 3).map((project) => (
                        <li key={project?.db_name}>
                          <CardComp project={project} />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {ListItems.map((item) => (
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
              <DrawerClose>
                <Button variant="outline">Close</Button>
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
