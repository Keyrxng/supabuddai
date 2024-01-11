"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { LucideOctagon } from "lucide-react"

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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

export function NavigationMenuDemo() {
  return (
    <NavigationMenu className="mt-3">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Why SupaBuddAi?</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-[#313131]">
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Image
                      src="/supabuddai-logo.png"
                      width={450}
                      height={450}
                      className="w-full h-full"
                      alt="SupaBuddAi Logo"
                    />
                    <Image
                      src="/SupaBuddAi.svg"
                      width={450}
                      height={450}
                      className="w-full h-auto"
                      alt="SupaBuddAi Logo Text"
                    />
                    <p className="text-sm leading-tight text-muted-foreground">
                      Elevate Your Project's Security with AI-Powered Precision.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                className="hover:bg-[#353535]"
                href="/benefits"
                title="Advanced Security"
              >
                Uncover the power of AI in fortifying your database security
                with custom policies.
              </ListItem>
              <ListItem
                className="hover:bg-[#353535]"
                href="/how-it-works"
                title="Effortless Integration"
              >
                Learn how SupaBuddAi seamlessly integrates with your database.
              </ListItem>
              <ListItem
                className="hover:bg-[#353535]"
                href="/features"
                title="Intuitive Dashboard"
              >
                Explore our user-friendly dashboard for real-time security
                insights.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-[#313131]">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
        <NavigationMenuItem>
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
