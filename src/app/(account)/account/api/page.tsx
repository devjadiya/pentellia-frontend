"use client";

import React, { useState } from "react";
import {
  Key,
  Copy,
  Trash2,
  Plus,
  Sparkles,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  Bot,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ApiKeysPage() {
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Mock Data for "Standard" Keys
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key_1",
      name: "CI/CD Pipeline",
      prefix: "pk_live_51M...",
      lastUsed: "2 mins ago",
      created: "Oct 24, 2025",
      scopes: ["scans:read", "scans:write"],
    },
    {
      id: "key_2",
      name: "Dev Environment",
      prefix: "pk_test_89K...",
      lastUsed: "4 days ago",
      created: "Nov 01, 2025",
      scopes: ["scans:read"],
    },
  ]);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
    toast.success("API Key revoked");
  };

  return (
    <div className="flex flex-col h-full space-y-8 font-sans text-slate-200 p-6 max-w-5xl mx-auto">
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
            <Key className="h-4 w-4 text-indigo-400" />
          </div>
          API Keys & Access
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Manage programmatic access to the Pentellia platform. Create secret
          keys for your CI/CD pipelines, custom integrations, or automated
          reporting tools.
        </p>
      </div>

      {/* --- SECTION 1: AI API (UPCOMING) --- */}
      {/* This section is highlighted as requested */}
      <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-[#0F111A] p-1">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 p-4">
          <Badge className="bg-indigo-500 text-white border-0 hover:bg-indigo-600 px-3 py-1 text-xs uppercase tracking-wide font-bold animate-pulse">
            Upcoming Feature
          </Badge>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 relative z-10">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              AI Intelligence Layer
            </div>
            <h2 className="text-2xl font-bold text-white">
              Programmatic Vulnerability Analysis
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Soon you will be able to query our DeepSeek integration directly
              via API. Automatically send scan results to the AI engine and
              receive remediation logic, false-positive analysis, and executive
              summaries in JSON format.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant="outline"
                className="border-indigo-500/20 text-indigo-300 bg-indigo-500/5"
              >
                <Bot className="w-3 h-3 mr-1" /> Auto-Triage
              </Badge>
              <Badge
                variant="outline"
                className="border-indigo-500/20 text-indigo-300 bg-indigo-500/5"
              >
                <Terminal className="w-3 h-3 mr-1" /> Remediation Code Gen
              </Badge>
            </div>

            <div className="pt-4">
              <Button
                disabled
                className="bg-white/10 text-slate-400 border border-white/5 cursor-not-allowed"
              >
                Join Waitlist
              </Button>
            </div>
          </div>

          {/* Abstract Code Preview */}
          <div className="flex-1 bg-[#05060A] rounded-lg border border-white/10 p-4 font-mono text-xs text-slate-500 opacity-80">
            <div className="flex gap-1.5 mb-3 border-b border-white/5 pb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
            <div className="space-y-1">
              <span className="text-purple-400">POST</span>{" "}
              <span className="text-slate-300">/v1/ai/analyze</span>
              <br />
              <span className="text-indigo-400">
                Authorization:
              </span> Bearer <span className="blur-sm">sk_ai_8921...</span>
              <br />
              <span className="text-yellow-400">{"{"}</span>
              <br />
              &nbsp;&nbsp;<span className="text-cyan-400">"scan_id"</span>:{" "}
              <span className="text-green-400">"scan_123"</span>,
              <br />
              &nbsp;&nbsp;<span className="text-cyan-400">"prompt"</span>:{" "}
              <span className="text-green-400">"Explain CVE-2023-44487"</span>
              <br />
              <span className="text-yellow-400">{"}"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: STANDARD ACTIVE KEYS --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-medium text-white">
              Standard Access Keys
            </h3>
            <p className="text-sm text-slate-500">
              For triggering scans and retrieving raw results.
            </p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
            <Plus className="h-4 w-4 mr-2" /> Generate New Key
          </Button>
        </div>

        {/* Warning Banner */}
        <Alert className="bg-orange-500/5 border-orange-500/20 text-orange-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Security Best Practice</AlertTitle>
          <AlertDescription className="text-orange-200/70 text-xs">
            Do not share your API keys. If you suspect a key has been
            compromised, revoke it immediately.
          </AlertDescription>
        </Alert>

        {/* Keys List */}
        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg bg-[#0B0C15] border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-slate-200">{key.name}</h4>
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-5 bg-white/5 text-slate-500"
                    >
                      {key.id}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                    <span>Created: {key.created}</span>
                    <span>
                      Last used:{" "}
                      <span className="text-emerald-400">{key.lastUsed}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex-1 md:w-64 relative">
                  <Input
                    readOnly
                    value={key.prefix} // In real app, toggle full key
                    className="bg-black/30 border-white/5 text-slate-400 font-mono text-xs h-9 pr-10"
                  />
                  <button
                    onClick={() => handleCopy(key.prefix)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {copiedKey === key.prefix ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                  onClick={() => handleDelete(key.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
