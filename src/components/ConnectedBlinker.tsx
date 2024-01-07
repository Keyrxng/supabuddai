"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { Separator } from "./ui/separator";

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
});

export const ConnectedBlinker = () => {
  useEffect(() => {
    const ele = document.getElementById("connected-blinker");
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || session?.access_token) {
          ele?.classList.add("bg-green-500");
        } else {
          ele?.classList.remove("bg-green-500");
          ele?.classList.add("bg-red-500");
        }
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const ListItems = [
    {
      name: "My Account",
      children: [
        {
          name: "Profile",
          icon: User,
          href: "/account/profile",
        },
        {
          name: "Billing",
          icon: CreditCard,
          href: "/account/billing",
        },
        {
          name: "Settings",
          icon: Settings,
          href: "/account/settings",
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
        },
        {
          name: "Support",
          icon: LifeBuoy,
          href: "/support",
        },
      ],
    },
    {
      name: "",
      children: [
        {
          name: "Log out",
          icon: LogOut,
          href: "/logout",
        },
      ],
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex justify-between gap-4">
          <div
            id="connected-blinker"
            className={`w-4 h-4 rounded-full animate-pulse`}
          ></div>
          <UserCircle className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-5 mr-2">
        <DropdownMenuSeparator />
        {ListItems.map((item) => (
          <div key={item.name} className="">
            {item.children?.map((child) => (
              <DropdownMenuItem key={child.name}>
                {child.icon && (
                  <Button className="w-full flex text-left left-0 justify-start hover:bg-slate-600">
                    <child.icon className="mr-2 h-4 w-4" />
                    {child.name}
                  </Button>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Github className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
