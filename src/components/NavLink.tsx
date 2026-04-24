"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface NavLinkCompatProps extends Omit<LinkProps, "href" | "className"> {
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string);
  activeClassName?: string;
  pendingClassName?: string;
  to: string;
  end?: boolean;
  children?: React.ReactNode | ((props: { isActive: boolean; isPending: boolean }) => React.ReactNode);
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, end, children, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = end 
      ? pathname === to 
      : pathname?.startsWith(to) && (pathname === to || pathname[to.length] === '/');
    
    const isPending = false;
    const evaluatedClassName = typeof className === 'function' ? className({ isActive, isPending }) : className;
    
    return (
      <Link
        ref={ref}
        href={to}
        className={cn(evaluatedClassName, isActive && activeClassName)}
        {...props}
      >
        {typeof children === 'function' ? children({ isActive, isPending }) : children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
