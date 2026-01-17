"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Globe,
  Zap,
  FileText,
  Menu,
  Terminal,
  Crosshair,
  Lock,
  Server,
  Cpu,
  ScanEye,
  Workflow,
  Activity,
  Code2,
  Bug,
  Radar,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// --- CSS INSTRUCTION ---
// Ensure you have this animation in your tailwind.config.ts or globals.css:
// @keyframes marquee {
//   0% { transform: translateX(0); }
//   100% { transform: translateX(-50%); }
// }
// .animate-marquee {
//   animation: marquee 30s linear infinite;
// }

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* --- BACKGROUND FX --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, transparent 20%, black 90%)",
          }}
        />
        <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 blur-[120px] rounded-full opacity-40" />
        <div className="absolute bottom-0 right-1/3 translate-x-1/2 w-[600px] h-[600px] bg-cyan-600/20 blur-[100px] rounded-full opacity-30" />
      </div>

      {/* --- 1. TALL NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#02040a]/80 backdrop-blur-xl h-36 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="Pentellia Logo"
              className="w-[140px] object-contain"
            />
          </div>

          <div className="hidden lg:flex items-center gap-10 text-sm font-medium tracking-wide uppercase text-slate-400">
            <NavLink href="#platform">Platform</NavLink>
            <NavLink href="#features">Capabilities</NavLink>
            <NavLink href="#workflow">Workflow</NavLink>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="hidden md:block text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors tracking-wide uppercase"
            >
              Terminal Login
            </Link>
            <Button
              asChild
              className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(8,145,178,0.4)] border border-cyan-400/50 rounded-none px-6 h-10 tracking-wider uppercase"
            >
              <Link href="/signup">Initialize Scan</Link>
            </Button>
            <button className="lg:hidden text-slate-400 hover:text-cyan-400">
              <Menu className="h-8 w-8" />
            </button>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section id="platform" className="relative pt-48 pb-32 z-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-300 mb-8 animate-pulse">
            <Terminal className="h-4 w-4" />
            <span className="text-xs font-mono uppercase tracking-widest">
              System Ready // v2.0.45
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-none uppercase outline-text-cyan">
            Offensive
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 filter drop-shadow-[0_0_10px_rgba(8,145,178,0.5)]">
              Intelligence
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Consolidate your entire red-team arsenal. Automate reconnaissance,
            prioritize vulnerability scanning, and execute safe exploitation
            from a single, unified command center.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              size="lg"
              asChild
              className="h-14 px-10 bg-cyan-500 text-black hover:bg-cyan-400 font-bold text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)] rounded-none tracking-widest uppercase w-full sm:w-auto"
            >
              <Link href="/signup">
                <ScanEye className="mr-2 h-5 w-5" /> Deploy Scanner
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-10 border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 hover:text-indigo-300 text-white rounded-none tracking-widest uppercase w-full sm:w-auto font-semibold"
            >
              <Link href="/signup">View Architecture</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- 3. TOOLS DATA STREAM (ANIMATED & LOOPING) --- */}
      <section className="border-y border-white/5 bg-[#010205] relative overflow-hidden z-10">
        {/* Scanline effect overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_2px,#000_2px)] bg-[size:100%_4px] opacity-20 pointer-events-none z-20"></div>

        <div className="py-6 relative flex w-full">
          {/* Container for the scrolling content. 
            'animate-marquee' moves this container left.
            We pause animation on hover.
          */}
          <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
            {/* FIRST SET OF TOOLS */}
            <div className="flex gap-0">
              <ToolStreamItem label="NMAP ENGINE" status="ONLINE" />
              <ToolStreamItem label="NUCLEI VULN SCAN" status="ACTIVE" />
              <ToolStreamItem label="WAFW00F DETECT" status="STANDBY" />
              <ToolStreamItem label="SQLMAP EXPLOIT" status="READY" />
              <ToolStreamItem label="HTTPX RECON" status="ONLINE" />
              <ToolStreamItem label="AMASS DISCOVERY" status="ACTIVE" />
              <ToolStreamItem label="ZAP PROXY" status="STANDBY" />
              <ToolStreamItem label="MASSCAN PORT" status="ONLINE" />
              <ToolStreamItem label="DIRB FOLDER" status="ACTIVE" />
              <ToolStreamItem label="NIKTO WEB" status="READY" />
            </div>

            {/* DUPLICATE SET (REQUIRED FOR SEAMLESS LOOP) */}
            <div className="flex gap-0">
              <ToolStreamItem label="NMAP ENGINE" status="ONLINE" />
              <ToolStreamItem label="NUCLEI VULN SCAN" status="ACTIVE" />
              <ToolStreamItem label="WAFW00F DETECT" status="STANDBY" />
              <ToolStreamItem label="SQLMAP EXPLOIT" status="READY" />
              <ToolStreamItem label="HTTPX RECON" status="ONLINE" />
              <ToolStreamItem label="AMASS DISCOVERY" status="ACTIVE" />
              <ToolStreamItem label="ZAP PROXY" status="STANDBY" />
              <ToolStreamItem label="MASSCAN PORT" status="ONLINE" />
              <ToolStreamItem label="DIRB FOLDER" status="ACTIVE" />
              <ToolStreamItem label="NIKTO WEB" status="READY" />
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. CORE CAPABILITIES GRID --- */}
      <section id="features" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">
              Core Modules
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
              Full-Spectrum Attack Simulation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CyberCard
              icon={Globe}
              accentColor="cyan"
              title="Target Recon"
              desc="Map subdomains, open ports, and exposed services."
            />
            <CyberCard
              icon={Crosshair}
              accentColor="indigo"
              title="Vuln Analysis"
              desc="Detect CVEs and misconfigurations using Nuclei logic."
            />
            <CyberCard
              icon={Zap}
              accentColor="purple"
              title="Safe Exploit"
              desc="Validate SQLi and XSS without breaking production."
            />
            <CyberCard
              icon={FileText}
              accentColor="cyan"
              title="Compliance"
              desc="Instant audit-ready PDF reports with remediation."
            />
            <CyberCard
              icon={Cpu}
              accentColor="indigo"
              title="Automation"
              desc="Set recurring schedules for continuous monitoring."
            />
            <CyberCard
              icon={Shield}
              accentColor="purple"
              title="Adaptive Logic"
              desc="Updated daily with emerging threat intelligence."
            />
          </div>
        </div>
      </section>

      {/* --- 5. WORKFLOW VISUALIZATION (Animated Cards) --- */}
      <section
        id="workflow"
        className="py-32 bg-black/50 relative border-t border-white/5 z-10"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-sm font-mono text-indigo-400 uppercase tracking-[0.2em] mb-4">
            Operational Workflow
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white uppercase mb-16">
            The Attack Lifecycle
          </h3>

          <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 -translate-y-1/2 z-0"></div>

            <WorkflowStep
              number="01"
              title="Map Assets"
              icon={ScanEye}
              color="cyan"
              desc="Discovery Phase"
            />
            <WorkflowStep
              number="02"
              title="Identify Risks"
              icon={Crosshair}
              color="indigo"
              desc="Scanning Phase"
            />
            <WorkflowStep
              number="03"
              title="Validate & Exploit"
              icon={Terminal}
              color="purple"
              desc="Attack Phase"
            />
            <WorkflowStep
              number="04"
              title="Report & Remediate"
              icon={FileText}
              color="cyan"
              desc="Recovery Phase"
            />
          </div>
        </div>
      </section>

      {/* --- 6. NEW: LIVE ATTACK SIMULATION PREVIEW (Interactive Look) --- */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5 text-red-400 mb-6">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest">
                  Live Simulation Engine
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Watch the attack <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  unfold in real-time.
                </span>
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Don't just get a static PDF. Watch as Pentellia's agents attempt
                to breach your perimeter. See exactly which payloads bypass your
                WAF and which endpoints are leaking data.
              </p>

              <div className="space-y-4">
                <SimulationFeature
                  icon={Code2}
                  title="Payload Injection"
                  desc="Real-time feedback on XSS/SQLi payload success rates."
                />
                <SimulationFeature
                  icon={Bug}
                  title="Logic Flaw Detection"
                  desc="AI-driven identification of business logic vulnerabilities."
                />
                <SimulationFeature
                  icon={Radar}
                  title="Perimeter Breach"
                  desc="Visual mapping of entry points and lateral movement paths."
                />
              </div>
            </div>

            {/* Interactive Visual Element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-3xl -z-10 rounded-full" />
              <div className="rounded-xl border border-white/10 bg-[#0B0C15] p-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 animate-scanline" />

                {/* Fake Console UI */}
                <div className="bg-black/80 p-4 font-mono text-xs md:text-sm h-[400px] overflow-hidden flex flex-col gap-2">
                  <div className="text-slate-500 border-b border-white/10 pb-2 mb-2 flex justify-between">
                    <span>
                      root@pentellia:~# ./attack_sim.sh --target=production
                    </span>
                    <span className="text-emerald-500">CONNECTED</span>
                  </div>
                  <div className="text-slate-300">
                    [+] Target identified: 192.168.1.45 <br />
                    [+] Port 443 OPEN (HTTPS) <br />
                    [+] Port 80 OPEN (HTTP) <br />
                    [+] WAF Detected: Cloudflare <br />
                    <span className="text-yellow-400">
                      [!] Bypassing WAF rules set...{" "}
                    </span>{" "}
                    <span className="text-emerald-500">SUCCESS</span> <br />
                    [*] Injecting payload: ' OR 1=1 -- <br />
                    <span className="text-red-500 font-bold animate-pulse">
                      [!] CRITICAL: SQL Injection Confirmed on /login endpoint
                    </span>{" "}
                    <br />
                    [*] Dumping database schema... <br />
                    <span className="text-slate-500">
                      ... table 'users' found (145 records)
                    </span>{" "}
                    <br />
                    <span className="text-slate-500">
                      ... table 'admin_keys' found (2 records)
                    </span>{" "}
                    <br />
                    <span className="text-cyan-400">
                      [i] Generating Proof of Concept report...
                    </span>
                  </div>
                  {/* Blinking Cursor */}
                  <div className="mt-auto flex items-center gap-2">
                    <span className="text-emerald-500">➜</span>
                    <span className="h-4 w-2 bg-slate-400 animate-pulse block" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 7. CTA SECTION --- */}
      <section className="py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-xl bg-[#010205] border border-cyan-500/30 overflow-hidden p-10 text-center shadow-[0_0_50px_rgba(8,145,178,0.2)] group hover:border-cyan-500/60 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-transparent to-indigo-600/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700 filter blur-3xl pointer-events-none" />

            <Terminal className="h-12 w-12 text-cyan-400 mx-auto mb-6" />

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10 uppercase font-mono tracking-tighter">
              Initiate Security Protocol_
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto relative z-10 font-mono">
              Ready to deploy the platform? Access the complete toolset and
              secure your infrastructure.
            </p>

            <div className="flex justify-center relative z-10">
              <Button
                size="lg"
                asChild
                className="h-16 px-12 bg-cyan-500 hover:bg-cyan-400 text-black text-xl font-bold shadow-[0_0_30px_rgba(6,182,212,0.5)] rounded-none tracking-widest uppercase relative overflow-hidden group/btn"
              >
                <Link href="/signup">
                  <span className="relative z-10">Execute -&gt;</span>
                  <div className="absolute inset-0 h-full w-0 bg-white/30 transition-all duration-300 group-hover/btn:w-full mix-blend-overlay"></div>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 8. FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#010205] pt-20 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1 flex flex-col items-start">
              <img
                src="/logo.png"
                alt="Pentellia Logo"
                className="w-[140px] object-contain"
              />
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                Engineered for Offensive Security operations.
                <br />© 2026 All rights reserved.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold uppercase tracking-wider mb-2 text-sm">
                Platform
              </h4>
              <FooterLink>Vulnerability Scanner</FooterLink>
              <FooterLink>Attack Surface Recon</FooterLink>
              <FooterLink>Exploitation Engine</FooterLink>
              <FooterLink>Reporting Suite</FooterLink>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold uppercase tracking-wider mb-2 text-sm">
                Resources
              </h4>
              <FooterLink>Documentation</FooterLink>
              <FooterLink>API Reference</FooterLink>
              <FooterLink>Threat Database</FooterLink>
              <FooterLink>System Status</FooterLink>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold uppercase tracking-wider mb-2 text-sm">
                Legal & Contact
              </h4>
              <FooterLink>Privacy Policy</FooterLink>
              <FooterLink>Terms of Service</FooterLink>
              <FooterLink>Contact Support</FooterLink>
              <FooterLink>PGP Key</FooterLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB COMPONENTS ---

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="relative group py-2">
      <span className="group-hover:text-cyan-400 transition-colors">
        {children}
      </span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}

