"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code,
  Globe,
  LayoutTemplate,
  Lock,
  Search,
  Server,
  Shield,
  ShieldAlert,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function WebScanReport({
  data,
  aiSummary,
}: {
  data: any;
  aiSummary?: string;
}) {
  // --- Data Extraction ---
  const resultRoot = data?.result || {};
  const scanResults = resultRoot.results || {};
  const summary = resultRoot.summary || {};

  // Recon Data
  const httpxData = scanResults.reconnaissance?.httpx?.results?.[0] || {};
  const wafData = scanResults.reconnaissance?.wafw00f || {};
  const whatWebData = scanResults.reconnaissance?.whatweb?.results?.[0] || {};

  // Security Headers Data
  const headersData = scanResults.security_headers || {};
  const missingHeaders = headersData.findings || []; // Detailed list
  const presentHeaders = headersData.headers_present || [];

  // Tech Stack (Combine sources)
  const techStack = [
    ...(httpxData.tech || []),
    ...(whatWebData.plugins?.HTTPServer?.string || []),
  ];
  // Deduplicate
  const uniqueTech = Array.from(new Set(techStack));

  // Meta Info
  const target = resultRoot.target || "Unknown Target";
  const scanDuration = resultRoot.scan_duration
    ? `${resultRoot.scan_duration}s`
    : "N/A";
  const securityGrade = headersData.security_grade || "-";
  const securityScore = headersData.security_score || 0;

  // Risks
  const riskCounts = {
    critical: summary.critical || 0,
    high: summary.high || 0,
    medium: summary.medium || 0,
    low: summary.low || 0,
    info: summary.info || 0,
  };

  // --- Scroll & Navigation Logic ---
  const [activeSection, setActiveSection] = useState("summary");
  const isScrollingRef = useRef(false);

  const scrollToSection = (id: string) => {
    isScrollingRef.current = true;
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );

    ["summary", "tech", "headers", "tests", "params", "ai"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#0B0C15] text-slate-200 selection:bg-blue-500/30">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 z-50 w-full bg-[#0B0C15]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold text-white leading-none">
                Web Application Scan
              </h1>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 opacity-80">
                {target}
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider"
          >
            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Completed
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <NavButton
              label="Summary"
              active={activeSection === "summary"}
              onClick={() => scrollToSection("summary")}
            />
            <NavButton
              label="Tech Stack"
              active={activeSection === "tech"}
              onClick={() => scrollToSection("tech")}
            />
            <NavButton
              label="Security Headers"
              active={activeSection === "headers"}
              onClick={() => scrollToSection("headers")}
            />
            <NavButton
              label="Performed Tests"
              active={activeSection === "tests"}
              onClick={() => scrollToSection("tests")}
            />
            <NavButton
              label="Parameters"
              active={activeSection === "params"}
              onClick={() => scrollToSection("params")}
            />
            <NavButton
              label="AI Analysis"
              icon={<Sparkles className="h-3.5 w-3.5 mr-2 text-indigo-400" />}
              active={activeSection === "ai"}
              onClick={() => scrollToSection("ai")}
            />
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex flex-col gap-16 p-6 pb-40 max-w-7xl mx-auto w-full mt-8">
        {/* SECTION: SUMMARY */}
        <section id="summary" className="scroll-mt-48 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Executive Summary
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              JOB ID: {data?.job_id?.split("-")[0] || "UNK"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Summary Card */}
            <Card className="lg:col-span-2 bg-[#0B0C15] border border-white/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 min-w-[180px]">
                    <span className="text-[10px] uppercase font-bold tracking-wider mb-2 text-slate-400">
                      Header Grade
                    </span>
                    <div className="relative flex items-center justify-center h-24 w-24">
                      <div
                        className={cn(
                          "text-6xl font-bold",
                          securityGrade === "A"
                            ? "text-emerald-500"
                            : securityGrade === "B"
                            ? "text-blue-500"
                            : securityGrade === "C"
                            ? "text-yellow-500"
                            : "text-red-500"
                        )}
                      >
                        {securityGrade}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-[-10px]">
                      {securityScore}/100 Score
                    </span>
                  </div>

                  <div className="hidden md:block w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                  <div className="flex-1 grid grid-cols-4 gap-4 w-full">
                    <RiskMiniCard
                      label="Critical"
                      count={riskCounts.critical}
                      color="text-red-500"
                    />
                    <RiskMiniCard
                      label="High"
                      count={riskCounts.high}
                      color="text-orange-500"
                    />
                    <RiskMiniCard
                      label="Medium"
                      count={riskCounts.medium}
                      color="text-yellow-500"
                    />
                    <RiskMiniCard
                      label="Low"
                      count={riskCounts.low}
                      color="text-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4">
              <MetaCard
                icon={<Clock className="w-4 h-4" />}
                label="Duration"
                value={scanDuration}
              />
              <MetaCard
                icon={<Shield className="w-4 h-4" />}
                label="WAF Status"
                value={
                  wafData.data?.[0]?.detected ? "Detected" : "Not Detected"
                }
              />
              <div className="p-5 rounded-lg border border-white/10 bg-white/[0.02] flex flex-col justify-center">
                <span className="text-xs text-slate-500 mb-1">
                  Server Status
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-200">
                    {httpxData.status_code || "Unknown"} OK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-white/5" />

        {/* SECTION: TECH STACK */}
        <section id="tech" className="scroll-mt-48 mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Technology Stack
            </h3>
            <div className="flex gap-4">
              <div className="flex bg-white/5 p-1 rounded-lg">
                <FilterBadge
                  label="Technologies"
                  count={uniqueTech.length}
                  active
                />
              </div>
            </div>
          </div>

          <div className="border border-white/10 rounded-xl bg-[#0B0C15] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors group">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded flex items-center justify-center bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-xs shadow-lg">
                  INFO
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                    Server software and technology found
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] text-slate-500 font-mono flex items-center">
                      <Server className="w-3 h-3 mr-1.5" /> 443 / TCP
                    </span>
                  </div>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-600 group-hover:text-white transition-colors" />
            </div>

            <div className="p-0 border-t border-white/5 bg-black/20">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-white/5">
                <div className="divide-y divide-white/5">
                  {uniqueTech.length > 0 ? (
                    uniqueTech.map((tech: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <TechLogo name={tech} />
                          <span className="text-sm text-slate-200 font-medium">
                            {tech}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {detectCategory(tech)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-sm text-slate-500 italic">
                      No technologies identified.
                    </div>
                  )}
                </div>
                {/* Screenshot Placeholder Area */}
                <div className="hidden md:flex flex-col items-center justify-center p-6 bg-[#0B0C15]">
                  <div className="aspect-video w-full max-w-sm bg-black border border-white/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                    <Globe className="h-10 w-10 text-slate-700 mb-2 z-0" />
                    <p className="text-xs text-slate-600 z-0">Site Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SECURITY HEADERS */}
        <section id="headers" className="scroll-mt-48 mt-8 space-y-6">
          <h3 className="text-xl font-semibold text-white">
            Security Headers Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Headers */}
            <Card className="bg-[#0B0C15] border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-base text-red-400 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" /> Missing Headers (
                  {missingHeaders.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {missingHeaders.map((item: any, i: number) => (
                    <div key={i} className="p-4 hover:bg-white/[0.02]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-mono text-red-300">
                          {item.header}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] uppercase",
                            item.severity === "high"
                              ? "text-red-400 border-red-500/30"
                              : item.severity === "medium"
                              ? "text-orange-400 border-orange-500/30"
                              : "text-yellow-400 border-yellow-500/30"
                          )}
                        >
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Present Headers */}
            <Card className="bg-[#0B0C15] border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-base text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Present Headers (
                  {presentHeaders.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {presentHeaders.length > 0 ? (
                    presentHeaders.map((item: any, i: number) => (
                      <div key={i} className="p-4 hover:bg-white/[0.02]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-mono text-emerald-300">
                            {item.header}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
                          >
                            Secure
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 font-mono truncate bg-black/30 p-1.5 rounded mt-2 border border-white/5">
                          {item.value}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-sm text-slate-500 italic">
                      No security headers detected.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION: TESTS */}
        <section id="tests" className="scroll-mt-48 mt-8 space-y-6">
          <h3 className="text-xl font-semibold text-white">Performed Tests</h3>
          <Card className="bg-[#0B0C15] border border-white/10 group hover:border-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Activity className="h-6 w-6 text-cyan-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-slate-200 group-hover:text-white transition-colors">
                    Comprehensive Web Analysis
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
                    Executed <strong>HTTPX</strong> for probing,{" "}
                    <strong>Wafw00f</strong> for firewall detection,{" "}
                    <strong>WhatWeb</strong> for technology fingerprinting, and{" "}
                    <strong>HeaderAudit</strong> for security policy compliance.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {summary.tools_executed?.map((tool: string) => (
                      <Badge
                        key={tool}
                        variant="secondary"
                        className="bg-white/5 text-slate-400 hover:text-white border border-white/5"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION: PARAMETERS */}
        <section id="params" className="scroll-mt-48 mt-8 space-y-6">
          <h3 className="text-xl font-semibold text-white">Scan Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ParameterCard
              label="Target URL"
              value={target}
              icon={<Search className="w-3 h-3" />}
            />
            <ParameterCard
              label="Scan Level"
              value={resultRoot.scan_level || "Standard"}
              icon={<LayoutTemplate className="w-3 h-3" />}
            />
            <ParameterCard
              label="CMS Detection"
              value={resultRoot.parameters_used?.cms_scan || "Auto"}
              icon={<LayoutTemplate className="w-3 h-3" />}
            />
            <ParameterCard
              label="CVE Checks"
              value={
                resultRoot.parameters_used?.enable_cve ? "Enabled" : "Disabled"
              }
              icon={<AlertOctagon className="w-3 h-3" />}
            />
          </div>
        </section>

        {/* SECTION: AI ANALYSIS */}
        <section id="ai" className="scroll-mt-48 mt-8 space-y-6">
          <Card className="bg-[#0B0C15] border-indigo-500/30 shadow-[0_0_80px_rgba(79,70,229,0.08)] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-40 bg-indigo-600/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
            <CardHeader className="border-b border-white/5 bg-indigo-500/5 py-5 px-6">
              <CardTitle className="flex items-center gap-2.5 text-indigo-300 text-base font-medium">
                <Sparkles className="h-4 w-4 text-indigo-400 fill-indigo-400/20" />
                DeepSeek Intelligent Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {aiSummary ? (
                <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white max-w-none text-sm leading-7">
                  {aiSummary}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                    <Terminal className="h-8 w-8 text-slate-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-300 font-medium">
                      Analysis Pending
                    </p>
                    <p className="text-slate-500 text-sm">
                      AI insight generation has not been triggered for this scan
                      yet.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function NavButton({ label, onClick, active, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center h-14 px-4 text-sm font-medium transition-all border-b-2 outline-none select-none",
        active
          ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
          : "border-transparent text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.02]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function RiskMiniCard({ label, count, color }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
      <span className={cn("text-2xl font-light mb-1", color)}>{count}</span>
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
        {label}
      </span>
    </div>
  );
}

function MetaCard({ icon, label, value }: any) {
  return (
    <div className="p-5 rounded-lg border border-white/10 bg-white/[0.02] flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-500">{icon}</span>
        <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-medium text-slate-200 truncate">
        {value}
      </span>
    </div>
  );
}

function ParameterCard({ label, value, icon }: any) {
  return (
    <div className="bg-[#0B0C15] border border-white/10 p-6 rounded-lg flex flex-col gap-2">
      <div className="text-xs font-bold uppercase text-slate-500 tracking-wide flex items-center gap-2">
        {icon} {label}
      </div>
      <div className="text-sm text-slate-200 font-mono bg-black/40 px-4 py-3 rounded border border-white/5 truncate select-all">
        {value}
      </div>
    </div>
  );
}

function FilterBadge({ label, count, active }: any) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all",
        active
          ? "bg-cyan-600 text-white shadow-sm"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <span>{label}</span>
      {count !== undefined && <span className="opacity-70">({count})</span>}
    </button>
  );
}

function TechLogo({ name }: { name: string }) {
  const n = name.charAt(0).toUpperCase();
  let style = "bg-slate-800 text-slate-400 border-white/5";
  const lower = name.toLowerCase();

  if (lower.includes("vercel")) style = "bg-black text-white border-white/20";
  else if (lower.includes("react") || lower.includes("next"))
    style = "bg-cyan-900/20 text-cyan-400 border-cyan-500/20";
  else if (lower.includes("hsts") || lower.includes("security"))
    style = "bg-emerald-900/20 text-emerald-400 border-emerald-500/20";

  return (
    <div
      className={cn(
        "h-8 w-8 rounded-md flex items-center justify-center text-[10px] font-bold border shadow-sm",
        style
      )}
    >
      {n}
    </div>
  );
}

function detectCategory(name: string) {
  const n = name.toLowerCase();
  if (n.includes("react") || n.includes("vue") || n.includes("next"))
    return "Web Framework";
  if (n.includes("vercel") || n.includes("cloudflare"))
    return "Infrastructure / CDN";
  if (n.includes("hsts")) return "Security Policy";
  return "Technology";
}
