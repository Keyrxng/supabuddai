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
} from "lucide-react"
import { toast } from "sonner"

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

      // @ts-ignore
      setUser(data.session?.user)

      const { data: userProjects, error: projectsError } = await supabase
        .from("user_projects")
        .select("*")
        .eq("user_id", data.session?.user?.id)

      // @ts-ignore
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
              <Badge className="border-[#3ecf95] bg-[#3ecf95] text-black">
                Planning
              </Badge>
            </li>
            <li className="text-sm text-muted">
              <Badge className="border-[#3ecf95] bg-[#3ecf95] text-black">
                Generation
              </Badge>
            </li>
            <li className="text-sm text-muted">
              <Badge className="border-[#3ecf95] text-white">Execution</Badge>
            </li>
          </ul>
        </CardContent>
      </Card>
    )
  }
  const LogoSvg = () => (
    <svg
      width="495.74375px"
      height="124.39999999999999px"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="2.1281250000000114 12.800000000000004 495.74375 124.39999999999999"
      style={{ background: `rgba(5, 17, 3, 0)` }}
      preserveAspectRatio="xMidYMid"
      className="h-14 w-min mx-auto"
    >
      <defs>
        <linearGradient
          id="editing-glowing-gradient"
          x1="0.8146601955249186"
          x2="0.18533980447508142"
          y1="0.8885729807284856"
          y2="0.11142701927151444"
        >
          <stop offset="0" stopColor="#67ff43"></stop>
          <stop offset="1" stopColor="#90ffff"></stop>
        </linearGradient>
        <filter
          id="editing-glowing"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur
            in="SourceGraphic"
            result="blur"
            stdDeviation="10"
          ></feGaussianBlur>
          <feMerge>
            <feMergeNode in="blur"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#editing-glowing)">
        <g transform="translate(75.82498598098755, 103.89500427246094)">
          <path
            d="M21.38-18.69L21.38-18.69L12.22-20.99L12.22-20.99Q7.55-22.14 5.54-25.12L5.54-25.12L5.54-25.12Q3.52-28.10 3.52-33.28L3.52-33.28L3.52-33.28Q3.52-37.12 4.32-39.46L4.32-39.46L4.32-39.46Q5.12-41.79 7.07-42.98L7.07-42.98L7.07-42.98Q9.02-44.16 11.42-44.54L11.42-44.54L11.42-44.54Q13.82-44.93 17.86-44.93L17.86-44.93L17.86-44.93Q25.66-44.80 30.98-43.65L30.98-43.65L30.59-39.55L30.59-39.55Q24.38-39.87 18.11-39.87L18.11-39.87L18.11-39.87Q15.30-39.87 13.95-39.74L13.95-39.74L13.95-39.74Q12.61-39.62 11.33-38.98L11.33-38.98L11.33-38.98Q10.05-38.34 9.63-36.96L9.63-36.96L9.63-36.96Q9.22-35.58 9.22-33.15L9.22-33.15L9.22-33.15Q9.22-29.63 10.46-28.16L10.46-28.16L10.46-28.16Q11.71-26.69 14.78-25.92L14.78-25.92L23.74-23.68L23.74-23.68Q28.67-22.46 30.66-19.52L30.66-19.52L30.66-19.52Q32.64-16.58 32.64-11.26L32.64-11.26L32.64-11.26Q32.64-3.97 29.34-1.60L29.34-1.60L29.34-1.60Q26.05 0.77 17.86 0.77L17.86 0.77L17.86 0.77Q10.88 0.77 4.16-0.45L4.16-0.45L4.54-4.61L4.54-4.61Q15.30-4.22 18.05-4.29L18.05-4.29L18.05-4.29Q23.30-4.29 25.12-5.63L25.12-5.63L25.12-5.63Q26.94-6.98 26.94-11.39L26.94-11.39L26.94-11.39Q26.94-15.04 25.70-16.48L25.70-16.48L25.70-16.48Q24.45-17.92 21.38-18.69ZM61.95-31.17L67.39-31.17L67.39 0L63.04 0L62.66-4.48L62.66-4.48Q55.62 0.83 49.22 0.83L49.22 0.83L49.22 0.83Q40.70 0.83 40.70-7.74L40.70-7.74L40.70-31.17L46.14-31.17L46.14-9.28L46.14-9.28Q46.08-6.34 47.23-5.12L47.23-5.12L47.23-5.12Q48.38-3.90 51.07-3.90L51.07-3.90L51.07-3.90Q53.44-3.90 55.87-4.96L55.87-4.96L55.87-4.96Q58.30-6.02 61.95-8.38L61.95-8.38L61.95-31.17ZM77.38-31.17L81.86-31.17L82.30-26.18L82.30-26.18Q84.80-28.86 88.32-30.40L88.32-30.40L88.32-30.40Q91.84-31.94 95.23-31.94L95.23-31.94L95.23-31.94Q100.80-31.94 103.36-27.84L103.36-27.84L103.36-27.84Q105.92-23.74 105.92-15.42L105.92-15.42L105.92-15.42Q105.92-6.59 103.10-2.91L103.10-2.91L103.10-2.91Q100.29 0.77 94.14 0.77L94.14 0.77L94.14 0.77Q88.00 0.77 82.62-2.43L82.62-2.43L82.62-2.43Q82.82-0.26 82.82 3.84L82.82 3.84L82.82 12.86L77.38 12.86L77.38-31.17ZM82.82-22.40L82.82-22.40L82.82-5.89L82.82-5.89Q89.34-3.97 92.80-3.97L92.80-3.97L92.80-3.97Q97.02-3.97 98.69-6.34L98.69-6.34L98.69-6.34Q100.35-8.70 100.35-15.42L100.35-15.42L100.35-15.42Q100.35-21.95 98.78-24.58L98.78-24.58L98.78-24.58Q97.22-27.20 93.44-27.20L93.44-27.20L93.44-27.20Q91.01-27.20 88.61-26.08L88.61-26.08L88.61-26.08Q86.21-24.96 82.82-22.40ZM114.69-26.50L114.69-26.50L114.18-30.53L114.18-30.53Q122.75-31.94 129.22-31.94L129.22-31.94L129.22-31.94Q134.66-31.94 137.28-29.66L137.28-29.66L137.28-29.66Q139.90-27.39 139.90-21.95L139.90-21.95L139.90 0L135.62 0L134.98-5.12L134.98-5.12Q132.74-2.88 129.38-1.15L129.38-1.15L129.38-1.15Q126.02 0.58 122.11 0.58L122.11 0.58L122.11 0.58Q117.82 0.58 115.30-1.70L115.30-1.70L115.30-1.70Q112.77-3.97 112.77-8.13L112.77-8.13L112.77-11.52L112.77-11.52Q112.77-15.17 115.04-17.18L115.04-17.18L115.04-17.18Q117.31-19.20 121.41-19.20L121.41-19.20L134.40-19.20L134.40-21.95L134.40-21.95Q134.40-24.90 133.06-26.11L133.06-26.11L133.06-26.11Q131.71-27.33 128.06-27.33L128.06-27.33L128.06-27.33Q123.46-27.33 114.69-26.50ZM118.34-10.75L118.34-10.75L118.34-8.77L118.34-8.77Q118.34-6.34 119.49-5.22L119.49-5.22L119.49-5.22Q120.64-4.10 123.20-4.10L123.20-4.10L123.20-4.10Q125.63-4.03 128.74-5.25L128.74-5.25L128.74-5.25Q131.84-6.46 134.40-8.77L134.40-8.77L134.40-15.04L122.37-15.04L122.37-15.04Q120.19-14.98 119.26-13.89L119.26-13.89L119.26-13.89Q118.34-12.80 118.34-10.75ZM171.78-23.04L171.78-23.04L171.78-22.78L171.78-22.78Q176.58-22.34 178.59-19.42L178.59-19.42L178.59-19.42Q180.61-16.51 180.61-11.01L180.61-11.01L180.61-11.01Q180.61-4.35 177.47-1.92L177.47-1.92L177.47-1.92Q174.34 0.51 166.53 0.51L166.53 0.51L166.53 0.51Q155.90 0.51 150.21 0L150.21 0L150.21-44.16L150.21-44.16Q155.26-44.67 164.54-44.67L164.54-44.67L164.54-44.67Q172.80-44.67 176.03-42.27L176.03-42.27L176.03-42.27Q179.26-39.87 179.26-33.15L179.26-33.15L179.26-33.15Q179.26-28.35 177.47-25.89L177.47-25.89L177.47-25.89Q175.68-23.42 171.78-23.04ZM155.71-39.87L155.71-25.02L165.18-25.02L165.18-25.02Q170.11-25.09 171.97-26.62L171.97-26.62L171.97-26.62Q173.82-28.16 173.82-32.51L173.82-32.51L173.82-32.51Q173.82-36.93 171.81-38.40L171.81-38.40L171.81-38.40Q169.79-39.87 164.29-39.87L164.29-39.87L155.71-39.87ZM165.25-20.74L155.71-20.74L155.71-4.35L155.71-4.35Q158.34-4.29 165.63-4.29L165.63-4.29L165.63-4.29Q171.01-4.29 172.96-5.82L172.96-5.82L172.96-5.82Q174.91-7.36 174.91-11.97L174.91-11.97L174.91-11.97Q174.91-17.02 172.83-18.82L172.83-18.82L172.83-18.82Q170.75-20.61 165.25-20.74L165.25-20.74ZM210.37-31.17L215.81-31.17L215.81 0L211.46 0L211.07-4.48L211.07-4.48Q204.03 0.83 197.63 0.83L197.63 0.83L197.63 0.83Q189.12 0.83 189.12-7.74L189.12-7.74L189.12-31.17L194.56-31.17L194.56-9.28L194.56-9.28Q194.50-6.34 195.65-5.12L195.65-5.12L195.65-5.12Q196.80-3.90 199.49-3.90L199.49-3.90L199.49-3.90Q201.86-3.90 204.29-4.96L204.29-4.96L204.29-4.96Q206.72-6.02 210.37-8.38L210.37-8.38L210.37-31.17ZM246.98-44.80L252.42-44.80L252.42 0L248.19 0L247.68-4.48L247.68-4.48Q241.73 0.77 235.33 0.77L235.33 0.77L235.33 0.77Q229.57 0.77 226.98-3.30L226.98-3.30L226.98-3.30Q224.38-7.36 224.38-15.68L224.38-15.68L224.38-15.68Q224.38-24.58 227.20-28.26L227.20-28.26L227.20-28.26Q230.02-31.94 236.16-31.94L236.16-31.94L236.16-31.94Q242.24-31.94 247.23-29.06L247.23-29.06L247.23-29.06Q246.98-31.87 246.98-35.20L246.98-35.20L246.98-44.80ZM246.98-8.26L246.98-8.26L246.98-25.47L246.98-25.47Q240.83-27.20 237.44-27.20L237.44-27.20L237.44-27.20Q233.28-27.20 231.62-24.83L231.62-24.83L231.62-24.83Q229.95-22.46 229.95-15.74L229.95-15.74L229.95-15.74Q229.95-9.02 231.58-6.50L231.58-6.50L231.58-6.50Q233.22-3.97 237.12-3.97L237.12-3.97L237.12-3.97Q239.55-3.97 241.54-4.90L241.54-4.90L241.54-4.90Q243.52-5.82 246.98-8.26ZM283.65-44.80L289.09-44.80L289.09 0L284.86 0L284.35-4.48L284.35-4.48Q278.40 0.77 272.00 0.77L272.00 0.77L272.00 0.77Q266.24 0.77 263.65-3.30L263.65-3.30L263.65-3.30Q261.06-7.36 261.06-15.68L261.06-15.68L261.06-15.68Q261.06-24.58 263.87-28.26L263.87-28.26L263.87-28.26Q266.69-31.94 272.83-31.94L272.83-31.94L272.83-31.94Q278.91-31.94 283.90-29.06L283.90-29.06L283.90-29.06Q283.65-31.87 283.65-35.20L283.65-35.20L283.65-44.80ZM283.65-8.26L283.65-8.26L283.65-25.47L283.65-25.47Q277.50-27.20 274.11-27.20L274.11-27.20L274.11-27.20Q269.95-27.20 268.29-24.83L268.29-24.83L268.29-24.83Q266.62-22.46 266.62-15.74L266.62-15.74L266.62-15.74Q266.62-9.02 268.26-6.50L268.26-6.50L268.26-6.50Q269.89-3.97 273.79-3.97L273.79-3.97L273.79-3.97Q276.22-3.97 278.21-4.90L278.21-4.90L278.21-4.90Q280.19-5.82 283.65-8.26ZM327.49 0L323.14-13.82L304.96-13.82L300.61 0L294.78 0L308.99-42.62L308.99-42.62Q309.38-44.16 311.10-44.16L311.10-44.16L316.99-44.16L316.99-44.16Q318.72-44.16 319.10-42.62L319.10-42.62L333.31 0L327.49 0ZM306.50-18.69L321.60-18.69L316.03-36.22L316.03-36.22Q315.46-37.89 314.94-39.81L314.94-39.81L313.15-39.81L312.06-36.22L306.50-18.69ZM340.61-44.42L340.61-44.42L343.17-44.42L343.17-44.42Q344.83-44.42 344.83-42.75L344.83-42.75L344.83-39.10L344.83-39.10Q344.83-37.44 343.17-37.44L343.17-37.44L340.61-37.44L340.61-37.44Q338.94-37.44 338.94-39.10L338.94-39.10L338.94-42.75L338.94-42.75Q338.94-44.42 340.61-44.42ZM344.58-31.17L344.58 0L339.20 0L339.20-31.17L344.58-31.17Z"
            fill="url(#editing-glowing-gradient)"
          ></path>
        </g>
      </g>
    </svg>
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
              <DrawerTitle className="grid grid-cols-1">
                <LogoSvg />
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
                      {projects
                        .slice(0, 3)
                        .reverse()
                        .map((project) => (
                          <li
                            // @ts-ignore
                            key={project?.db_name}
                          >
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
                <Button suppressHydrationWarning variant="outline">
                  Close
                </Button>
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
