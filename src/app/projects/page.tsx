"use client"

import React, { Suspense, useEffect, useState } from "react"
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

type Props = {}
const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
})
export default function Page({}: Props) {
  const [projects, setProjects] = useState([])
  const [user, setUser] = useState(null)
  const [hover, setHover] = useState(false)
  createClientComponentClient
  useEffect(() => {
    async function load() {
      const { data: user, error } = await supabase.auth.getUser()
      if (error) {
        console.error("GET USER ERROR: ", error)
        return
      }

      setUser(user.user)
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

      console.log(userProjects)
      setProjects(userProjects)
    }
    load()
  }, [])

  const CardComp = ({ project }: { project: any }) => {
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
        }  grid gap-4 text-left col-span-2 w-96 cursor-pointer`}
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
          <CardDescription className="text-xs grid grid-cols-2 justify-between gap-1 text-muted">
            <Badge className="bg-gray-500/50 text-white text-xs text-muted">
              {project?.db_ref}
            </Badge>
            <Badge className="bg-gray-500/50 text-white text-xs text-muted">
              Last Check:{" "}
              {project?.updated_at
                ? format(parseISO(project?.updated_at), "PP")
                : "N/A"}
            </Badge>
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

  return (
    <div className="m-2 mt-5 ">
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
              <ul className="[&>:children:not(:last-child)]:mb-4 [&>:nth-last-child(1)]:mb-24">
                {projects.slice(0, 3).map((project) => (
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
