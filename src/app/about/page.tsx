import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-6 py-14 space-y-12">
      <section className="text-center space-y-4">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
          About SpeakeasyAI
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
          Run standout events with AI assistance
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          SpeakeasyAI is a beginner-friendly prototype to manage speakers, session proposals, approvals, agenda, QR check-ins and certificates — all in your browser with no backend required.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/speaker"><Button size="lg">Try Speaker Flow</Button></Link>
          <Link href="/manager"><Button size="lg" variant="secondary">Open Manager</Button></Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Speaker-first</CardTitle>
            <CardDescription>Simple forms with instant feedback</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            ProposalBot reviews titles and abstracts, flags missing details, and suggests categories to speed up submission quality.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manager controls</CardTitle>
            <CardDescription>Approve, reject, schedule</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Review all proposals in one place, simulate notifications, and build a lightweight agenda with rooms and timeslots.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>On-site ops</CardTitle>
            <CardDescription>QR and certificates</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Generate QR codes for check-in and download completion certificates for speakers directly from the browser.
          </CardContent>
        </Card>
      </section>

      <section className="rounded-xl border p-6 md:p-8 bg-gradient-to-tr from-blue-50/40 to-fuchsia-50/40 dark:from-blue-950/20 dark:to-fuchsia-950/20">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">Designed for hackathons and demos</h2>
            <p className="text-muted-foreground">
              The entire experience uses localStorage so you can demo reliably without setup. Fork it, extend it, and swap AI modules with real APIs later.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link href="/faq"><Button variant="outline">Read FAQs</Button></Link>
          </div>
        </div>
      </section>
    </main>
  );
}