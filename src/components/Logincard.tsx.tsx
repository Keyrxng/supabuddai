import { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginCard({
  className,
  setNeedsReload,
}: {
  className: string
  setNeedsReload: Dispatch<SetStateAction<boolean>>
}) {
  const loginApi = "/api/auth/login"

  const login = async (email: string, password: string) => {
    const response = await fetch(loginApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (response.status === 500) {
      toast.error("Login failed")
      return false
    }

    if (response.status === 420) {
      toast.error("Invalid credentials")
      return false
    }

    if (response.ok) {
      window.location.href = window.location.href
      return true
    } else {
      toast.error("Login failed")
      return false
    }
  }

  const loginUser = async (email: string, password: string) => {
    try {
      const bool = await login(email, password)

      if (bool) {
        setNeedsReload(true)
        toast.success("Logged in successfully")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    console.log("logging in...")
    const { email, password } = event.target.elements
    loginUser(email.value, password.value)
  }

  return (
    <div
      className={cn(
        className,
        `max-w-xs`,
        "w-full",
        `container`,
        `lg:max-w-5xl`
      )}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" className="w-full" type="password" />
            </div>
          </div>
          <Button
            suppressHydrationWarning
            onSubmit={handleSubmit}
            type="submit"
            className="hover:bg-gray-700/75 my-2 items-center justify-center w-full"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}
