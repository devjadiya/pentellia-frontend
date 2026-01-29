"use client";

import React, { useState } from "react";
import {
  Search,
  Book,
  Terminal,
  Shield,
  MessageSquare,
  FileText,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  LifeBuoy,
  Zap,
  Server,
  Lock,
  Mail,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-8 font-sans text-slate-200 overflow-y-auto custom-scrollbar pr-4">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-indigo-400" />
            Support Center
          </h1>
          <p className="text-sm text-slate-400">
            Documentation, troubleshooting, and direct support for security
            teams.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <Input
            type="text"
            placeholder="Search documentation, error codes, or FAQs..."
            className="pl-10 bg-[#0B0C15] border-white/10 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 text-slate-200 h-10 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <span className="text-[10px] text-slate-600 border border-white/5 px-1.5 py-0.5 rounded bg-white/5">
              CMD+K
            </span>
          </div>
        </div>
      </div>

      {/* --- QUICK ACTION CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          icon={Book}
          title="Documentation"
          desc="Platform guides, tool configurations, and integration manuals."
          color="blue"
        />
        <QuickActionCard
          icon={Terminal}
          title="API Reference"
          desc="Endpoints for automated scanning and webhook integrations."
          color="purple"
        />
        <QuickActionCard
          icon={Shield}
          title="Compliance Hub"
          desc="GDPR, SOC2, and ISO 27001 mapping for generated reports."
          color="emerald"
        />
      </div>

      {/* --- MAIN CONTENT TABS --- */}
      <Tabs defaultValue="docs" className="w-full">
        <TabsList className="bg-[#0B0C15] border border-white/10 p-1 mb-6">
          <TabTrigger
            value="docs"
            label="Technical Docs"
            icon={<FileText className="h-4 w-4 mr-2" />}
          />
          <TabTrigger
            value="faqs"
            label="Common FAQs"
            icon={<MessageSquare className="h-4 w-4 mr-2" />}
          />
          <TabTrigger
            value="ciso"
            label="CISO Corner"
            icon={<Lock className="h-4 w-4 mr-2" />}
          />
          <TabTrigger
            value="status"
            label="System Status"
            icon={<Activity className="h-4 w-4 mr-2" />}
          />
        </TabsList>

        {/* --- TAB: DOCUMENTATION --- */}
        <TabsContent
          value="docs"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DocCategory title="Getting Started" icon={Zap}>
              <DocLink title="Platform Quickstart Guide" />
              <DocLink title="Verifying Domain Ownership" />
              <DocLink title="Setting up your first Scan Profile" />
            </DocCategory>

            <DocCategory title="Scan Engines" icon={Server}>
              <DocLink title="Configuring Nmap Flags" />
              <DocLink title="Nuclei Custom Templates" />
              <DocLink title="Authenticated Web Scanning" />
            </DocCategory>

            <DocCategory title="Integrations" icon={Terminal}>
              <DocLink title="Jira Ticket Automation" />
              <DocLink title="Slack/Teams Webhooks" />
              <DocLink title="CI/CD Pipeline GitHub Action" />
            </DocCategory>

            <DocCategory title="Reporting" icon={FileText}>
              <DocLink title="Understanding Risk Scores (CVSS)" />
              <DocLink title="White-labeling PDF Reports" />
              <DocLink title="Exporting Raw JSON Data" />
            </DocCategory>

            <DocCategory title="Account & Billing" icon={Lock}>
              <DocLink title="Managing Team Seats" />
              <DocLink title="SSO Configuration (SAML/OIDC)" />
              <DocLink title="Understanding Asset Limits" />
            </DocCategory>

            <DocCategory title="Troubleshooting" icon={AlertTriangle}>
              <DocLink title="Handling WAF Blocks" />
              <DocLink title="Scan Timeout Errors" />
              <DocLink title="Whitelisting Scanner IPs" />
            </DocCategory>
          </div>
        </TabsContent>

        {/* --- TAB: FAQs --- */}
        <TabsContent
          value="faqs"
          className="space-y-4 max-w-4xl animate-in fade-in slide-in-from-bottom-2"
        >
          <FAQItem
            question="How do I whitelist Pentellia scanners in my firewall?"
            answer="You can find our current list of scanner IP addresses in the 'Settings > Scanners' section. We recommend adding these to your WAF allowlist to ensure accurate results without blocking."
          />
          <FAQItem
            question="Are the scans intrusive? Will they bring down my site?"
            answer="By default, all scans run in 'Passive' or 'Standard' mode which is rate-limited to prevent DoS conditions. You can enable 'Aggressive' mode in advanced settings, but we recommend doing this only on staging environments."
          />
          <FAQItem
            question="How is the 'Security Score' calculated?"
            answer="The score is an aggregate metric based on the CVSS scores of found vulnerabilities, the presence of security headers, and open port exposure. It follows a proprietary weighted algorithm similar to industry standards."
          />
          <FAQItem
            question="Can I invite my developers to view reports?"
            answer="Yes. Go to 'Settings > Team' to invite members. You can assign them 'Read-Only' roles if you only want them to view reports and findings without launching new scans."
          />
          <FAQItem
            question="What happens if a scan fails?"
            answer="Scans usually fail due to connectivity issues or timeouts. Check if the target is reachable from the public internet. If the issue persists, contact support with the specific Scan ID."
          />
        </TabsContent>

        {/* --- TAB: CISO CORNER (High Level) --- */}
        <TabsContent
          value="ciso"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-xl p-8 mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Executive Security Posture
            </h3>
            <p className="text-slate-400 text-sm max-w-3xl">
              Resources dedicated to Chief Information Security Officers and
              Lead Analysts for high-level compliance mapping, audit trails, and
              organizational risk management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#0B0C15] border border-white/10 hover:border-indigo-500/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Shield className="h-4 w-4 text-emerald-400" /> Compliance
                  Mapping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-500 mb-4">
                  Download generated matrices mapping your latest scan findings
                  to specific regulatory controls.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between border-white/5 bg-white/[0.02] hover:bg-white/5"
                >
                  SOC2 Type II Controls{" "}
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between border-white/5 bg-white/[0.02] hover:bg-white/5"
                >
                  ISO 27001 Annex A{" "}
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between border-white/5 bg-white/[0.02] hover:bg-white/5"
                >
                  GDPR Data Protection{" "}
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#0B0C15] border border-white/10 hover:border-indigo-500/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Lock className="h-4 w-4 text-orange-400" /> Governance &
                  Audit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-500 mb-4">
                  Manage organizational risk acceptance policies and view
                  immutable audit logs of all team activities.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between border-white/5 bg-white/[0.02] hover:bg-white/5"
                >
                  View Platform Audit Logs{" "}
                  <ChevronRight className="h-3 w-3 opacity-50" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between border-white/5 bg-white/[0.02] hover:bg-white/5"
                >
                  Manage Risk Acceptance Policy{" "}
                  <ChevronRight className="h-3 w-3 opacity-50" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between border-white/5 bg-white/[0.02] hover:bg-white/5"
                >
                  Generate Executive Summary PDF{" "}
                  <ChevronRight className="h-3 w-3 opacity-50" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB: STATUS --- */}
        <TabsContent
          value="status"
          className="animate-in fade-in slide-in-from-bottom-2"
        >
          <Card className="bg-[#0B0C15] border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <h3 className="text-lg font-medium text-white">
                  All Systems Operational
                </h3>
              </div>

              <div className="space-y-4">
                <StatusItem
                  label="Scanning Engine (US-East)"
                  status="Operational"
                />
                <StatusItem
                  label="Scanning Engine (EU-West)"
                  status="Operational"
                />
                <StatusItem label="API Gateway" status="Operational" />
                <StatusItem label="Reporting Service" status="Operational" />
                <StatusItem
                  label="Notification Webhooks"
                  status="Operational"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* --- FOOTER / CONTACT --- */}
      <div className="mt-8 border-t border-white/5 pt-8 pb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0B0C15] border border-white/10 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <MessageSquare className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                Still need help?
              </h3>
              <p className="text-slate-400 text-sm max-w-md">
                Our security analysts are available 24/7 for Enterprise plans.{" "}
                <br />
                Typical response time: &lt; 2 hours.
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 border-white/10 hover:bg-white/5 text-slate-300"
            >
              <Mail className="h-4 w-4 mr-2" /> Email Support
            </Button>
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white">
              <MessageSquare className="h-4 w-4 mr-2" /> Start Live Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function QuickActionCard({ icon: Icon, title, desc, color }: any) {
  const colors: any = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50",
    purple:
      "text-purple-400 bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50",
    emerald:
      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-xl border transition-all duration-300 cursor-pointer group bg-[#0B0C15]",
        colors[color]
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-5 w-5" />
        <h3 className="font-semibold text-white group-hover:text-white/90">
          {title}
        </h3>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300">
        {desc}
      </p>
    </div>
  );
}

function TabTrigger({ value, label, icon }: any) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 flex-1"
    >
      {icon} {label}
    </TabsTrigger>
  );
}

function DocCategory({ title, icon: Icon, children }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
        <Icon className="h-4 w-4 text-slate-500" />
        {title}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function DocLink({ title }: { title: string }) {
  return (
    <a
      href="#"
      className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center justify-between group p-2 rounded hover:bg-white/[0.02]"
    >
      {title}
      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
    </a>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-lg bg-[#0B0C15] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="font-medium text-slate-200 text-sm">{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-sm text-slate-400 leading-relaxed border-t border-white/5 bg-white/[0.01]">
          {answer}
        </div>
      )}
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
        {status}
      </span>
    </div>
  );
}
