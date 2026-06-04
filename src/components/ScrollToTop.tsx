"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Force the browser to scroll to the top of the page instantly on navigation.
    // We use try-catch and standard window.scrollTo to ensure maximum compatibility.
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as any, // "instant" bypasses any CSS smooth scroll rules
      });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
