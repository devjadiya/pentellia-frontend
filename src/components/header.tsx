
"use client";

import { Menu, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldIcon } from "./icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useMemo } from "react";

export function Header() {
    const userAvatar = useMemo(() => PlaceHolderImages.find(img => img.id === 'user-avatar'), []);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-700 bg-[#111827] px-6 text-white">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2">
             <ShieldIcon className="h-6 w-6 text-white" />
             <span className="text-lg font-semibold text-white">Pentest Tools</span>
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        <Button variant="warning" className="hidden sm:inline-flex">
          <Star className="mr-2 h-4 w-4" />
          Unlock full features
        </Button>
        <Button variant="dark" className="hidden sm:inline-flex">Book a Demo</Button>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white">
                    RESOURCES
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Blog</DropdownMenuItem>
                <DropdownMenuItem>API Reference</DropdownMenuItem>
                <DropdownMenuItem>Changelog</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={userAvatar?.imageUrl}
                    alt={userAvatar?.description}
                    data-ai-hint={userAvatar?.imageHint}
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
