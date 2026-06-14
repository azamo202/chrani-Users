"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider, Lang } from "@/i18n/I18nProvider";
import { CompareProvider } from "@/hooks/use-compare";
import { useState } from "react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/** Singleton QueryClient with production-tuned defaults. */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Consider data fresh for 30 s — prevents redundant refetches on quick navigation.
        staleTime: 30_000,
        // Retry failed queries at most twice with exponential back-off.
        retry: 2,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
        // Keep previous data visible while new data loads (avoids loading flicker).
        placeholderData: (prev: unknown) => prev,
        // Disable refetch on window-focus for catalog data (reduces noise).
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Lang;
}) {
  // Using useState ensures we get exactly one QueryClient per browser session
  // even in React 18 Strict Mode's double-render in development.
  const [queryClient] = useState(makeQueryClient);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <I18nProvider initialLang={locale}>
          <CompareProvider>
            <TooltipProvider>
              <ScrollToTop />
              {children}
              <Toaster />
              <Sonner richColors closeButton />
            </TooltipProvider>
          </CompareProvider>
        </I18nProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