function ToolStreamItem({ label, status }: { label: string; status: string }) {
  const statusColor =
    status === "ONLINE" || status === "READY"
      ? "text-emerald-400"
      : status === "ACTIVE"
      ? "text-cyan-400"
      : "text-amber-400";
  return (
    <div className="flex items-center gap-3 mx-8 font-mono uppercase tracking-wider flex-shrink-0">
      <Server className="h-4 w-4 text-slate-500" />
      <span className="text-slate-300 font-bold">{label}</span>
      <span
        className={cn(
          "text-[10px] px-2 py-0.5 border border-white/10 bg-black/50",
          statusColor
        )}
      >
        [{status}]
      </span>
    </div>
  );
}

function CyberCard({
  icon: Icon,
  title,
  desc,
  accentColor,
}: {
  icon: any;
  title: string;
  desc: string;
  accentColor: "cyan" | "indigo" | "purple";
}) {
  const colors = {
    cyan: {
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      shadow: "hover:shadow-cyan-500/20",
      bg: "hover:bg-cyan-950/10",
    },
    indigo: {
      text: "text-indigo-400",
      border: "border-indigo-500/30",
      shadow: "hover:shadow-indigo-500/20",
      bg: "hover:bg-indigo-950/10",
    },
    purple: {
      text: "text-purple-400",
      border: "border-purple-500/30",
      shadow: "hover:shadow-purple-500/20",
      bg: "hover:bg-purple-950/10",
    },
  };
  const ac = colors[accentColor];

  return (
    <div
      className={cn(
        "group relative p-8 rounded-xl bg-[#0B0C15]/80 backdrop-blur-sm border transition-all duration-500 overflow-hidden",
        ac.border,
        ac.shadow,
        "hover:border-opacity-100 hover:scale-[1.02]"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br pointer-events-none",
          ac.bg
        )}
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          className={cn(
            "h-16 w-16 rounded-full bg-black border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg",
            ac.border,
            ac.text
          )}
        >
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed font-light">
          {desc}
        </p>
      </div>
      <div
        className={cn(
          "absolute top-0 left-0 w-2 h-2 border-t border-l opacity-50 group-hover:opacity-100 transition-opacity",
          ac.border
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-50 group-hover:opacity-100 transition-opacity",
          ac.border
        )}
      />
    </div>
  );
}

