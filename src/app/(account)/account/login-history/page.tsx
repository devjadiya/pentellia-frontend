"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  AlertCircle,
  MapPin,
  Clock,
  Code, // Added icon for localhost
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

// --- Types ---
interface LoginEvent {
  id: string;
  ip_address: string;
  location: string;
  user_agent: string;
  login_at: string;
}

export default function LoginHistoryPage() {
  const [history, setHistory] = useState<LoginEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        if (data.success) {
          setHistory(data.history);
        } else {
          toast.error("Failed to load login history");
        }
      } catch (error) {
        console.error(error);
        toast.error("Network error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // --- Helpers ---
  const getDeviceIcon = (ua: string) => {
    if (/mobile/i.test(ua)) return <Smartphone className="h-4 w-4" />;
    return <Laptop className="h-4 w-4" />;
  };

  const getBrowserName = (ua: string) => {
    if (/chrome/i.test(ua)) return "Chrome";
    if (/firefox/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua)) return "Safari";
    if (/edge/i.test(ua)) return "Edge";
    return "Unknown Browser";
  };

  // NEW: Helper to format location
  const formatLocation = (ip: string, loc: string) => {
    if (ip === "::1" || ip === "127.0.0.1") {
      return { text: "Local Development", isLocal: true };
    }
    if (!loc || loc === "Unknown") {
      return { text: "Unknown Location", isLocal: false };
    }
    return { text: loc, isLocal: false };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-6 font-sans text-slate-200 overflow-y-auto custom-scrollbar p-4 max-w-5xl mx-auto w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-400" /> Security Log
        </h1>
        <p className="text-sm text-slate-400">
          Review your recent sign-in activity.
        </p>
      </div>

      <Card className="bg-[#0B0C15]/50 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-white/[0.02] px-6 py-4">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Recent Logins
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-medium">
                <tr>
                  <th className="px-6 py-3 w-[30%]">Device & Browser</th>
                  <th className="px-6 py-3 w-[25%]">Location</th>
                  <th className="px-6 py-3 w-[20%]">IP Address</th>
                  <th className="px-6 py-3 w-[25%] text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 bg-white/10 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-32 bg-white/10 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-20 bg-white/10 rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-16 bg-white/10 rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 opacity-20" />
                        <p>No login history found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((event) => {
                    const locationInfo = formatLocation(
                      event.ip_address,
                      event.location
                    );

                    return (
                      <tr
                        key={event.id}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
                              {getDeviceIcon(event.user_agent)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-200">
                                {getBrowserName(event.user_agent)}
                              </p>
                              <p
                                className="text-xs text-slate-500 truncate max-w-[200px]"
                                title={event.user_agent}
                              >
                                {event.user_agent}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-300">
                            {locationInfo.isLocal ? (
                              <Code className="h-3.5 w-3.5 text-blue-400" />
                            ) : (
                              <MapPin className="h-3.5 w-3.5 text-slate-500" />
                            )}
                            <span
                              className={
                                locationInfo.isLocal ? "text-blue-300" : ""
                              }
                            >
                              {locationInfo.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs text-slate-400 border-white/10 bg-white/[0.02]"
                          >
                            {event.ip_address}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-slate-200 font-medium">
                              {new Date(event.login_at).toLocaleDateString(
                                undefined,
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.login_at).toLocaleTimeString(
                                undefined,
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false, // Set to true if you prefer AM/PM
                                }
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
