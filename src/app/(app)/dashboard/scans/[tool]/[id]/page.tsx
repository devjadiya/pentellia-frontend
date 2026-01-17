"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Download,
  Target,
  Shield,
  Layers,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  StopCircle,
  Terminal,
  Sparkles,
  Bot,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import { CloudScanReport } from "@/lib/CloudScanReport"; // Adjust path
// --- Import Specialized Reports ---
// Ensure these paths exist in your project
import {
  Wafw00fReport,
  NmapReport,
  NucleiReport,
  DirbReport,
} from "@/lib/scan-reports";
import { NetworkScanReport } from "@/lib/NetworkScanReport";
import { WebScanReport } from "@/lib/WebScanReport";

// --- Types ---
interface ScanResult {
  id: string;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  target: string;
  tool_name: string;
  created_at: string;
  completed_at?: string;
  result?: any;
}

// ----------------------------------------------------------------------
// PDF GENERATOR LOGIC
// ----------------------------------------------------------------------

const loadImage = (
  url: string
): Promise<{ data: string; w: number; h: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const maxWidth = 300;
      const scaleFactor = maxWidth / img.width;
      const newWidth = maxWidth;
      const newHeight = img.height * scaleFactor;
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, newWidth, newHeight);
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      resolve({
        data: canvas.toDataURL("image/png"),
        w: newWidth,
        h: newHeight,
      });
    };
    img.onerror = () => resolve({ data: "", w: 0, h: 0 });
  });
};

const generateAndSavePDF = async (scan: any) => {
  const doc = new jsPDF({ compress: true });
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const maxLineWidth = pageWidth - margin * 2;

  const PRIMARY_COLOR = "#7c3aed";
  const SECONDARY_COLOR = "#4c1d95";
  const TEXT_DARK = "#1f2937";
  const TEXT_LIGHT = "#6b7280";

  // Header Background
  doc.setFillColor(245, 243, 255);
  doc.rect(0, 0, pageWidth, 50, "F");

  // Logo
  try {
    const logo = await loadImage("https://pentellia.vercel.app/full-logo.png");
    if (logo.data) {
      const pdfLogoWidth = 40;
      const pdfLogoHeight = (logo.h / logo.w) * pdfLogoWidth;
      doc.addImage(logo.data, "PNG", margin, 12, pdfLogoWidth, pdfLogoHeight);
    }
  } catch (e) {
    console.warn("Logo failed");
  }

  // Header Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(PRIMARY_COLOR);
  doc.text("SECURITY ASSESSMENT", pageWidth - margin, 20, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_LIGHT);
  doc.text("CONFIDENTIAL REPORT", pageWidth - margin, 26, { align: "right" });

  // Client Info
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  doc.text("Client Organization:", margin, 38);
  doc.setFont("helvetica", "bold");
  doc.text("EncodersPro", margin, 43);

  // Date
  doc.setFont("helvetica", "normal");
  doc.text("Date Generated:", pageWidth - margin - 40, 38);
  doc.setFont("helvetica", "bold");
  doc.text(new Date().toLocaleDateString(), pageWidth - margin - 40, 43);

  doc.setDrawColor(PRIMARY_COLOR);
  doc.setLineWidth(0.5);
  doc.line(0, 50, pageWidth, 50);

  // Overview
  let currentY = 70;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(SECONDARY_COLOR);
  doc.text("Assessment Overview", margin, currentY);
  currentY += 8;

  // Overview Box
  doc.setFillColor(252, 252, 252);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(margin, currentY, maxLineWidth, 35, 3, 3, "FD");

  const col1 = margin + 5;
  const col2 = margin + 90;
  const row1 = currentY + 10;
  const row2 = currentY + 22;

  doc.setFontSize(9);
  doc.setTextColor(TEXT_LIGHT);
  doc.setFont("helvetica", "normal");
  doc.text("Target Asset:", col1, row1);
  doc.text("Tool Used:", col1, row2);
  doc.text("Scan ID:", col2, row1);
  doc.text("Status:", col2, row2);

  doc.setTextColor(TEXT_DARK);
  doc.setFont("helvetica", "bold");
  const shortId = scan.id
    ? scan.id.length > 25
      ? scan.id.substring(0, 25) + "..."
      : scan.id
    : "N/A";
  doc.text(scan.target || "N/A", col1 + 25, row1);
  doc.text(scan.tool_name || "Custom Scan", col1 + 25, row2);
  doc.text(shortId, col2 + 15, row1);
  doc.text("Completed", col2 + 15, row2);

  currentY += 50;

  // Findings
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(SECONDARY_COLOR);
  doc.text("Technical Findings (Raw Data)", margin, currentY);
  currentY += 10;

  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  const jsonString = JSON.stringify(scan.result, null, 2);
  const splitText = doc.splitTextToSize(jsonString, maxLineWidth);
  doc.text(splitText, margin, currentY);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "Pentellia Security Platform | EncodersPro Confidential",
      margin,
      pageHeight - 10
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  return doc;
};

