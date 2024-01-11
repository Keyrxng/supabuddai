"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import NavLogo from "./NavLogo"

export function NavigationMenuDemo() {
  return (
    <NavigationMenu className="mt-3">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Why SupaBuddAi?</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-[#313131] mx-auto">
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] grid-cols-2 text-white font-bold">
              <ListItem
                className="hover:bg-[#353535]  line-clamp-2 text-sm leading-snug backdrop-none saturate-200"
                href="/benefits"
                title="Advanced Security"
              >
                <p className="">
                  Uncover the power of AI in fortifying your database security
                  with custom policies.
                </p>
              </ListItem>
              <ListItem
                className="hover:bg-[#353535]  backdrop-blur-md"
                href="/how-it-works"
                title="Effortless Integration"
              >
                Learn how SupaBuddAi seamlessly integrates with your database.
              </ListItem>
              <ListItem
                className="hover:bg-[#353535]  backdrop-blur-md"
                href="/features"
                title="Intuitive Dashboard"
              >
                Explore our user-friendly dashboard for real-time security
                insights.
              </ListItem>
              <ListItem
                className="hover:bg-[#353535]  backdrop-blur-md"
                href="/benefits"
                title="Advanced Security"
              >
                Uncover the power of AI in fortifying your database security
                with custom policies.
              </ListItem>
              <ListItem
                className="hover:bg-[#353535]  backdrop-blur-md"
                href="/how-it-works"
                title="Effortless Integration"
              >
                Learn how SupaBuddAi seamlessly integrates with your database.
              </ListItem>
              <ListItem
                className="hover:bg-[#353535]  backdrop-blur-md"
                href="/features"
                title="Intuitive Dashboard"
              >
                Explore our user-friendly dashboard for real-time security
                insights.
              </ListItem>
              <div className="flex items-center inset-0 absolute -z-2 justify-center bg-blend-overlay">
                <NavLogo
                  imgSize=""
                  className="h-min relative mx-auto grid -z-8 opacity-25 justify-center items-center"
                />
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-[#313131]">
            <ul className=" grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <ListItem
                className="hover:bg-[#353535]"
                href="/quick-start"
                title="Quick Start Guide"
              >
                Begin securing your database swiftly with our easy-to-follow
                Quick Start Guide.
              </ListItem>
              <ListItem
                className="hover:bg-[#353535]"
                href="/docs/installation"
                title="Installation"
              >
                Step-by-step instructions to install and set up..
              </ListItem>
              <ListItem
                className="hover:bg-[#353535]"
                href="/docs/optimization"
                title="Optimization Tips"
              >
                Gain insights on optimizing your database security effectively
                with SupaBuddAi.
              </ListItem>
              <ListItem
                className="hover:bg-[#353535]"
                href="/docs/faq"
                title="FAQ"
              >
                Frequently asked questions..
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden sm:inline-block">
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})

ListItem.displayName = "ListItem"
