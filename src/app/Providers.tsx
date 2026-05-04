"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider, Lang } from "@/i18n/I18nProvider";
import { CompareProvider } from "@/hooks/use-compare";
import { useState } from "react";

export function Providers({ children, locale }: { children: React.ReactNode; locale: Lang }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider initialLang={locale}>
        <CompareProvider>
          <TooltipProvider>
            {children}
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </CompareProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
