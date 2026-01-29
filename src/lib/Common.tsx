"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Info,
  Server,
  Activity,
  Layers,
  FileText,
  Cpu,
  Sparkles,
  Terminal,
  Crosshair,
  Hash,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

export function CommonScanReport({
  data,
  aiSummary,
}: {
  data: any;
  aiSummary?: string;
}) {
  // --- Data Parsing ---
  // We assume 'data' prop contains the 'result' object from your JSON
  const meta = data?.meta || {};
  const summary = data?.summary || {};
  const findings = data?.findings || [];
  const coverage = data?.tool_coverage || {};
  const execSummary = data?.executive_summary;

  // Risk Calculations
  const riskScore = summary.risk_score || 0;
  const riskLevel = summary.risk_level || "Unknown";

  // Navigation State
  const [activeSection, setActiveSection] = useState("executive");
  const isScrollingRef = useRef(false);

  const scrollToSection = (id: string) => {
    isScrollingRef.current = true;
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  // Scroll Spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "-100px 0px -70% 0px", threshold: 0 },
    );

    ["executive", "findings", "methodology", "ai"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#0B0C15] text-slate-200 selection:bg-indigo-500/30">
      {/* --- Sticky Navigation Header --- */}
      <div className="sticky top-0 z-40 w-full bg-[#0B0C15]/95 backdrop-blur-xl border-b border-white/10 shadow-lg transition-all duration-300">
        <div className="flex items-center gap-2 px-6 h-16 overflow-x-auto no-scrollbar max-w-7xl mx-auto w-full">
          <NavButton
            label="Executive Summary"
            active={activeSection === "executive"}
            onClick={() => scrollToSection("executive")}
            icon={<FileText className="w-4 h-4" />}
          />
          <NavButton
            label={`Detailed Findings (${findings.length})`}
            active={activeSection === "findings"}
            onClick={() => scrollToSection("findings")}
            icon={<AlertTriangle className="w-4 h-4" />}
          />
          <NavButton
            label="Methodology & Scope"
            active={activeSection === "methodology"}
            onClick={() => scrollToSection("methodology")}
            icon={<Layers className="w-4 h-4" />}
          />
          <NavButton
            label="AI Intelligence"
            active={activeSection === "ai"}
            onClick={() => scrollToSection("ai")}
            icon={<Sparkles className="w-4 h-4 text-indigo-400" />}
          />
        </div>
      </div>

      <div className="flex flex-col gap-16 p-6 pb-40 max-w-7xl mx-auto w-full mt-8">
        {/* =====================================================================================
            SECTION 1: EXECUTIVE SUMMARY
           ===================================================================================== */}
        <section id="executive" className="scroll-mt-32 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Executive Summary
            </h2>
            <p className="text-slate-400">
              High-level overview of the security posture and risk assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Score Card */}
            <Card className="lg:col-span-1 bg-[#0B0C15] border border-white/10 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              <CardContent className="p-8 text-center">
                <div className="relative inline-flex items-center justify-center mb-4">
                  {/* Animated Rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rotate-45" />

                  <div
                    className={cn(
                      "h-32 w-32 rounded-full border-8 flex items-center justify-center bg-[#0B0C15] relative z-10",
                      getRiskColorBorder(riskScore),
                    )}
                  >
                    <div className="text-center">
                      <span className="text-5xl font-bold text-white block">
                        {riskScore}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">
                        Risk Score
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-1">
                  {riskLevel} Risk
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated based on CVSS severity and asset exposure.
                </p>
              </CardContent>
            </Card>

            {/* Summary Text & Counts */}
            <Card className="lg:col-span-2 bg-[#0B0C15] border border-white/10">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-base text-slate-200 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-400" /> Assessment
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-sm text-slate-300 leading-relaxed font-light">
                  {execSummary ||
                    "The automated assessment has concluded. Review the findings below for specific vulnerabilities and remediation steps."}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatBox
                    label="Critical"
                    count={summary.critical || 0}
                    color="red"
                  />
                  <StatBox
                    label="High"
                    count={summary.high || 0}
                    color="orange"
                  />
                  <StatBox
                    label="Medium"
                    count={summary.medium || 0}
                    color="yellow"
                  />
                  <StatBox
                    label="Low/Info"
                    count={(summary.low || 0) + (summary.info || 0)}
                    color="blue"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* =====================================================================================
            SECTION 2: DETAILED FINDINGS
           ===================================================================================== */}
        <section id="findings" className="scroll-mt-32 space-y-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Detailed Findings
              </h2>
              <Badge
                variant="outline"
                className="border-white/10 text-slate-400"
              >
                Total Issues: {findings.length}
              </Badge>
            </div>
            <p className="text-slate-400 text-sm">
              Technical breakdown of discovered vulnerabilities, evidence, and
              remediation.
            </p>
          </div>

          <div className="grid gap-6">
            {findings.length > 0 ? (
              findings.map((finding: any, idx: number) => (
                <div
                  key={idx}
                  className="group rounded-xl border border-white/10 bg-[#0B0C15] overflow-hidden hover:border-white/20 transition-all shadow-sm"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-4 justify-between items-start">
                    <div className="flex gap-4">
                      <SeverityIcon severity={finding.severity} />
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {finding.title}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="bg-white/5 hover:bg-white/10 text-slate-400 border-0 text-[10px]"
                          >
                            {finding.category}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-white/5 hover:bg-white/10 text-slate-400 border-0 text-[10px]"
                          >
                            ID: {finding.id}
                          </Badge>
                          {finding.tags?.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-indigo-500/20 text-indigo-400 text-[10px]"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Confidence
                      </div>
                      <ConfidenceBar score={finding.confidence} />
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Description
                        </h5>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {finding.description}
                        </p>
                      </div>

                      {/* Evidence Block (Dynamic rendering of nested objects) */}
                      {finding.evidence && (
                        <div className="rounded-lg bg-[#05060A] border border-white/10 overflow-hidden">
                          <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-xs font-mono text-slate-400 flex items-center gap-2">
                            <Terminal className="w-3 h-3" /> Technical Evidence
                          </div>
                          <div className="p-4 font-mono text-xs text-emerald-400/90 overflow-x-auto">
                            <RecursiveEvidence data={finding.evidence} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6">
                      <div>
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Affected Asset
                        </h5>
                        <div className="flex items-center gap-2 text-sm text-white bg-white/5 p-2 rounded border border-white/5">
                          <Target className="w-4 h-4 text-indigo-400" />
                          <span className="truncate">
                            {finding.affected_asset}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Detection Source
                        </h5>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Crosshair className="w-4 h-4 text-slate-500" />
                          {finding.source_tool || "Composite Engine"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">
                  Clean Scan Result
                </h3>
                <p className="text-slate-500 mt-2">
                  No significant vulnerabilities were identified during this
                  assessment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================================================
            SECTION 3: METHODOLOGY & SCOPE
           ===================================================================================== */}
        <section id="methodology" className="scroll-mt-32 space-y-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Scope & Methodology
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scan Configuration */}
            <Card className="bg-[#0B0C15] border border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Configuration Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ConfigRow label="Target Scope" value={meta.target} />
                  <ConfigRow
                    label="Scan Profile"
                    value={meta.parameters?.scan_level || "Standard"}
                  />
                  <ConfigRow
                    label="CVE Checks"
                    value={meta.parameters?.enable_cve ? "Enabled" : "Disabled"}
                  />
                  <ConfigRow
                    label="CMS Detection"
                    value={meta.parameters?.cms_scan || "Auto"}
                  />
                  <ConfigRow
                    label="Execution Time"
                    value={`${new Date(meta.started_at).toLocaleString()} - ${new Date(meta.completed_at).toLocaleString()}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tool Chain */}
            <Card className="bg-[#0B0C15] border border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Execution Chain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {coverage.tools_executed?.map((tool: string) => (
                    <div
                      key={tool}
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs text-indigo-300 uppercase font-mono tracking-wide"
                    >
                      <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                      {tool}
                    </div>
                  ))}
                  {coverage.tools_skipped?.map((tool: string) => (
                    <div
                      key={tool}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-white/5 rounded text-xs text-slate-500 uppercase font-mono tracking-wide line-through decoration-slate-600"
                    >
                      {tool}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-xs text-slate-500">
                  The platform orchestrated the above tools sequentially to
                  validate findings and reduce false positives.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* =====================================================================================
            SECTION 4: AI ANALYSIS
           ===================================================================================== */}
        {/* --- SECTION: AI ANALYSIS --- */}
        <section id="ai" className="scroll-mt-32 space-y-8">
          <Card className="bg-[#0B0C15] border-indigo-500/30 shadow-[0_0_100px_rgba(79,70,229,0.1)] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-40 bg-indigo-600/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />

            <CardHeader className="border-b border-white/5 bg-indigo-500/5 py-6 px-8 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-indigo-300 text-lg font-medium">
                <Sparkles className="h-5 w-5 text-indigo-400 fill-indigo-400/20" />
                Pentellia Intelligent Analysis
              </CardTitle>
              {aiSummary && (
                <Badge
                  variant="outline"
                  className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10"
                >
                  AI Generated
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-8">
              {aiSummary ? (
                <div className="animate-in fade-in duration-700">
                  <ReactMarkdown
                    components={{
                      // Style Headings (##)
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-lg font-bold text-white mt-6 mb-3 flex items-center gap-2 border-l-2 border-indigo-500 pl-3"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="text-base font-semibold text-indigo-200 mt-4 mb-2"
                          {...props}
                        />
                      ),
                      // Style Bold Text (**)
                      strong: ({ node, ...props }) => (
                        <span
                          className="font-bold text-indigo-400"
                          {...props}
                        />
                      ),
                      // Style Lists
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-none space-y-2 my-3 pl-1"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="flex items-start gap-2 relative pl-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span>{props.children}</span>
                        </li>
                      ),
                      // Style Code Blocks
                      code: ({ node, ...props }: any) => (
                        <code
                          className="bg-black/50 border border-white/10 rounded px-1.5 py-0.5 font-mono text-xs text-orange-300"
                          {...props}
                        />
                      ),
                      // Style Horizontal Rules (---)
                      hr: ({ node, ...props }) => (
                        <hr className="border-white/10 my-6" {...props} />
                      ),
                      // Style Blockquotes
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-indigo-500/30 bg-indigo-500/5 p-4 rounded-r my-4 italic text-slate-400"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {aiSummary}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 opacity-50 hover:opacity-80 transition-opacity">
                  <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                    <Terminal className="h-8 w-8 text-slate-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-300 font-medium">
                      Analysis Pending
                    </p>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                      Click the "AI Insight" button in the header to generate a
                      comprehensive remediation plan.
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

// --- SUB COMPONENTS & HELPERS ---

function NavButton({ label, onClick, active, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center px-6 h-10 rounded-full text-sm font-medium transition-all gap-2 whitespace-nowrap border",
        active
          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
          : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
      )}
    >
      {icon} {label}
    </button>
  );
}

function StatBox({ label, count, color }: any) {
  const colors: any = {
    red: "text-red-400 border-red-500/20 bg-red-500/5",
    orange: "text-orange-400 border-orange-500/20 bg-orange-500/5",
    yellow: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  };
  return (
    <div
      className={cn(
        "p-4 rounded-lg border flex flex-col items-center justify-center",
        colors[color],
      )}
    >
      <span className="text-2xl font-bold">{count}</span>
      <span className="text-[10px] uppercase tracking-wider opacity-80">
        {label}
      </span>
    </div>
  );
}

function ConfigRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200 font-mono truncate max-w-[200px]">
        {value}
      </span>
    </div>
  );
}

function SeverityIcon({ severity }: { severity: string }) {
  const s = severity?.toLowerCase();
  if (s === "critical")
    return (
      <div className="h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>
    );
  if (s === "high")
    return (
      <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
      </div>
    );
  if (s === "medium")
    return (
      <div className="h-10 w-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
      </div>
    );
  return (
    <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
      <Info className="w-5 h-5 text-blue-500" />
    </div>
  );
}

function getRiskColorBorder(score: number) {
  if (score >= 80) return "border-red-500";
  if (score >= 50) return "border-orange-500";
  if (score >= 20) return "border-yellow-500";
  return "border-blue-500";
}

function ConfidenceBar({ score }: { score: number }) {
  // Score 0 to 1
  const percentage = Math.round((score || 0) * 100);
  let color = "bg-blue-500";
  if (percentage > 80) color = "bg-emerald-500";
  else if (percentage < 50) color = "bg-yellow-500";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 font-mono">{percentage}%</span>
    </div>
  );
}

// Recursive component to render JSON evidence cleanly
function RecursiveEvidence({ data }: { data: any }) {
  if (typeof data !== "object" || data === null) {
    return <span>{String(data)}</span>;
  }

  return (
    <ul className="pl-2 border-l border-white/10 space-y-1 my-1">
      {Object.entries(data).map(([key, value], i) => (
        <li key={i} className="flex flex-col sm:flex-row sm:gap-2 items-start">
          <span className="text-indigo-300 shrink-0">{key}:</span>
          <span className="text-slate-400 break-all">
            {typeof value === "object" ? (
              <RecursiveEvidence data={value} />
            ) : (
              String(value)
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
