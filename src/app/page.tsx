"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mic2, ClipboardList, ArrowRight, Sparkles, CheckCircle2, Timer, Shield } from "lucide-react";

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
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Hackathon-ready prototype
            </span>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              SpeakeasyAI
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A beginner-friendly prototype to manage event speakers, session proposals, approvals, and agendas with helpful AI-style assistants.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="group">
                <Link href="/speaker">
                  <Mic2 className="mr-2 size-5" /> I'm a Speaker
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="group">
                <Link href="/manager">
                  <ClipboardList className="mr-2 size-5" /> I'm an Event Manager
                  <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20 grid gap-6 md:grid-cols-3">
        <motion.div
          className="contents"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <CardTitle>ProposalBot feedback</CardTitle>
                <CardDescription>Get instant tips to improve your session title and abstract.</CardDescription>
              </CardHeader>
              <CardContent>
                Simple rules-based feedback, no API keys required.
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Review & approvals</CardTitle>
                <CardDescription>Managers can approve/reject and auto-notify speakers.</CardDescription>
              </CardHeader>
              <CardContent>Uses localStorage for data, perfect for demos.</CardContent>
            </Card>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Agenda, QR & Certificates</CardTitle>
                <CardDescription>Build agendas, generate QR codes, and downloadable certificates.</CardDescription>
              </CardHeader>
              <CardContent>All in your browser.</CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-6 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-3 text-muted-foreground">Three simple steps to demo-ready results in minutes.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <CardTitle>1. Submit</CardTitle>
              </div>
              <CardDescription>Speakers register and submit a session. ProposalBot gives instant feedback.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="size-5" />
                </div>
                <CardTitle>2. Review</CardTitle>
              </div>
              <CardDescription>Managers approve/reject and schedule approved talks into the agenda.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Timer className="size-5" />
                </div>
                <CardTitle>3. Run</CardTitle>
              </div>
              <CardDescription>On the day: QR check-ins and certificate downloads. All in-browser.</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Shield className="size-4" /> No API keys required
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Timer className="size-4" /> Set up in under 5 minutes
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="group">
            <Link href="/speaker">
              Try the Speaker flow
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SpeakeasyAI — Demo prototype</p>
          <div className="flex items-center gap-4">
            <Link href="/speaker" className="hover:text-foreground">Speaker</Link>
            <span className="opacity-30">•</span>
            <Link href="/manager" className="hover:text-foreground">Manager</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}