"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic2, ClipboardList, ArrowRight, Sparkles, CheckCircle2, Timer, Shield, Bot, Wand2, MessageCircle } from "lucide-react";

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
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              AI-Powered Event Management
            </span>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              SpeakeasyAI
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Manage event speakers, session proposals, and agendas with powerful AI assistants. Get instant feedback, generate compelling content, and streamline your event workflow.
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
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="container mx-auto px-6 pb-12">
        <div className="mx-auto max-w-4xl text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">AI-Powered Features</h2>
          <p className="mt-3 text-muted-foreground">Intelligent tools to enhance your proposals and streamline event management</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="transition-all hover:-translate-y-1 hover:shadow-lg border-primary/20">
            <CardHeader>
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                <Bot className="size-6" />
              </div>
              <CardTitle>AI ProposalBot</CardTitle>
              <CardDescription>Get intelligent feedback on your session proposals with actionable suggestions</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Advanced AI analyzes your title and abstract, providing professional-grade feedback to maximize acceptance rates.
            </CardContent>
          </Card>
          <Card className="transition-all hover:-translate-y-1 hover:shadow-lg border-primary/20">
            <CardHeader>
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                <Wand2 className="size-6" />
              </div>
              <CardTitle>Content Generation</CardTitle>
              <CardDescription>Generate compelling titles and improve abstracts with AI assistance</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Let AI craft engaging session titles and refine your abstracts to clearly communicate value to attendees.
            </CardContent>
          </Card>
          <Card className="transition-all hover:-translate-y-1 hover:shadow-lg border-primary/20">
            <CardHeader>
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                <MessageCircle className="size-6" />
              </div>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>24/7 intelligent help for navigating the platform and answering questions</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Chat with our AI assistant to get instant guidance on features, workflows, and best practices.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-20 grid gap-6 md:grid-cols-3">
        <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Smart Review & Approvals</CardTitle>
            <CardDescription>Managers can approve/reject and auto-notify speakers</CardDescription>
          </CardHeader>
          <CardContent>
            Streamlined workflow with automated notifications and intelligent review tools.
          </CardContent>
        </Card>
        <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
          <CardHeader>
            <CardTitle>QR & Certificates</CardTitle>
            <CardDescription>Generate QR codes and downloadable certificates instantly</CardDescription>
          </CardHeader>
          <CardContent>
            Professional check-in system and certificate generation, all in your browser.
          </CardContent>
        </Card>
        <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Agenda Management</CardTitle>
            <CardDescription>Build and manage event schedules effortlessly</CardDescription>
          </CardHeader>
          <CardContent>
            Drag-and-drop agenda builder with conflict detection and automated scheduling.
          </CardContent>
        </Card>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-6 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-3 text-muted-foreground">Three simple steps to AI-enhanced proposals</p>
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
              <CardDescription>Speakers register and submit a session. AI ProposalBot gives instant intelligent feedback.</CardDescription>
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
              <CardDescription>Managers approve/reject and schedule approved talks into the agenda with AI assistance.</CardDescription>
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
              <CardDescription>On the day: QR check-ins, certificates, and 24/7 AI assistant support.</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Sparkles className="size-4" /> AI-powered feedback
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Shield className="size-4" /> Secure & private
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
            <Timer className="size-4" /> Set up in under 5 minutes
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="group">
            <Link href="/speaker">
              Try the AI-Powered Speaker flow
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SpeakeasyAI — AI-Enhanced Event Management</p>
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