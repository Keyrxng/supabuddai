"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  BadgeHelp,
  Menu,
  MoveRight,
  UserCircle,
  UserPlus,
  Workflow,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { NavigationMenuDemo } from "@/components/NavMenuItems"
import { ThemeToggle } from "@/components/theme-toggle"

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

export default function Page() {
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
  const [hover, setHover] = useState(false)

  const handleGlow = (event) => {
    if (!event.target) return
    if (event.target.accessKey !== "glowElement") return
    const glowElement = event.target
    if (!glowElement) return

    const { x, y, width, height } = glowElement.getBoundingClientRect()
    const center_x = x + width / 2
    const center_y = y + height / 2
    const mouse_x = event.clientX
    const mouse_y = event.clientY

    const deltaX = center_x - mouse_x
    const deltaY = center_y - mouse_y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Adjust these values based on the desired intensity and distance threshold
    const intensity = Math.min(150 / distance, 1)
    const colorIntensity = Math.floor(255 * intensity)

    glowElement.style.boxShadow = `0 0 15px rgba(62, 207, 149, ${intensity})`
    glowElement.style.border = `1px solid rgba(62, 207, 149, ${intensity})`
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    window.addEventListener("mousemove", handleGlow)
    return () => {
      window.removeEventListener("mousemove", handleGlow)
    }
  }, [])

  return (
    <>
      <div className="w-full border-b border-gray-800 h-16 flex justify-between align-middle text-center">
        <div className="container col-span-12 flex items-center sticky w-full inset-0 top-0 justify-between border-gray-800 ">
          <div className="border-gray-800 h-16 lg:w-full align-middle ">
            <div className="w-full flex ">
              <a href="/">
                <Image
                  src="/supabuddai.svg"
                  alt="Logo"
                  width={600}
                  height={600}
                  className={`w-52 pt-2 sm:w-76 sm:pt-2  h-full object-cover`}
                />
              </a>
              <NavigationMenuDemo />
            </div>
          </div>
          <div className="col-span-12 w-max">
            <div className="flex justify-between pt-2 items-center">
              <ThemeToggle />
              <div className="flex gap-2 items-center">
                <div className="sm:hidden">
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-flow-row text-center min-h-screen m-4">
          <article className="col-span-1 m-12 font-light text-center align-middle justify-center object-center items-center">
            <div className="w-fit mx-auto h-min px-2">
              <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                accessKey="glowElement"
                className="cursor-pointer grid rounded-full h-min shadow-md shadow-[#1a1a1a] grid-flow-col-dense gap-2 text-center font-bold my-8 p-1.0 bg-[#313131]"
              >
                <div className="flex items-center  m-[4px] justify-center gap-2 ">
                  <div className="flex p-1  rounded-full border h-fit justify-between text-center text-xs font-medium text-[#3ecf95] border-[#3ecf95]">
                    Coming Soon!
                  </div>
                  <div className="flex  align-middle mr-3 h-min items-center gap-2 text-xs font-medium">
                    Take a look at the MVP{" "}
                    <MoveRight
                      className={`${
                        hover ? "animate-nudge-right" : ""
                      } h-4 w-4 `}
                    />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-7xl text-center from-[#ffffff] to-[#ffffffb4] bg-gradient-to-b bg-clip-text text-transparent">
              SupaBuddAi<span className="text-[#3ecf95]">.</span>
            </h1>

            <h2 className="text-xl mt-1 text-center text-[#3ecf95]">
              Know your data is secured the way you{" "}
              <strike className="text-gray-400/50 ">want</strike>{" "}
              <span className="italic">need</span> it to be.
            </h2>

            <div className="flex flex-col text-center items-center justify-center ">
              <h3 className="text-center max-w-2xl font-medium text-[#ffffffe0]">
                <div className="text-2xl">
                  <p className="text-lg font-medium mt-4">
                    As you define your database, let us fortify it. We aggregate
                    your RLS policies and schema into TypeScript types,
                    transforming them into a robust foundation for your custom
                    AI-driven security framework.
                  </p>

                  <p className="text-sm text-gray-400/50 mt-4">
                    Step into a new era of database security automation.
                    <br />
                    Whether pre-MVP or post-launch,{" "}
                    <span className="italic">we've got you covered.</span>
                  </p>
                </div>
              </h3>
            </div>
            <Button
              className="mt-4 text-lg h-min w-min border-[0.1px] shadow-md drop-shadow-md shadow-[#1a1a1a] border-[#ffffff4b] bg-[#3ecf95]/65 hover:bg-[#3ecf95]/55"
              size="lg"
              accessKey="glowElement"
            >
              Join the waitlist
            </Button>
          </article>

          <div className="transition duration-500 hover:scale-105 my-8 mx-auto max-w-5xl p-6 bg-gradient-to-b from-[#1a1a1a] to-[#313131] rounded-xl shadow-xl">
            <h2 className="text-4xl font-bold text-[#3ecf95] text-center">
              Revolutionize Your Workflow
            </h2>
            <p className="text-gray-300 mt-4 text-center">
              Experience the transformative impact of SupaBuddAi on your
              projects.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div
                accessKey="glowElement"
                className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg"
              >
                <h3 className="text-2xl font-semibold text-white">
                  Maximize Time Efficiency
                </h3>
                <p className="text-gray-300 text-center mt-2">
                  Streamline your security policy testing and schema management
                  with our AI-driven automation, unlocking unprecedented time
                  savings.
                </p>
                <span className="mt-2 text-3xl font-bold text-[#3ecf95]">
                  Up to 75% Faster
                </span>
              </div>
              <div
                accessKey="glowElement"
                className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg"
              >
                <h3 className="text-2xl font-semibold text-white">
                  Dramatic Cost Reduction
                </h3>
                <p className="text-gray-300 text-center mt-2">
                  Dramatically reduce your operational expenses with AI
                  efficiency, making extensive security management a thing of
                  the past.
                </p>
                <span className="mt-2 text-3xl font-bold text-[#3ecf95]">
                  Up to 50% Cheaper
                </span>
              </div>
            </div>
          </div>

          <div className="transition duration-500 hover:scale-105 my-8 mx-auto max-w-6xl p-6 bg-gradient-to-bl from-[#1a1a1a] to-[#313131] rounded-xl shadow-xl">
            <h2 className="text-4xl font-bold text-[#3ecf95] text-center">
              Key Features for the Modern Innovator
            </h2>
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              <div
                accessKey="glowElement"
                className="flex flex-col items-center p-4 bg-[#313131] rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-semibold text-[#3ecf95]">
                  Intuitive AI Analysis
                </h3>
                <p className="text-gray-300 mt-2 text-center">
                  Harness the power of AI to gain actionable insights and
                  streamline your database security, all with minimal effort.
                </p>
              </div>
              <div
                accessKey="glowElement"
                className="flex flex-col items-center p-4 bg-[#313131] rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-semibold text-[#3ecf95]">
                  Effortless Real-Time Monitoring
                </h3>
                <p className="text-gray-300 mt-2 text-center">
                  Enjoy peace of mind with our easy-to-use, real-time monitoring
                  system that keeps your data secure around the clock.
                </p>
              </div>
            </div>
          </div>

          <div className="transition duration-500 hover:scale-105 my-8 mx-auto max-w-6xl p-6 bg-gradient-to-bl from-[#313131] to-[#1a1a1a] rounded-xl shadow-xl">
            <h2 className="text-4xl font-bold text-[#3ecf95] text-center">
              Your Next Game-Changer in Data Security
            </h2>
            <p className="text-gray-300 mt-4 text-center">
              See how SupaBuddAi empowers indie hackers and solopreneurs with
              AI-driven database security, tailor-made for the fast-paced,
              innovative world of startups.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div
                accessKey="glowElement"
                className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg"
              >
                <h3 className="text-2xl font-semibold text-white">
                  Agile Security for Agile Teams
                </h3>
                <p className="text-gray-300 mt-2">
                  Built for the dynamic needs of startups, SupaBuddAi offers
                  rapid, AI-enhanced security solutions that evolve with your
                  business.
                </p>
              </div>
              <div
                accessKey="glowElement"
                className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg"
              >
                <h3 className="text-2xl font-semibold text-white">
                  Streamlined Innovation
                </h3>
                <p className="text-gray-300 mt-2">
                  SupaBuddAi empowers you to focus on what matters most:
                  building your product. Let us handle the security.
                </p>
              </div>
            </div>
          </div>

          <div
            onMouseMove={handleGlow}
            className="my-8 mx-auto max-w-4xl p-4 bg-[#1a1a1a] rounded-lg shadow-lg transition duration-500 hover:scale-105"
            accessKey="glowElement"
          >
            <h2 className="text-3xl font-semibold text-[#3ecf95]">
              Ship Faster with Confidence
            </h2>
            <p className="text-gray-300 mt-2">
              Knowing that your data is secured the way you need it to be, you
              can focus on what matters most.
            </p>
            <div className="mt-4 flex justify-center">
              <Badge className="animate-pulse hover:text-white cursor-default hover:bg-[#3ecf95]/50 bg-[#3ecf95] text-black">
                Speed Boost
              </Badge>
            </div>
          </div>

          <div
            accessKey="glowElement"
            className="my-8 mx-auto max-w-4xl p-4 bg-[#313131] rounded-lg shadow-lg transition duration-500 hover:scale-105"
          >
            <h2 className="text-3xl font-semibold text-[#3ecf95]">
              AI-Driven Security
            </h2>
            <p className="text-gray-300 mt-2">
              Experience unparalleled database protection with AI-driven policy
              testing, custom-tailored to your needs.
            </p>
            <div className="mt-4 flex justify-center">
              <Badge className="animate-pulse hover:text-white cursor-default hover:bg-[#3ecf95]/50 bg-[#3ecf95] text-black">
                Custom AI Models
              </Badge>
            </div>
          </div>

          <div
            accessKey="glowElement"
            className="my-8 mx-auto max-w-4xl p-4 bg-[#1a1a1a] rounded-lg shadow-lg transition duration-500 hover:scale-105"
          >
            <h2 className="text-3xl font-semibold text-[#3ecf95]">
              AI Trained on Your Data
            </h2>
            <p className="text-gray-300 mt-2">
              Your data is unique, and so are your security needs. SupaBuddAi
              learns from your data to create a custom-tailored security
              framework with a deep understanding of your database.
            </p>
            <div className="mt-4 flex justify-center">
              <Badge className="animate-pulse hover:text-white cursor-default hover:bg-[#3ecf95]/50 bg-[#3ecf95] text-black">
                AI Enhanced
              </Badge>
            </div>
          </div>

          <div
            accessKey="glowElement"
            className="my-8 mx-auto max-w-4xl p-4 bg-[#313131] rounded-lg shadow-lg transition duration-500 hover:scale-105"
          >
            <h2 className="text-3xl font-semibold text-[#3ecf95]">
              Intuitive Dashboard
            </h2>
            <p className="text-gray-300 mt-2">
              Navigate through our user-friendly dashboard for real-time
              security insights and control at your fingertips.
            </p>
            <div className="flex justify-center mt-4">
              <ResizablePanelGroup
                direction="horizontal"
                className="w-full h-full rounded-lg shadow-lg transition duration-500 hover:scale-105"
              >
                <ResizablePanel defaultSize={100}>
                  <div className="flex h-[500px] items-center justify-center p-6">
                    <span className="font-semibold">
                      <Image
                        src="/dashboard-preview.jpg"
                        alt="Dashboard Preview"
                        width={600}
                        height={400}
                        className="rounded-lg"
                      />
                    </span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={20}>
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={10}>
                      <div className="flex h-full items-center justify-center p-4">
                        <span className="font-semibold">
                          <Image
                            src="/dashboard-preview.jpg"
                            alt="Dashboard Preview"
                            width={600}
                            height={400}
                            className="rounded-lg"
                          />
                        </span>
                      </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={10}>
                      <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">
                          <Image
                            src="/dashboard-preview.jpg"
                            alt="Dashboard Preview"
                            width={600}
                            height={400}
                            className="rounded-lg"
                          />
                        </span>
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>

              {/* <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                  <Image
                    src="/dashboard-preview.jpg"
                    alt="Dashboard Preview"
                    width={600}
                    height={400}
                    className="rounded-lg"
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                  <Image
                    src="/dashboard-preview.jpg"
                    alt="Dashboard Preview"
                    width={600}
                    height={400}
                    className="rounded-lg"
                  />
                </ResizablePanel>
              </ResizablePanelGroup> */}
            </div>
          </div>

          <div
            className="my-8 mx-auto max-w-4xl p-4 bg-[#1a1a1a] rounded-lg shadow-lg transition duration-500 hover:scale-105"
            accessKey="glowElement"
          >
            <h2 className="text-3xl font-semibold text-[#3ecf95]">
              Signal Over Noise
            </h2>
            <p className="text-gray-300 mt-2">
              SupaBuddAi is designed to be as simple and intuitive as possible,
              fortifying your database with no hassle, no code and no stress.
              Gain a new perspective into your database while securing it at the
              same time.
            </p>
            <div className="flex justify-center mt-4">
              <Button className="hover:animate-pulse hover:text-black bg-[#3ecf95] hover:bg-[#3ecf95]/80">
                Explore Features
              </Button>
            </div>
          </div>

          <div
            className="my-8 mx-auto max-w-4xl p-4 bg-[#313131] rounded-lg shadow-lg transition duration-500 hover:scale-105"
            accessKey="glowElement"
          >
            <h2 className="text-3xl font-semibold text-[#3ecf95]">
              Database Optimization
            </h2>
            <p className="text-gray-300 mt-2">
              With SupaBuddAi, you can optimize your database for performance
              and security all in one place, hassle free.
            </p>
            <div className="mt-4 flex justify-center">
              <Badge className="animate-pulse hover:text-white cursor-default hover:bg-[#3ecf95]/50 bg-[#3ecf95] text-black">
                Performance Boost
              </Badge>
            </div>
          </div>

          <div
            accessKey="glowElement"
            className="my-8 mx-auto max-w-4xl p-4 bg-[#1a1a1a] rounded-lg shadow-lg transition duration-500 hover:scale-105"
          >
            <h2 className="text-3xl font-semibold text-[#3ecf95]">
              Data Visualization
            </h2>
            <p className="text-gray-300 mt-2">
              Visualize your database in real-time with our AI-driven security
              policies, custom-tailored to your needs.
            </p>
            <div className="mt-4 flex justify-center">
              <Badge className="animate-pulse hover:text-white cursor-default hover:bg-[#3ecf95]/50 bg-[#3ecf95] text-black">
                AI Enhanced
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
