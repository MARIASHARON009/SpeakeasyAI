"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=2070&auto=format&fit=crop)",
          }}
        />
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              SpeakeasyAI
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A beginner-friendly prototype to manage event speakers, session proposals, approvals, and agendas with helpful AI-style assistants.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/speaker">I'm a Speaker</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/manager">I'm an Event Manager</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>ProposalBot feedback</CardTitle>
            <CardDescription>Get instant tips to improve your session title and abstract.</CardDescription>
          </CardHeader>
          <CardContent>
            Simple rules-based feedback, no API keys required.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Review & approvals</CardTitle>
            <CardDescription>Managers can approve/reject and auto-notify speakers.</CardDescription>
          </CardHeader>
          <CardContent>Uses localStorage for data, perfect for demos.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Agenda, QR & Certificates</CardTitle>
            <CardDescription>Build agendas, generate QR codes, and downloadable certificates.</CardDescription>
          </CardHeader>
          <CardContent>All in your browser.</CardContent>
        </Card>
      </section>
    </main>
  );
}