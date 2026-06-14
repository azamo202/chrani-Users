"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  to: string;
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  onClick?: () => void;
  children: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode);
}

/**
 * NavLink — mirrors React Router's NavLink behaviour using Next.js usePathname.
 *
 * Props:
 *  - to       — the href destination
 *  - end      — if true, only active when the path matches exactly (not prefix)
 *  - className — string or render-prop function receiving { isActive }
 *  - children  — ReactNode or render-prop function receiving { isActive }
 */
export const NavLink = ({ to, end = false, className, onClick, children }: NavLinkProps) => {
  const pathname = usePathname();

  const isActive = end
    ? pathname === to || pathname === `${to}/`
    : pathname === to || pathname.startsWith(`${to}/`);

  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  const resolvedChildren =
    typeof children === "function" ? children({ isActive }) : children;

  return (
    <Link href={to} className={resolvedClassName} onClick={onClick}>
      {resolvedChildren}
    </Link>
  );
};
