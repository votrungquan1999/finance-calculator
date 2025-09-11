"use client";

import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarTrigger } from "src/components/ui/sidebar";

/**
 * Client component that handles active state for sidebar menu buttons
 * Accepts Link component as children and href for active state detection
 */
export function ActiveSidebarMenuButton({
  children,
  href,
  tooltip,
}: {
  children: React.ReactNode;
  href: string;
  tooltip?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuButton asChild isActive={isActive} tooltip={tooltip}>
      {children}
    </SidebarMenuButton>
  );
}

/**
 * Client component wrapper for sidebar trigger
 */
export function AppSidebarTrigger() {
  return <SidebarTrigger className="-ml-1" />;
}
