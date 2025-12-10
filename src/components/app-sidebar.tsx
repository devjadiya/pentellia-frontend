
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Package,
  FileText,
  ShieldCheck,
  FileSearch,
  Crosshair,
  Server,
  Users,
  Blocks,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "./ui/badge";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/assets", icon: Package, label: "Assets" },
  { href: "/scans", icon: ShieldCheck, label: "Scans" },
  { href: "/findings", icon: FileSearch, label: "Findings" },
  { href: "/attack-surface", icon: Crosshair, label: "Attack Surface" },
  { href: "/handlers", icon: Server, label: "Handlers" },
  { href: "/reports", icon: FileText, label: "Reports" },
  { href: "/robots", icon: Bot, label: "Robots" },
  { href: "/team", icon: Users, label: "Team" },
  { href: "/integrations", icon: Blocks, label: "Integrations" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="h-16 flex items-center justify-center">
        {/* This space is intentionally left for alignment with the header */}
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span className="truncate">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t border-sidebar-border p-2 flex flex-col items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center gap-3 w-full p-2 rounded-md hover:bg-sidebar-accent relative group-data-[state=collapsed]/sidebar-wrapper:p-0">
                {userAvatar && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={userAvatar.imageUrl}
                      alt={userAvatar.description}
                      width={32}
                      height={32}
                      data-ai-hint={userAvatar.imageHint}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
                <span className="truncate text-sm group-data-[state=collapsed]/sidebar-wrapper:hidden">My Account</span>
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0 group-data-[state=expanded]/sidebar-wrapper:-top-1 group-data-[state=expanded]/sidebar-wrapper:-right-1 group-data-[state=collapsed]/sidebar-wrapper:top-0 group-data-[state=collapsed]/sidebar-wrapper:right-0">3</Badge>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="end" side="top">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </>
  );
}
