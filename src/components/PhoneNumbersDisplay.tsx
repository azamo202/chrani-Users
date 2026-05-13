"use client";

import { PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhoneNumbersDisplayProps {
  phone?: string | string[];
  className?: string;
  chipClassName?: string;
}

export const PhoneNumbersDisplay = ({ phone, className, chipClassName }: PhoneNumbersDisplayProps) => {
  if (!phone) return null;

  const numbers = Array.isArray(phone) ? phone : [phone];
  if (numbers.length === 0 || (numbers.length === 1 && !numbers[0])) return null;

  const getNetworkStyle = (num: string) => {
    const cleanNum = num.replace(/\s/g, "");
    if (cleanNum.startsWith("077") || cleanNum.startsWith("+96477")) {
      return "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400";
    }
    if (cleanNum.startsWith("078") || cleanNum.startsWith("+96478")) {
      return "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-900/30 dark:bg-orange-900/20 dark:text-orange-400";
    }
    if (cleanNum.startsWith("075") || cleanNum.startsWith("+96475")) {
      return "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400";
    }
    return "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10";
  };

  const getNetworkName = (num: string) => {
    const cleanNum = num.replace(/\s/g, "");
    if (cleanNum.startsWith("077") || cleanNum.startsWith("+96477")) return "Asiacell";
    if (cleanNum.startsWith("078") || cleanNum.startsWith("+96478")) return "Zain";
    if (cleanNum.startsWith("075") || cleanNum.startsWith("+96475")) return "Korek";
    return "";
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {numbers.filter(Boolean).map((num, idx) => {
        const cleanNum = num.replace(/\s/g, "");
        const style = getNetworkStyle(cleanNum);
        const network = getNetworkName(cleanNum);

        return (
          <a
            key={idx}
            href={`tel:${cleanNum}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              style,
              chipClassName
            )}
            aria-label={`Call ${network ? network + " " : ""}${num}`}
            title={network ? `${network} Network` : "Call"}
          >
            <PhoneCall className="h-3.5 w-3.5 flex-shrink-0" />
            <span dir="ltr" className="tracking-wide">{num}</span>
          </a>
        );
      })}
    </div>
  );
};
