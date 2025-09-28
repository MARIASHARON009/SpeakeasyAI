"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SiteHeader = () => {
  const pathname = usePathname();
  const nav = [
    { href: "/", label: "Home" },
    { href: "/speaker", label: "Speaker" },
    { href: "/manager", label: "Manager" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-tr from-blue-600 via-fuchsia-500 to-amber-400" />
          <span className="font-semibold tracking-tight">SpeakeasyAI</span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "rounded-md",
                  pathname === item.href && "bg-primary text-primary-foreground"
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        {/* Desktop auth actions */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="rounded-md">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="rounded-md">Register</Button>
          </Link>
        </div>
        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/login">
            <Button size="sm" variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;