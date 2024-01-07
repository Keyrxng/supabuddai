"use client";
import React, { useEffect, useState } from "react";
import NoUserHero from "./NoUserHero";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MoveRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

type Props = {};
const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
});

function HomeHero({}: Props) {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [hover, setHover] = useState(false);
  const router = useRouter();
  useEffect(() => {
    async function load() {
      const { data: user, error } = await supabase.auth.getUser();
      if (error) {
        console.error("GET USER ERROR: ", error);
        return;
      }

      setUser(user.user);
      loadProjects(user.user);
    }
    async function loadProjects(user) {
      const { data: userProjects, error: projectsError } = await supabase
        .from("user_projects")
        .select("*")
        .eq("user_id", user?.id);

      if (projectsError) {
        console.error("projectsError: ", projectsError);
        return;
      }

      console.log(userProjects);
      setProjects(userProjects);
    }
    load();
  }, []);

  const handleRoute = (route) => {
    router.push(route);
  };

  return (
    <div className="m-12 flex flex-col items-center object-center align-middle gap-8">
      {projects || projects.length > 0 ? (
        <>
          {projects.map((project) => (
            <Card
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() => handleRoute(`/project/${project.db_name}`)}
              key={project.db_name}
              className={`${
                hover ? " bg-gray-800/25" : " bg-accent-foreground"
              }  grid gap-4 text-left col-span-2 w-96 cursor-pointer`}
            >
              <CardHeader>
                <div className="flex flex-row justify-between">
                  <CardTitle>{project.db_name}</CardTitle>
                  <MoveRight
                    id="arrowRight"
                    size={16}
                    className={`top-1/2 hidden lg:block ${
                      hover ? "animate-move-right-fixed" : ""
                    }`}
                  />
                </div>
                <CardDescription className="text-xs flex justify-between gap-4 text-muted">
                  <Badge className="bg-gray-500/50 text-white text-xs text-muted">
                    {project.db_ref}
                  </Badge>
                  <Badge className="bg-gray-500/50 text-white text-xs text-muted">
                    Last Check: {format(parseISO(project.updated_at), "PP")}
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
          ))}
        </>
      ) : (
        <NoUserHero />
      )}
    </div>
  );
}

export default HomeHero;
