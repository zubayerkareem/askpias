import type { LucideIcon } from "lucide-react";
import { BarChart3, Code2, PenTool, Rocket } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  code: Code2,
  pen: PenTool,
  chart: BarChart3,
};

export function projectIcon(name: string | null | undefined): LucideIcon {
  return (name && icons[name]) || Rocket;
}
