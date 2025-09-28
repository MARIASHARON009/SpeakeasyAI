import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register — SpeakeasyAI",
  description: "Create your SpeakeasyAI demo account.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-[radial-gradient(ellipse_at_top_left,rgba(171,121,56,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(92,64,34,0.06),transparent_55%)]">
      <section className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-muted-foreground mt-2">Join the SpeakeasyAI demo with a classic vintage touch.</p>
        </div>
        <RegisterForm />
      </section>
    </main>
  );
}