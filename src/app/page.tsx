"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import router from "next/router"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  BadgeHelp,
  CreditCard,
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

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
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
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import NavLogo from "@/components/NavLogo"
import { NavigationMenuDemo } from "@/components/NavMenuItems"

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
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("error: ", error)
        return
      }

      setUser(data.session?.user)
    }
    load()
  }, [])

  const [hover, setHover] = useState(false)
  const [hidePill, setHidePill] = useState(false)

  const handleGlow = (event: any) => {
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

    const intensity = Math.min(150 / distance, 1)

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

  const joinWaitlist = async (email: any, name: any) => {
    const { data, error } = await supabase.from("waitlist").insert({
      email: email,
      name: name,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("You've been added to the waitlist!")
    }
  }

  return (
    <>
      <div className="w-full border-b border-gray-800 h-16 flex justify-center justify-items-center align-middle text-center">
        <div className="col-span-12 flex items-center w-full text-center align-middle  inset-0 top-0 justify-between border-gray-800 ">
          <div className="h-16 w-full flex align-middle self-center items-center">
            <div className="">
              <a href="/">
                <Image
                  src="/supabuddai.svg"
                  alt="Logo"
                  width={600}
                  height={600}
                  className={`hidden sm:inline-block w-52 sm:w-76 m-0.5 h-full object-cover`}
                />
                <Image
                  src="/supabuddai-logo.png"
                  alt="Logo"
                  width={160}
                  height={160}
                  className={`pt-1 h-14 sm:hidden object-contain min-w-fit`}
                />
              </a>
            </div>
            <div
              onMouseEnter={() => setHidePill(true)}
              onMouseLeave={() => setHidePill(false)}
            >
              <NavigationMenuDemo />
            </div>
          </div>
          <div className="col-span-12 w-max">
            <div className="flex justify-between pt-2 items-center">
              <div className="flex gap-2 items-center">
                <div className="sm:hidden mr-2.5">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-flow-row text-center min-h-screen m-4 ease-in repeat-1 transition-all duration-1000 animate-in animate-fade-in slide-in-from-bottom-12">
          <div>
            <article className="col-span-1 font-light text-center align-middle justify-center object-center items-center">
              <div
                className={`${
                  hidePill ? "" : "relative z-10"
                } w-fit mx-auto h-min px-2  `}
              >
                <a href="#mvp">
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
                </a>
              </div>
              <h1 className="text-5xl sm:text-7xl text-center from-[#ffffff] to-[#ffffffb4] bg-gradient-to-b bg-clip-text text-transparent">
                SupaBuddAi<span className="text-[#3ecf95]">.</span>
              </h1>

              <h2 className="text-xl mt-1 text-center text-[#3ecf95]">
                Know your data is secured the way you{" "}
                <span className="text-gray-400/50 line-through">want</span>{" "}
                <span className="italic">need</span> it to be.
              </h2>

              <div className="flex flex-col text-center items-center justify-center ">
                <h3 className="text-center max-w-2xl font-medium text-[#ffffffe0]">
                  <div className="text-2xl">
                    <p className="text-lg font-medium mt-4">
                      As you define your database, let us fortify it. We
                      aggregate your RLS policies and schema into TypeScript
                      types, transforming them into a robust foundation for your
                      custom AI-driven security framework.
                    </p>

                    <p className="text-sm text-gray-400/90 mt-4">
                      Step into a new era of database security automation.
                      <br />
                      Whether pre-MVP or post-launch,{" "}
                      <span className="italic">
                        we&apos;ve got you covered.
                      </span>
                    </p>
                  </div>
                </h3>
              </div>

              <Sheet>
                <SheetTrigger>
                  <Button
                    size="lg"
                    accessKey="glowElement"
                    className="mt-4 z-10 relative text-lg h-min w-min border-[0.1px] shadow-md drop-shadow-md shadow-[#1a1a1a] border-[#ffffff4b] bg-[#3ecf95]/65 hover:bg-[#3ecf95]/55"
                  >
                    Join the waitlist
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full mr-9 ">
                  <SheetHeader className="ml-3">
                    <SheetTitle className="flex flex-col items-center">
                      <div className="flex items-center justify-center">
                        <Image
                          src="/supabuddai-logo.png"
                          alt="Logo"
                          width={600}
                          height={600}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <h2 className="text-2xl font-semibold text-[#3ecf95]">
                        Thanks for your interest!
                      </h2>
                    </SheetTitle>
                    <SheetDescription>
                      <div className="flex flex-col text-center items-center">
                        <p className="text-gray-300 mt-2">
                          Launch is expected in the next few weeks and
                          we&apos;ll be sending out invites soon.
                        </p>
                      </div>
                    </SheetDescription>
                    <form
                      className="flex flex-col items-center gap-3"
                      onSubmit={(e) => {
                        e.preventDefault()
                        // @ts-ignore
                        const { email, name } = e.target.elements
                        joinWaitlist(email.value, name.value)
                      }}
                    >
                      <Input
                        type="text"
                        id="name"
                        html-for="name"
                        placeholder="Preferred Name"
                      />
                      <Input
                        type="email"
                        id="email"
                        html-for="email"
                        placeholder="Email Address"
                      />
                      <Button
                        type="submit"
                        className="shadow-[#1a1a1a] border-[#ffffff4b] bg-[#3ecf95]/65 hover:bg-[#3ecf95]/55"
                      >
                        Register Interest
                      </Button>
                    </form>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </article>

            <NavLogo className="h-min inset-0 mt-[5rem] absolute mx-auto grid opacity-20 justify-center items-center" />
          </div>
          <div
            onMouseMove={handleGlow}
            className="my-8 mx-auto max-w-4xl p-4 cursor-default bg-[#1a1a1a] rounded-lg shadow-lg transition duration-500 hover:scale-105"
            accessKey="glowElement"
          >
            <h2 className="text-3xl font-semibold text-[#3ecf95]">
              Ship Faster with Confidence
            </h2>
            <p className="text-gray-300 mt-2">
              Knowing that your data is secured the way you need it to be, so
              you can focus on what matters most.
            </p>
            <div className="mt-4 flex justify-center">
              <Badge className="animate-pulse hover:text-white cursor-default hover:bg-[#3ecf95]/50 bg-[#3ecf95] text-black">
                Speed & Security
              </Badge>
            </div>
          </div>

          <div
            accessKey="glowElement"
            className="my-8 mx-auto max-w-4xl p-4 cursor-default bg-[#313131] rounded-lg shadow-lg transition duration-500 hover:scale-105"
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
                AI Security
              </Badge>
            </div>
          </div>

          <div
            accessKey="glowElement"
            className="my-8 mx-auto max-w-4xl p-4 cursor-default bg-[#1a1a1a] rounded-lg shadow-lg transition duration-500 hover:scale-105"
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
                Custom AI
              </Badge>
            </div>
          </div>

          <div
            accessKey="glowElement"
            id="mvp"
            className="my-8 mx-auto max-w-4xl p-4 bg-[#313131] rounded-lg shadow-lg transition duration-500 hover:scale-105"
          >
            <h2 className="text-3xl cursor-default font-semibold text-[#3ecf95]">
              User-Friendly
            </h2>
            <p className="text-gray-300 cursor-default mt-2">
              Navigate through our user-friendly dashboard for real-time
              security insights and control at your fingertips.
            </p>
            <div className="grid md:flex p-6 md:p-0 justify-center mt-4">
              <ResizablePanelGroup
                direction="horizontal"
                className="w-full h-full hidden md:block rounded-lg shadow-lg transition duration-500 hover:scale-105"
              >
                <ResizablePanel defaultSize={50} className="hidden md:block">
                  <div className="flex h-[500px] items-center justify-center p-6">
                    <span className="font-semibold">
                      <Image
                        src="/mobile-menu.png"
                        alt="Dashboard Preview"
                        width={600}
                        height={400}
                        className="rounded-lg"
                      />
                    </span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle className="hidden md:flex" />
                <ResizablePanel defaultSize={75} className="hidden md:block">
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={75}>
                      <div className="flex h-full items-center justify-center p-4">
                        <span className="font-semibold">
                          <Image
                            src="/project-setup.png"
                            alt="Dashboard Preview"
                            width={600}
                            height={400}
                            className="rounded-lg"
                          />
                        </span>
                      </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle className="hidden md:flex" />
                    <ResizablePanel defaultSize={25}>
                      <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">
                          <Image
                            src="/planning-phase.png"
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

              <Carousel className="m-4 max-w-xs md:hidden">
                <CarouselContent>
                  <CarouselItem>
                    <Image
                      src="/dashboard-preview.jpg"
                      alt="Dashboard Preview"
                      width={600}
                      height={400}
                      className="rounded-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <Image
                      src="/dashboard-preview.jpg"
                      alt="Dashboard Preview"
                      width={600}
                      height={400}
                      className="rounded-lg"
                    />
                  </CarouselItem>
                  <CarouselItem>
                    <Image
                      src="/dashboard-preview.jpg"
                      alt="Dashboard Preview"
                      width={600}
                      height={400}
                      className="rounded-lg"
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>

          <div
            className="my-8 cursor-default mx-auto max-w-4xl p-4 bg-[#1a1a1a] rounded-lg shadow-lg transition duration-500 hover:scale-105"
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
            <div className="mt-4 flex justify-center">
              <Badge className="animate-pulse hover:text-white cursor-default hover:bg-[#3ecf95]/50 bg-[#3ecf95] text-black">
                Intuitive
              </Badge>
            </div>
          </div>

          <div
            className="my-8 cursor-default mx-auto max-w-4xl p-4 bg-[#313131] rounded-lg shadow-lg transition duration-500 hover:scale-105"
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
                Optimization
              </Badge>
            </div>
          </div>

          <div
            accessKey="glowElement"
            className="my-8 mx-auto cursor-default max-w-4xl p-4 bg-[#1a1a1a] rounded-lg shadow-lg transition duration-500 hover:scale-105"
          >
            <h2 className="text-3xl font-semibold text-[#3ecf95]">
              Security Automation
            </h2>
            <p className="text-gray-300 mt-2">
              Save time and money by automating your database security with
              cutting edge, custom-tailored AI.
            </p>
            <div className="mt-4 flex justify-center">
              <Badge className="animate-pulse hover:text-white cursor-default hover:bg-[#3ecf95]/50 bg-[#3ecf95] text-black">
                Automation
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
