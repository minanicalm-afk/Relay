import {
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  Check,
  ChevronDown,
  CircleCheck,
  Eye,
  Footprints,
  HandHeart,
  HeartHandshake,
  Leaf,
  MapPin,
  MonitorSmartphone,
  Recycle,
  Trees,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  Check,
  ChevronDown,
  CircleCheck,
  Eye,
  Footprints,
  HandHeart,
  HeartHandshake,
  Leaf,
  MapPin,
  MonitorSmartphone,
  Recycle,
  Trees,
  UsersRound,
  Wrench,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Component = iconMap[name] ?? Leaf;
  return <Component className={cn("h-6 w-6", className)} aria-hidden="true" />;
}
