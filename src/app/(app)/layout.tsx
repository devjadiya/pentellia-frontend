"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    // 1. Change min-h-screen to h-screen and add overflow-hidden to lock the window scroll
    <div className="relative h-screen w-full bg-[#05050A] font-sans text-slate-200 selection:bg-violet-500/30 overflow-hidden flex flex-col">
      {/* --- Ambient Background Glows --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen" />
      </div>

      {/* --- Header --- */}
      {/* Ensure Header is fixed or sticky if it isn't already inside the component */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* 2. Container for Sidebar + Main. Use h-full to fill remaining space. */}
      <div className="relative z-10 flex h-full pt-16">
        {/* --- Sidebar --- */}
        <AppSidebar isSidebarOpen={isSidebarOpen} />

        {/* --- Main Content --- */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            // 3. Add h-full and overflow-y-auto here to enable internal scrolling
            "h-full overflow-y-auto",
            isSidebarOpen ? "ml-64" : "ml-[80px]"
          )}
        >
          {/* Wrapper for padding/animation */}
          <div
            className={`${
              path.includes("scans") ? " " : "p-8"
            } animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-full`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