// ----------------------------------------------------------------------
// MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function ScanReportPage() {
  const params = useParams();
  const scanId = params.id as string;
  const toolSlug = params.tool as string;

  const [scan, setScan] = useState<ScanResult | null>(null);
  const [polling, setPolling] = useState(true);
  const [progress, setProgress] = useState(0);
  const [aiSummary, setAiSummary] = useState("");
  // --- Fetch & Polling Logic ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchScanStatus = async () => {
      try {
        // Ensure this API endpoint exists and returns { success: true, scan: ... }
        const res = await fetch(`/api/dashboard/scans/${scanId}`);
        const data = await res.json();

        if (data.success) {
          setScan(data.scan);

          if (data.scan.status === "running") {
            setProgress((prev) =>
              prev < 90 ? prev + Math.random() * 5 : prev
            );
          } else if (data.scan.status === "completed") {
            setProgress(100);
            setPolling(false);
          } else if (["failed", "cancelled"].includes(data.scan.status)) {
            setPolling(false);
          }
        } else {
          setPolling(false);
          toast.error(data.error || "Scan not found");
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    };

    if (scanId) fetchScanStatus();
    if (polling && scanId) intervalId = setInterval(fetchScanStatus, 3000);

    return () => clearInterval(intervalId);
  }, [scanId, polling]);

  // --- Export Handler ---
  const handleExport = async () => {
    if (!scan) return;
    const toastId = toast.loading("Generating PDF Report...");

    try {
      const doc = await generateAndSavePDF(scan);

      // Option A: Save Directly to User
      doc.save(`EncodersPro_Report_${scan.id.slice(0, 8)}.pdf`);
      toast.success("Report Downloaded", { id: toastId });

      const pdfBlob = doc.output("blob");
      const formData = new FormData();
      formData.append("pdf", pdfBlob, `EncodersPro_Report_${scan.id}.pdf`);
      formData.append("scanId", scan.id);
      await fetch("/api/dashboard/reports", { method: "POST", body: formData });
    } catch (error) {
      console.error(error);
      toast.error("Export Failed", { id: toastId });
    }
  };

  if (!scan) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center text-slate-500">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full" />
          <p>Retrieving scan data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] font-sans text-slate-200 overflow-y-auto custom-scrollbar  space-y-6">
      <ScanHeader
        scan={scan}
        onExport={handleExport}
        aiSummary={aiSummary}
        setAiSummary={setAiSummary}
      />

      {scan.status === "running" || scan.status === "queued" ? (
        <RunningStateView scan={scan} progress={progress} />
      ) : (
        <CompletedReportView
          scan={scan}
          toolSlug={toolSlug}
          aiSummary={aiSummary}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// HEADER COMPONENT (Contains AI Logic)
// ----------------------------------------------------------------------

function ScanHeader({
  scan,
  onExport,
  setAiSummary,
  aiSummary,
}: {
  scan: ScanResult;
  setAiSummary: (summary: string) => void;
  aiSummary: string;
  onExport: () => void;
}) {
  const router = useRouter();

  const [aiLoading, setAiLoading] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const handleAiSummarize = async () => {
    setAiLoading(true);
    setAiSummary("");

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName: scan.tool_name,
          scanData: scan.result,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setAiSummary(data.summary);
      } else {
        toast.error("AI Analysis Failed: " + data.error);
        setIsAiOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reach AI service");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Top Nav Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="pl-0 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <span>/</span>
          <span className="text-slate-300 font-mono text-xs">
            ID: {scan.id.slice(0, 8)}...
          </span>
        </div>

        <div className="flex gap-3">
          {/* AI MODAL TRIGGER */}
          <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleAiSummarize}
                className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all hover:scale-105"
              >
                <Sparkles className="mr-2 h-4 w-4 text-indigo-200" />
                AI Insight
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-[#0B0C15] border border-white/10 text-slate-200 max-w-2xl sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl text-white border-b border-white/10 pb-4">
                  <Bot className="h-6 w-6 text-indigo-400" />
                  AI Security Analysis
                </DialogTitle>
              </DialogHeader>

              <div className="min-h-[300px] mt-4">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4 animate-pulse">
                    <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-indigo-400 animate-spin" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">
                      Analyzing attack vectors with Pentellia Co-Pilot...
                    </p>
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" />
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce delay-100" />
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce delay-200" />
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                      <ReactMarkdown
                        components={{
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-indigo-400 text-lg font-semibold mt-6 mb-3 border-l-4 border-indigo-500 pl-3"
                              {...props}
                            />
                          ),
                          strong: ({ node, ...props }) => (
                            <span className="text-white font-bold" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc pl-5 space-y-2 my-2 marker:text-indigo-500"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="text-slate-300" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="leading-relaxed mb-4" {...props} />
                          ),
                        }}
                      >
                        {aiSummary}
                      </ReactMarkdown>
                    </div>
                  </ScrollArea>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={onExport}
            className="border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Main Info Banner */}
      <div className="flex items-start justify-between bg-[#0B0C15] border border-white/10 p-6 rounded-xl shadow-lg">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {scan.tool_name || "Security"} Report
          </h1>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Target className="h-4 w-4" />
            <span>Target:</span>
            <span className="font-mono text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded">
              {scan.target}
            </span>
          </div>
        </div>
        <StatusBadge status={scan.status} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// VIEW: RUNNING STATE
// ----------------------------------------------------------------------

function RunningStateView({
  scan,
  progress,
}: {
  scan: ScanResult;
  progress: number;
}) {
  const [logsOpen, setLogsOpen] = useState(true);

  return (
    <div className="space-y-6 p-6">
      {/* Progress Card */}
      <div className="bg-[#0B0C15] border border-white/10 rounded-xl p-8 shadow-lg">
        <div className="flex justify-between items-end mb-2">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-white">
              Scan in progress...
            </h3>
            <p className="text-sm text-slate-400">
              Enumerating target assets and identifying vulnerabilities.
            </p>
          </div>
          <span className="text-2xl font-bold text-violet-400">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-violet-600 transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/5">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-slate-400 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Rescan
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
          >
            <StopCircle className="h-4 w-4 mr-2" /> Stop Scan
          </Button>
        </div>
      </div>

      {/* Logs Accordion */}
      <div className="border border-white/10 rounded-xl bg-[#0B0C15] overflow-hidden">
        <button
          onClick={() => setLogsOpen(!logsOpen)}
          className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Terminal className="h-4 w-4 text-slate-500" /> Scan Logs
          </span>
          {logsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {logsOpen && (
          <div className="p-4 bg-black/50 font-mono text-xs text-slate-400 h-48 overflow-y-auto space-y-1">
            <div className="text-emerald-500/80">
              [+] Initializing engine...
            </div>
            <div>[*] Target: {scan.target}</div>
            <div>[*] Checking connectivity... OK</div>
            <div className="text-yellow-500/80">
              [!] Starting enumeration phase...
            </div>
            <div className="animate-pulse">_</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// VIEW: COMPLETED STATE
// ----------------------------------------------------------------------

function CompletedReportView({
  scan,
  toolSlug,
  aiSummary,
}: {
  aiSummary?: string;
  scan: ScanResult;
  toolSlug: string;
}) {
  const toolKey = (toolSlug || scan.tool_name || "").toLowerCase();
  const duration = scan.completed_at ? "Completed" : "-";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 ">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        <InfoCard
          label="Tool Module"
          value={scan.tool_name || toolSlug}
          icon={Shield}
        />
        <InfoCard label="Duration" value={duration} icon={Clock} />
        <InfoCard
          label="Date"
          value={new Date(scan.created_at).toLocaleDateString()}
          icon={Calendar}
        />
        <InfoCard
          label="Result Size"
          value={
            JSON.stringify(scan.result).length > 1000 ? "Large" : "Standard"
          }
          icon={Layers}
        />
      </div>

      <div className="min-h-[400px]">
        {/* ADD THIS CHECK FOR CLOUDSCAN */}
        {toolKey.includes("cloudscan") ? (
          <CloudScanReport data={scan.result} aiSummary={aiSummary} />
        ) : toolKey.includes("networkscan") ? (
          <NetworkScanReport data={{ data: scan.result }} />
        ) : toolKey.includes("waf") ? (
          <Wafw00fReport data={{ data: scan.result }} />
        ) : toolKey.includes("webscan") ? (
          <WebScanReport data={{ data: scan.result }} />
        ) : (
          // ... rest of checks
          <GenericJSONReport data={scan.result} />
        )}
      </div>

      {/* <div className="border-t border-white/10 pt-8">
        <details className="group">
          <summary className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer hover:text-white list-none select-none transition-colors">
            <FileText className="h-4 w-4" /> View Raw Result Data
            <ChevronDown className="h-3 w-3 group-open:rotate-180 transition-transform" />
          </summary>
          <pre className="mt-4 p-4 bg-black rounded-lg border border-white/10 text-xs font-mono text-emerald-500/80 overflow-auto max-h-[400px] shadow-inner whitespace-pre-wrap break-all">
            {JSON.stringify(scan.result, null, 2)}
          </pre>
        </details>
      </div> */}
    </div>
  );
}

// ----------------------------------------------------------------------
// HELPERS & GENERIC COMPONENTS
// ----------------------------------------------------------------------

function GenericJSONReport({ data }: { data: any }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B0C15] p-8 text-center border-dashed">
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
          <FileText className="h-6 w-6 text-slate-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Standard Report View</h3>
          <p className="text-sm text-slate-500">
            No specialized parser available.
          </p>
        </div>
      </div>
      <div className="text-left">
        <pre className="bg-black/50 p-4 rounded-lg border border-white/5 text-xs font-mono text-slate-300 overflow-auto max-h-[500px] whitespace-pre-wrap break-all">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="p-4 rounded-xl bg-[#0B0C15] border border-white/10 flex items-center gap-4 shadow-sm">
      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
        <p className="text-sm text-white font-semibold truncate" title={value}>
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    running: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
    queued: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };
  return (
    <Badge
      variant="outline"
      className={cn("capitalize px-3 py-1", styles[status] || styles.queued)}
    >
      {status === "running" && (
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-current animate-pulse" />
      )}
      {status}
    </Badge>
  );
}
