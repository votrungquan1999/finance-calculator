"use client";

import {
  Calculator,
  Home,
  TrendingUp,
  DollarSign,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "src/components/ui/sidebar";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Overview and getting started",
  },
  {
    title: "Saved Values",
    href: "/saved-values",
    icon: Bookmark,
    description: "Manage your saved financial values",
  },
  {
    title: "Declining Balance Loan",
    href: "/calculators/loan-declining",
    icon: Calculator,
    description: "Monthly interest on remaining principal",
  },
  {
    title: "Loan with Fee",
    href: "/calculators/loan-fee",
    icon: DollarSign,
    description: "Loan with initial fee calculation",
  },
  {
    title: "Annuity Loan",
    href: "/calculators/loan-annuity",
    icon: Calculator,
    description: "Equal monthly payment calculation",
  },
  {
    title: "Investment Calculator",
    href: "/calculators/investment",
    icon: TrendingUp,
    description: "Investment growth with initial amount and/or contributions",
  },
];

interface AppSidebarProps {
  children: React.ReactNode;
}

/**
 * Properly implemented shadcn sidebar with navigation for all calculator tools
 */
export function AppSidebar({ children }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-4 py-3">
            <Calculator className="size-6 text-blue-600" />
            <span className="font-semibold text-lg truncate">FinCalc</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-white">
          {/* Navigation Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/"}
                    tooltip="Home"
                  >
                    <Link href="/">
                      <Home className="size-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/saved-values"}
                    tooltip="Saved Values"
                  >
                    <Link href="/saved-values">
                      <Bookmark className="size-4" />
                      <span>Saved Values</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Loan Calculators Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Loan Calculators</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.slice(2, 5).map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.description}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Investment Tools Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Investment Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.slice(5).map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.description}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="bg-white">
        {/* Header with Trigger */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <Calculator className="size-5 text-blue-600" />
            <h1 className="text-lg font-semibold">Finance Calculator</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-6 bg-white">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
