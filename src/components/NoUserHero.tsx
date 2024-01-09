"use client"

import React, { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { MoveDown, MoveRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { LoginCard } from "./Logincard.tsx"
import { NewProjectCard } from "./NewProjectCard"

type Props = {}

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
})

function NoUserHero({}: Props) {
  const [isBlurred, setIsBlurred] = useState(true)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.auth.getSession()
      console.log(data)
      if (data.session) {
        setIsBlurred(false)
      } else {
        setIsBlurred(true)
      }
    }

    load()
  }, [])

  return (
    <div className="grid-cols-1 flex-row items-center object-center align-middle gap-4 max-w-xs lg:max-w-5xl">
      <div className="grid grid-cols-1 gap-4">
        <Card
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="grid gap-4 text-center"
        >
          <CardHeader>
            <CardTitle>First Steps</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex flex-col items-center text-center text-gap-4">
              <CardContent className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
                {isBlurred && (
                  <>
                    <ul>
                      <li className="text-lg text-muted">
                        1. Register your account with us to get started.
                      </li>
                    </ul>
                    <ul>
                      <li className="text-lg text-muted">
                        2. Create a new project pointing to your Supabase
                        database.
                      </li>
                    </ul>
                    <ul>
                      <li className="text-lg text-muted">
                        3. Allow SupaBuddAi to aggregate your database schema
                        and RLS rules.
                      </li>
                    </ul>
                  </>
                )}
                {!isBlurred && (
                  <>
                    <ul>
                      <li className="text-lg text-muted">
                        1. Create a new project pointing to your Supabase
                        database.
                      </li>
                    </ul>
                    <ul>
                      <li className="text-lg text-muted">
                        2. Allow SupaBuddAi to aggregate your database schema
                        and RLS rules.
                      </li>
                    </ul>
                    <ul>
                      <li className="text-lg text-muted">
                        3. Interact with your project to get started.
                      </li>
                    </ul>
                  </>
                )}
              </CardContent>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="m-4 lg:m-12 flex flex-col lg:flex-row items-center object-center align-middle gap-4 max-w-xs lg:max-w-7xl">
        {isBlurred && (
          <>
            <Card
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="grid gap-4 text-center"
            >
              <CardHeader>
                <CardTitle>Register</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <div className="flex flex-col items-center text-center text-gap-4">
                  <p className="text-sm text-muted"></p>
                  <LoginCard className="" setNeedsReload={() => {}} />
                </div>
              </CardContent>
            </Card>
            <MoveRight
              id="arrowRight"
              className={`top-1/2 hidden lg:block ${
                hover ? "animate-nudge-right" : ""
              }`}
            />{" "}
            <MoveDown
              id="arrowDown"
              className={`top-1/2 lg:hidden ${
                hover ? "animate-nudge-down" : ""
              }`}
            />
          </>
        )}
        <Card
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`grid gap-4 text-center relative w-full ${
            isBlurred ? "hover:shadow-lg" : "shadow-lg"
          }`}
        >
          {isBlurred && (
            <div className="absolute w-[98%] h-[99%] m-1 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center"></div>
          )}
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex flex-col items-center text-center text-gap-4">
              <p className="text-sm text-muted">
                To get started with SupabuddAi you need to create a project.
              </p>
              <NewProjectCard />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NoUserHero
