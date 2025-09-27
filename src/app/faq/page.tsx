import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FaqPage() {
  const faqs = [
    {
      q: "What is SpeakeasyAI?",
      a: "A beginner-friendly prototype that lets you manage speakers, proposals, approvals, agenda, QR check-ins and certificates — all in-browser with localStorage.",
    },
    {
      q: "Do I need a backend or database?",
      a: "No. Everything runs locally using your browser's localStorage, which makes demos and hackathon setups painless.",
    },
    {
      q: "How does ProposalBot work?",
      a: "It's a rule-based helper that checks for missing fields, flags short abstracts, and suggests categories. You can swap it later with a real LLM API.",
    },
    {
      q: "Can I customize the agenda?",
      a: "Yes. Use the Agenda Manager to assign rooms and timeslots to approved sessions. The data persists in localStorage.",
    },
    {
      q: "How are QR codes and certificates generated?",
      a: "QRs are previewed from a public image endpoint, and certificates are rendered via HTML Canvas client-side for quick downloads.",
    },
  ];

  return (
    <main className="container mx-auto px-6 py-14 space-y-12">
      <section className="text-center space-y-4">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">Frequently Asked Questions</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
          Everything you need to demo confidently
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Short answers to help you run a polished demo. Fork it, extend it, and replace the mock AI with your own.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/speaker"><Button size="lg">Speaker Flow</Button></Link>
          <Link href="/manager"><Button size="lg" variant="secondary">Manager Dashboard</Button></Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {faqs.map((item, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-lg">{item.q}</CardTitle>
              <CardDescription>{idx === 0 ? "Overview" : ""}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{item.a}</CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-xl border p-6 md:p-8 bg-gradient-to-tr from-blue-50/40 to-fuchsia-50/40 dark:from-blue-950/20 dark:to-fuchsia-950/20">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">Need more pages or integrations?</h2>
            <p className="text-muted-foreground">I can add testimonials, a pricing page, drag-and-drop agenda, CSV export, and real email/LLM integrations.</p>
          </div>
          <div className="flex md:justify-end">
            <Link href="/"><Button variant="outline">Back to Home</Button></Link>
          </div>
        </div>
      </section>
    </main>
  );
}