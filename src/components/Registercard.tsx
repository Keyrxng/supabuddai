import { Dispatch, SetStateAction } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterCard({
  className,
  setNeedsReload,
}: {
  className: string
  setNeedsReload: Dispatch<SetStateAction<boolean>>
}) {
  const registerApi = "/api/auth/signup"

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(registerApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      throw new Error(data.error)
    }
  }

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      await register(name, email, password)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    const { name, email, password } = event.target.elements
    registerUser(name.value, email.value, password.value)
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
              <Label htmlFor="name">Name</Label>
              <Input id="name" />
            </div>

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
            onSubmit={handleSubmit}
            type="submit"
            className="hover:bg-gray-700/75 my-2 items-center justify-center w-full"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  )
}
