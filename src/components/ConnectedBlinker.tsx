"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { set } from "date-fns"
import {
  CreditCard,
  Github,
  LifeBuoy,
  LogOut,
  Settings,
  User,
  UserCircle,
  UserRoundPlus,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { LoginCard } from "./Logincard.tsx"
import { RegisterCard } from "./Registercard.tsx"

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
})

export const ConnectedBlinker = () => {
  const [user, setUser] = useState<any>(null)
  const [needsReload, setNeedsReload] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: session, error } = await supabase.auth.getSession()
      if (error) {
        console.error("GET USER ERROR: ", error)
        return
      }

      if (session.session?.user) {
        setUser(session.session.user)
      } else {
        console.log("user: ", user)
        setUser(null)
      }
    }
    load()

    const ele = document.getElementById("connected-blinker")
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || session?.access_token) {
          ele?.classList.add("bg-green-500")
          setUser(session?.user)
        } else {
          ele?.classList.remove("bg-green-500")
          ele?.classList.add("bg-red-500")
          setUser(null)
        }
      }
    )
    return () => {
      authListener?.subscription.unsubscribe()
      setNeedsReload(!needsReload)
    }
  }, [needsReload])

  const router = useRouter()
  const ListItems = [
    {
      name: "My Account",
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
          name: "Settings",
          icon: Settings,
          href: "/account/settings",
          action: () => {
            router.push("/account/settings")
          },
        },
      ],
    },
    {
      name: "",
      children: [
        {
          name: "GitHub",
          icon: Github,
          href: "https://github.com/Keyrxng",
          action: () => {
            router.push("https://github.com/Keyrxng")
          },
        },
        {
          name: "Support",
          icon: LifeBuoy,
          href: "/support",
          action: () => {
            router.push("/support")
          },
        },
      ],
    },
    {
      name: "",
      children: [
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

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const noUserListItems = [
    {
      name: "Sign in",
      icon: UserCircle,
      comp: LoginCard,
      action: () => setShowLogin(!showLogin),
    },
    {
      name: "Sign up",
      icon: UserRoundPlus,
      comp: LoginCard,
      action: () => setShowRegister(!showRegister),
    },
  ]

  return (
    <DropdownMenu
      onOpenChange={() => {
        setShowLogin(false)
        setShowRegister(false)
      }}
    >
      <DropdownMenuTrigger>
        <Button variant="outline" className="flex justify-between gap-4">
          <div
            id="connected-blinker"
            className={`w-4 h-4 rounded-full animate-pulse`}
          ></div>
          <UserCircle className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-56 mt-5 mr-2">
          <DropdownMenuSeparator />
          <>
            {user
              ? ListItems.map((item) => (
                  <div key={item.name} className="w-full">
                    {item.children?.map((child) => (
                      <DropdownMenuItem key={child.name}>
                        {child.icon && (
                          <>
                            {child.href ? (
                              <a
                                href={child.href}
                                className="w-full flex text-left left-0 justify-start hover:bg-slate-600"
                              >
                                <Button className="w-full flex text-left left-0 justify-start hover:bg-slate-600">
                                  <child.icon className="mr-2 h-4 w-4" />
                                  {child.name}
                                </Button>
                              </a>
                            ) : (
                              <Button
                                onClick={() => child.action?.()}
                                className="w-full flex text-left left-0 justify-start hover:bg-slate-600"
                              >
                                <child.icon className="mr-2 h-4 w-4" />
                                {child.name}
                              </Button>
                            )}
                          </>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </div>
                ))
              : noUserListItems.map((item) => (
                  <>
                    {!showLogin && !showRegister && (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Button
                            onClick={() => item.action?.()}
                            className="w-full flex text-left left-0 justify-start hover:bg-slate-600"
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </Button>
                        </DropdownMenuSubTrigger>
                      </DropdownMenuSub>
                    )}
                  </>
                ))}
            <DropdownMenuSeparator />

            {showLogin && (
              <LoginCard
                className="w-[100px]"
                setNeedsReload={setNeedsReload}
              />
            )}
            {showRegister && (
              <RegisterCard
                className="w-[100px]"
                setNeedsReload={setNeedsReload}
              />
            )}
          </>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
