import { System, SystemStatus, ControlAction, ControlLog } from "@/types/admin-system";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck,
  ShieldOff,
  ShieldAlert
} from "lucide-react";

export const statusConfig: Record<SystemStatus, {
  label: string;
  color: string;
  dotColor: string;
  bgColor: string;
  icon: React.ElementType;
}> = {
  ENABLED: {
    label: "Enabled",
    color: "text-green-600",
    dotColor: "bg-green-500",
    bgColor: "bg-green-100",
    icon: CheckCircle2,
  },
  DISABLED: {
    label: "Disabled",
    color: "text-red-600",
    dotColor: "bg-red-500",
    bgColor: "bg-red-100",
    icon: XCircle,
  },
  LIMITED: {
    label: "Limited",
    color: "text-orange-600",
    dotColor: "bg-orange-500",
    bgColor: "bg-orange-100",
    icon: AlertTriangle,
  },
};

export const actionConfig: Record<ControlAction, {
  label: string;
  color: string;
  icon: React.ElementType;
  description: string;
  warning?: string;
}> = {
  ENABLE: {
    label: "System Enabled",
    color: "text-green-600",
    icon: ShieldCheck,
    description: "Enabling this system will restore full solar power to this customer's installation.",
  },
  DISABLE: {
    label: "System Disabled",
    color: "text-red-600",
    icon: ShieldOff,
    description: "Disabling this system will completely cut off power to this customer's installation.",
    warning: "This is a severe action. The customer will immediately lose access to solar power.",
  },
  LIMIT: {
    label: "System Limited",
    color: "text-orange-600",
    icon: ShieldAlert,
    description: "Limiting this system will reduce the power output for this customer's installation to a restricted level.",
  },
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getSystemLogs = (systemId: string, logs: ControlLog[]) => {
  return logs.filter(log => log.systemId === systemId);
};

export const getStatusCount = (systems: System[], status: SystemStatus) => {
  return systems.filter(s => s.status === status).length;
};

export const filterSystems = (
  systems: System[],
  search: string,
  status: SystemStatus | "ALL"
) => {
  return systems.filter(system => {
    const matchesSearch = 
      system.customerName.toLowerCase().includes(search.toLowerCase()) ||
      system.deviceId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "ALL" || system.status === status;
    return matchesSearch && matchesStatus;
  });
};