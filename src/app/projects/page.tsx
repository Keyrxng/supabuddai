"use client"

import React, { Suspense, useEffect, useRef, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format, parseISO } from "date-fns"
import { MoveRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import HomeHero from "@/components/HomeHero"

type Props = {}
const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
})
export default function Page({}: Props) {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    async function load() {
      const { data: user, error } = await supabase.auth.getUser()
      if (error) {
        console.error("GET USER ERROR: ", error)
        return
      }

      loadProjects(user.user)
    }
    async function loadProjects(user) {
      const { data: userProjects, error: projectsError } = await supabase
        .from("user_projects")
        .select("*")
        .eq("user_id", user?.id)

      if (projectsError) {
        console.error("projectsError: ", projectsError)
        return
      }

      setProjects(userProjects)
    }
    load()
  }, [])

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
        className={`grid gap-4 text-left col-span-2 border-gray-700 my-2 w-96 cursor-pointer max-w-xs md:max-w-sm bg-[#1a1a1a] hover:bg-[#313131] shadow-[#1a1a1a]`}
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
          {project?.db_ref !== "N/A" && (
            <CardDescription className="text-xs font-light grid grid-cols-2 justify-between gap-1 text-muted">
              <Badge className="bg-gray-500/50 mx-auto text-white font-light text-xs text-muted">
                {project?.db_ref}
              </Badge>
              <div className="text-right w-full flex justify-end">
                <Badge className="bg-gray-500/50 mx-auto text-white text-xs font-light right-0 flex justify-end text-muted">
                  {project?.updated_at
                    ? format(parseISO(project?.updated_at), "PP")
                    : "N/A"}
                </Badge>
              </div>
            </CardDescription>
          )}
        </CardHeader>
        {project?.db_ref !== "N/A" && (
          <CardContent className="container flex flex-row text-center justify-center">
            <ul className="flex flex-row gap-4">
              <li className="text-sm text-muted">
                <Badge className="bg-green-500 text-white">Planning</Badge>
              </li>
              <li className="text-sm text-muted">
                <Badge className="bg-green-500 text-white">Generation</Badge>
              </li>
              <li className="text-sm text-muted">
                <Badge className="bg-red-500/45  text-gray-500/50">
                  Execution
                </Badge>
              </li>
            </ul>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <div className=" ">
      <Suspense
        fallback={
          <CardComp
            project={{
              db_name: "Fetching projects...",
              db_ref: "N/A",
            }}
          />
        }
      >
        <div className="grid-cols-1 ">
          {projects && projects.length > 0 && (
            <>
              <ul className="[&>:children:not(:last-child)]:mb-4 [&>:nth-last-child(1)]:mb-24 max-w-xs ">
                {projects.slice(0, 2).map((project) => (
                  <li key={project?.db_name}>
                    <CardComp project={project} />
                  </li>
                ))}
              </ul>
              <CardComp
                project={{
                  db_name: "Create new project",
                  db_ref: "N/A",
                }}
              />
            </>
          )}

          {!projects || (projects.length === 0 && <HomeHero />)}
        </div>
      </Suspense>
      {projects && projects.length === 0 && (
        <CardComp
          project={{
            db_name: "Create new project",
            db_ref: "N/A",
          }}
        />
      )}
    </div>
  )
}
