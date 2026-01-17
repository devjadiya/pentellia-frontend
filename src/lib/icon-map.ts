import {
  ShieldAlert,
  Network,
  Zap,
  FolderSearch,
  Code2,
  Bug,
  Radar,
  Lock,
  Globe,
  Scan,
  LayoutTemplate,
  Share2,
  Cloud,
  KeyRound,
  Cpu,
  Search,
  Terminal,
} from "lucide-react";

export const iconMap: Record<string, any> = {
  // --- Core / Top-Level Scanners ---
  webscan: Globe,
  networkscan: Network,
  cloudscan: Cloud,

  // --- Specific Tools ---
  wafw00f: ShieldAlert,
  nmap: Network,
  nuclei: Zap,
  dirb: FolderSearch,
  whatweb: Code2,
  nikto: Bug,
  masscan: Radar,
  sslscan: Lock,
  httpx: Globe,
  gvm: Scan,
  domainfinder: Search,
  cloudscanner: Cloud, // Kept for backward compatibility if needed
  passwordauditor: KeyRound,
  drupalscanner: LayoutTemplate,
  joomlascanner: Cpu,
  sharepointscanner: Share2,

  // Fallback
  default: Terminal,
};

export const getIcon = (id: string) => {
  // Handle case-insensitivity just in case
  const key = id?.toLowerCase() || "default";
  return iconMap[key] || iconMap.default;
};
