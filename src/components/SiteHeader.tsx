"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "rose">("light");
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "rose" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: "light" | "dark" | "rose") => {
    document.documentElement.classList.remove("light", "dark", "theme-rose");
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "rose") {
      document.documentElement.classList.add("theme-rose");
    }
    localStorage.setItem("theme", newTheme);
  };

  const cycleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "rose" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
      toast.success("Signed out successfully");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="logo-font text-xl font-bold">SpeakeasyAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/speaker" className="text-sm font-medium hover:text-primary transition-colors">
              Speaker
            </Link>
            <Link href="/manager" className="text-sm font-medium hover:text-primary transition-colors">
              Manager
            </Link>
            
            {/* Theme Switcher */}
            <Button variant="ghost" size="icon" onClick={cycleTheme} title={`Current: ${theme}`}>
              {theme === "light" && <Sun className="size-5" />}
              {theme === "dark" && <Moon className="size-5" />}
              {theme === "rose" && <Palette className="size-5" />}
            </Button>

            {/* Auth Actions */}
            {isPending ? (
              <div className="h-9 w-20 animate-pulse bg-muted rounded" />
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {session.user.name || session.user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={cycleTheme}>
              {theme === "light" && <Sun className="size-5" />}
              {theme === "dark" && <Moon className="size-5" />}
              {theme === "rose" && <Palette className="size-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/speaker"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Speaker
              </Link>
              <Link
                href="/manager"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Manager
              </Link>
              
              {isPending ? (
                <div className="h-9 w-full animate-pulse bg-muted rounded" />
              ) : session?.user ? (
                <>
                  <div className="text-sm text-muted-foreground py-2 border-t">
                    {session.user.name || session.user.email}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                    Sign out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}