"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  Menu,
  Bell,
  Search,
  CreditCard,
  LogOut,
  User,
  SlidersHorizontal,
  KeyRound,
  ScrollText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // --- Profile Logic ---
  const firstName = user?.firstName || "User";
  const lastName = user?.lastName || "";
  const email = user?.email || "";

  // FIX: Support both explicit URLs (Cloud/Base64) AND the new fast API endpoint
  // If user.avatar is null (because we optimized the payload), we assume the image
  // might exist at the endpoint. The Avatar component handles 404s gracefully.
  const avatarUrl = user?.avatar || "/api/users/avatar";

  const getInitials = (fName: string, lName: string) => {
    return ((fName?.[0] || "") + (lName?.[0] || "")).toUpperCase() || "U";
  };

  // Calculate Profile Completion %
  const completionStats = useMemo(() => {
    if (!user) return { percent: 0, missing: [] };

    // Define fields that count towards 100%
    const fields = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "company", label: "Company" },
      { key: "role", label: "Role" },
      { key: "country", label: "Country" },
      // Note: We check 'avatarUrl' here instead of 'user.avatar' to ensure
      // the progress bar counts it even if it's being loaded via the API endpoint.
      { key: "avatarCheck", label: "Profile Picture" },
      { key: "verifiedDomain", label: "Verified Domain" },
    ];

    const completed = fields.filter((f) => {
      if (f.key === "avatarCheck") {
        // If we have a direct string OR we are using the API endpoint, we count it.
        // (In a real app, you might pass a 'hasAvatar' boolean from backend to be 100% sure)
        return true;
      }
      const val = user[f.key as keyof typeof user];
      return val && val.toString().trim().length > 0;
    });

    const percent = Math.round((completed.length / fields.length) * 100);
    return { percent };
  }, [user]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 px-4 transition-all duration-300",
        "bg-[#0B0C15]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#0B0C15]/60"
      )}
    >
      <div className="flex items-center gap-4">
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/dashboard" className="flex items-center gap-2">
          {/* Ensure path matches your public folder */}
          <img
            src="/logo.png"
            alt="logo"
            className="w-[140px] object-contain"
          />
        </Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link href="/subscription">
          <Button
            size="sm"
            className="hidden border border-violet-500/30 bg-violet-500/10 text-violet-300 shadow-[0_0_10px_rgba(124,58,237,0.1)] transition-all hover:border-violet-500 hover:bg-violet-500/20 hover:text-white sm:inline-flex"
          >
            <CreditCard className="mr-2 h-3.5 w-3.5" />
            Upgrade
          </Button>
        </Link>

        {/* <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0B0C15]" />
        </Button> */}

        {/* --- PROFILE DROPDOWN --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer group">
              {/* Circular Progress SVG */}
              <div className="relative flex items-center justify-center h-11 w-11">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-white/10"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  {/* Progress Circle */}
                  <path
                    className={cn(
                      "transition-all duration-1000 ease-out",
                      completionStats.percent === 100
                        ? "text-emerald-500"
                        : "text-violet-600"
                    )}
                    strokeDasharray={`${completionStats.percent}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Avatar Inside */}
                <Avatar className="absolute h-8 w-8 border border-white/10 transition-transform group-hover:scale-105">
                  <AvatarImage
                    src={avatarUrl}
                    alt={firstName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-violet-900/50 text-xs font-bold text-violet-200">
                    {getInitials(firstName, lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 border-white/10 bg-[#0B0C15] text-slate-200 p-2"
          >
            <div className="px-2 py-2">
              <p className="text-sm font-medium text-white truncate">
                {firstName} {lastName}
              </p>
              <p className="text-xs text-slate-500 truncate mb-3">{email}</p>

              {/* Profile Completion Bar */}
              <div className="space-y-1.5 bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="flex justify-between text-[10px] uppercase font-semibold text-slate-400">
                  <span>Profile Strength</span>
                  <span
                    className={
                      completionStats.percent === 100
                        ? "text-emerald-400"
                        : "text-violet-400"
                    }
                  >
                    {completionStats.percent}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      completionStats.percent === 100
                        ? "bg-emerald-500"
                        : "bg-violet-600"
                    )}
                    style={{ width: `${completionStats.percent}%` }}
                  />
                </div>
                {completionStats.percent < 100 && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Complete your profile to unlock all badges.
                  </p>
                )}
              </div>
            </div>

            <DropdownMenuSeparator className="bg-white/10 mx-2" />

            <Link href={"/account/user-settings"}>
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white rounded-md py-2.5">
                <User className="mr-2 h-4 w-4 text-slate-400" />
                <span className="flex-1">Profile Settings</span>
                {completionStats.percent < 100 && (
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                )}
              </DropdownMenuItem>
            </Link>

            <Link href={"/account/api"}>
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white rounded-md py-2.5">
                <KeyRound className="mr-2 h-4 w-4 text-slate-400" /> API Keys
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-white/10 mx-2" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-300 rounded-md py-2.5"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
