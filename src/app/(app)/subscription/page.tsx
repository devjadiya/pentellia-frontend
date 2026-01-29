"use client";

import React, { useState } from "react";
import {
  Check,
  Zap,
  Shield,
  Globe,
  Server,
  Building2,
  ArrowRight,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- Configuration ---
const PLANS = [
  {
    id: "free",
    name: "Community",
    description: "Basic security hygiene for individuals and students.",
    price: { monthly: 0, yearly: 0 },
    assets: 1,
    features: [
      "Lightweight Port Scanning",
      "Basic Asset Discovery",
      "Manual Scan Triggers",
      "Community Support",
      "7-Day Log Retention",
    ],
    popular: false,
    icon: Box,
    color: "slate",
    cta: "Get Started Free",
  },
  {
    id: "starter",
    name: "Essentials", // Renamed from NetSec
    description: "Automated vulnerability monitoring for growing startups.",
    price: { monthly: 9014, yearly: 6310 },
    assets: 5,
    features: [
      "Everything in Community",
      "Network Vulnerability Scans",
      "15,000+ CVEs Database",
      "Cloud Config Review",
      "PDF Report Exports",
    ],
    popular: false,
    icon: Server,
    color: "blue",
    cta: "Upgrade to Essentials",
  },
  {
    id: "pro",
    name: "Professional", // Renamed from WebNetSec
    description: "Advanced web & API security for production teams.",
    price: { monthly: 13284, yearly: 9299 },
    assets: 15,
    features: [
      "Everything in Essentials",
      "DAST (OWASP Top 10)",
      "Authenticated Web Scans",
      "API Scanning (REST/GraphQL)",
      "Priority Email Support",
    ],
    popular: true,
    icon: Globe,
    color: "violet",
    cta: "Go Professional",
  },
  {
    id: "elite",
    name: "Advanced", // Renamed from Pentest Suite
    description: "Full-scale offensive security for compliance & auditing.",
    price: { monthly: 18028, yearly: 12620 },
    assets: 50,
    features: [
      "Everything in Professional",
      "Auto-Exploitation (Sniper)",
      "SQLi & XSS Validation",
      "White-label Reports",
      "Burp Suite Integration",
    ],
    popular: false,
    icon: Shield,
    color: "amber",
    cta: "Contact Sales",
  },
];

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly"
  );

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-8 font-sans text-slate-200 overflow-y-auto custom-scrollbar p-2">
      {/* --- Header & Toggle --- */}
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Plans that scale with your threat landscape
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From individual researchers to enterprise SOCs. Secure your
            infrastructure with the right toolkit.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center gap-4 bg-[#0B0C15] border border-white/10 p-1.5 rounded-full">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              billingCycle === "monthly"
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
              billingCycle === "yearly"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-900/20"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            Yearly{" "}
            <span className="text-[10px] bg-white/20 px-1.5 rounded text-white">
              SAVE 30%
            </span>
          </button>
        </div>
      </div>

      {/* --- Pricing Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6 max-w-[1600px] mx-auto w-full px-4">
        {PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} billingCycle={billingCycle} />
        ))}
      </div>

      {/* --- Feature Comparison / Bottom Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto w-full px-4 pt-8 pb-12">
        {/* Included Features */}
        <div className="p-8 rounded-2xl bg-[#0B0C15] border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" /> Platform Standard
            Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Encrypted Data Storage",
              "Unlimited Rescans",
              "Cron Job Scheduling",
              "Real-time Slack Alerts",
              "Role-Based Access (RBAC)",
              "24/7 Knowledge Base",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm text-slate-400"
              >
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Call to Action */}
        <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-violet-900/20 to-[#0B0C15] border border-violet-500/20 flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-6 w-6 text-violet-300" />
              <h3 className="text-xl font-bold text-white">
                Need an Enterprise Audit?
              </h3>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              We offer dedicated pentesting services, custom asset limits, and
              on-premise deployment for large organizations.
            </p>
            <Button
              variant="outline"
              className="border-violet-500/50 text-violet-300 hover:bg-violet-500/10 hover:text-white"
            >
              Talk to Sales <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function PricingCard({
  plan,
  billingCycle,
}: {
  plan: any;
  billingCycle: "monthly" | "yearly";
}) {
  const isPopular = plan.popular;
  const isFree = plan.price.monthly === 0;

  const currentPrice =
    billingCycle === "yearly" ? plan.price.yearly : plan.price.monthly;

  // Color Mapping
  const colorMap: any = {
    slate: "from-white/5 to-white/5 border-white/10 hover:border-white/20",
    blue: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/50",
    violet:
      "from-violet-600/20 to-indigo-600/20 border-violet-500/30 hover:border-violet-500/60 shadow-[0_0_40px_-10px_rgba(124,58,237,0.15)]",
    amber:
      "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
  };

  const btnColor: any = {
    slate: "bg-white/10 text-white hover:bg-white/20",
    blue: "bg-blue-600 hover:bg-blue-500 text-white",
    violet:
      "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 text-white",
    amber: "bg-amber-600 hover:bg-amber-500 text-white",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col p-6 rounded-2xl border bg-gradient-to-b transition-all duration-300 group h-full",
        colorMap[plan.color],
        isPopular && "scale-[1.02] z-10 ring-1 ring-violet-500/30"
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
          Best Value
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-white/5",
            isPopular && "bg-violet-500/10"
          )}
        >
          <plan.icon
            className={cn(
              "h-6 w-6",
              isPopular ? "text-violet-400" : "text-slate-400"
            )}
          />
        </div>
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <p className="text-sm text-slate-400 mt-2 min-h-[40px]">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">
            {isFree ? "Free" : `₹${currentPrice.toLocaleString()}`}
          </span>
          {!isFree && <span className="text-sm text-slate-500">/mo</span>}
        </div>

        {billingCycle === "yearly" && !isFree ? (
          <p className="text-xs text-emerald-400 mt-1 font-medium">
            Billed ₹{(currentPrice * 12).toLocaleString()} yearly
          </p>
        ) : (
          <p className="text-xs text-slate-600 mt-1 font-medium min-h-[16px]">
            {isFree ? "Forever free" : "Billed monthly"}
          </p>
        )}

        <div className="mt-4 p-2 rounded bg-white/5 border border-white/5 text-center">
          <span className="text-xs font-semibold text-slate-300">
            {plan.assets} Active Asset{plan.assets > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 space-y-4 mb-8">
        {plan.features.map((feature: string, idx: number) => (
          <div
            key={idx}
            className="flex items-start gap-3 text-sm text-slate-300"
          >
            <div
              className={cn(
                "mt-0.5 flex items-center justify-center h-4 w-4 rounded-full shrink-0",
                isPopular
                  ? "bg-violet-500/20 text-violet-400"
                  : "bg-white/10 text-slate-400"
              )}
            >
              <Check className="h-2.5 w-2.5" />
            </div>
            <span className="leading-tight">{feature}</span>
          </div>
        ))}
      </div>

      {/* Action */}
      <Button
        className={cn(
          "w-full border-0 transition-all font-semibold",
          btnColor[plan.color]
        )}
      >
        {plan.cta}
      </Button>
    </div>
  );
}