function WorkflowStep({ number, title, icon: Icon, color, desc }: any) {
  const colors = {
    cyan: "text-cyan-400 border-cyan-500/50 shadow-cyan-500/50 hover:bg-cyan-950/30",
    indigo:
      "text-indigo-400 border-indigo-500/50 shadow-indigo-500/50 hover:bg-indigo-950/30",
    purple:
      "text-purple-400 border-purple-500/50 shadow-purple-500/50 hover:bg-purple-950/30",
  };
  return (
    <div
      className={cn(
        "relative z-10 flex flex-col items-center bg-[#02040a] p-8 rounded-xl border border-white/10 w-full md:w-64 group transition-all duration-300 transform hover:-translate-y-2",
        colors[color].split(" ")[3] // Apply hover bg
      )}
    >
      <span
        className={cn(
          "text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-6 font-mono",
          colors[color].split(" ")[0]
        )}
      >
        {number}
      </span>
      <div
        className={cn(
          "h-16 w-16 rounded-xl bg-black border flex items-center justify-center mb-6 shadow-[0_0_15px_inset] group-hover:scale-110 transition-transform duration-300",
          colors[color].split(" ").slice(0, 3).join(" ")
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
      <h4 className="text-lg font-bold text-white uppercase tracking-wide mb-2">
        {title}
      </h4>
      <p className="text-xs text-slate-500 uppercase tracking-widest">{desc}</p>
    </div>
  );
}

function SimulationFeature({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-red-500/30 transition-colors">
      <div className="mt-1">
        <Icon className="h-6 w-6 text-red-400" />
      </div>
      <div>
        <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
        <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="#"
      className="text-sm text-slate-500 hover:text-cyan-400 transition-colors font-medium tracking-wide flex items-center gap-2 group"
    >
      <span className="h-px w-2 bg-slate-700 group-hover:bg-cyan-400 transition-colors"></span>
      {children}
    </Link>
  );
}
