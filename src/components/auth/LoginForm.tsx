"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const LoginForm = () => {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    const redirect = search.get("redirect") || "/";
    startTransition(async () => {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: remember,
        callbackURL: redirect,
      });
      if (error?.code) {
        toast.error("Invalid email or password. Please make sure you have already registered and try again.");
        return;
      }
      toast.success("Signed in successfully");
      router.push(redirect);
    });
  };

  const onLinkedIn = async () => {
    const redirect = search.get("redirect") || "/";
    startTransition(async () => {
      const { error } = await authClient.signIn.social({
        provider: "linkedin",
        callbackURL: redirect,
      } as any);
      if (error?.code) {
        toast.error("LinkedIn sign-in failed");
        return;
      }
      // Redirect will occur via provider; as fallback:
      router.push(redirect);
    });
  };

  return (
    <Card className="mx-auto w-full max-w-md border-amber-900/20 shadow-[0_8px_0_rgba(120,72,0,0.08)]">
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight">Sign in</CardTitle>
        <CardDescription>
          Vintage-styled access. Don't have an account? {" "}
          <Link href="/register" className="underline decoration-dotted underline-offset-4 hover:text-primary">Register</Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="off" />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
              Remember me
            </label>
            <span className="text-xs text-muted-foreground">Secure auth</span>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-3 grid gap-2">
          <Button type="button" variant="secondary" onClick={onLinkedIn} disabled={isPending}>
            Continue with LinkedIn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;