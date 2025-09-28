"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export const SiteHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const nav = [
    { href: "/", label: "Home" },
    { href: "/speaker", label: "Speaker" },
    { href: "/manager", label: "Manager" },
    { href: "/payments", label: "Payments" },
    { href: "/manager/config", label: "Config" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

  const handleSignOut = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : "";
    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
    if (error?.code) {
      toast.error(error.code);
      return;
    }
    localStorage.removeItem("bearer_token");
    toast.success("Signed out");
    refetch();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          {/* Vintage emblem */}
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border bg-card text-primary shadow-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path d="M12 3l2.39 4.84L20 9.27l-4 3.9.94 5.48L12 16.9l-4.94 1.75L8 13.17l-4-3.9 5.61-1.43L12 3z" fill="currentColor" />
            </svg>
          </span>
          <span className="logo-font text-lg font-semibold tracking-tight">SpeakeasyAI</span>
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
          <ThemeSwitcher />
          {isPending ? null : session?.user ? (
            <>
              <span className="text-sm text-muted-foreground max-w-[14ch] truncate" title={session.user.email || session.user.name || "Account"}>
                {session.user.name || session.user.email}
              </span>
              <Button size="sm" variant="ghost" className="rounded-md" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-md">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-md">Register</Button>
              </Link>
            </>
          )}
        </div>
        {/* Mobile actions */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitcher />
          {isPending ? null : session?.user ? (
            <Button size="sm" variant="ghost" onClick={handleSignOut}>Sign out</Button>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;