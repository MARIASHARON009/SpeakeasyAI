"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";

export const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    startTransition(() => {
      // Fake registration: store minimal profile in localStorage
      const usersRaw = localStorage.getItem("demo_users") || "[]";
      const users = JSON.parse(usersRaw) as Array<{ name: string; email: string }>; 
      if (users.find((u) => u.email === email)) {
        toast.error("Email already registered (demo)");
        return;
      }
      users.push({ name, email });
      localStorage.setItem("demo_users", JSON.stringify(users));

      toast.success("Account created! Please sign in.");
      router.push("/login?registered=true");
    });
  };

  return (
    <Card className="mx-auto w-full max-w-md border-amber-900/20 shadow-[0_8px_0_rgba(120,72,0,0.08)]">
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight">Create account</CardTitle>
        <CardDescription>
          Vintage-styled onboarding. Already have an account? {" "}
          <Link href="/login" className="underline decoration-dotted underline-offset-4 hover:text-primary">Sign in</Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="off" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" autoComplete="off" />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;