"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSpeakers, saveSpeaker, getSubmissions, saveSubmission, Speaker } from "@/lib/storage";
import QrPreview from "@/components/speakeasy/QrPreview";
import CertificateCanvas from "@/components/speakeasy/CertificateCanvas";
import AIProposalBot from "@/components/speakeasy/AIProposalBot";
import AIAssistant from "@/components/speakeasy/AIAssistant";
import { toast } from "sonner";

export default function SpeakerPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>("");

  // Speaker form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  // Proposal form
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [track, setTrack] = useState("");
  const [lastSavedSubmissionId, setLastSavedSubmissionId] = useState<number | null>(null);

  useEffect(() => {
    setSpeakers(getSpeakers());
  }, []);

  const selectedSpeaker = useMemo(() => speakers.find(s => s.id === Number(selectedSpeakerId)), [speakers, selectedSpeakerId]);

  function onRegisterSpeaker(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in name and email");
      return;
    }
    const s = saveSpeaker({ name, email, bio });
    const next = getSpeakers();
    setSpeakers(next);
    setSelectedSpeakerId(String(s.id));
    setName("");
    setEmail("");
    setBio("");
    toast.success("Speaker registered");
  }

  function onSubmitProposal(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSpeakerId) {
      toast.error("Select a speaker first");
      return;
    }
    if (!title || !abstract || !track) {
      toast.error("Please complete title, abstract and track");
      return;
    }
    const sub = saveSubmission({ speakerId: Number(selectedSpeakerId), title, abstract, track });
    setLastSavedSubmissionId(sub.id);
    setTitle("");
    setAbstract("");
    setTrack("");
    toast.success("Proposal submitted for review");
  }

  const qrData = useMemo(() => {
    if (!selectedSpeaker) return "";
    const base = `SpeakeasyAI|speaker:${selectedSpeaker.email}`;
    return lastSavedSubmissionId ? `${base}|submission:${lastSavedSubmissionId}` : base;
  }, [selectedSpeaker, lastSavedSubmissionId]);

  return (
    <main className="container mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Speaker Portal</h1>
        <p className="text-muted-foreground">Register yourself and submit a session proposal. AI-powered ProposalBot will guide you.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Register Speaker</CardTitle>
            <CardDescription>Save your details to submit proposals.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onRegisterSpeaker} className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ada@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Short bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Mathematician and early computing pioneer..." />
              </div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit Proposal</CardTitle>
            <CardDescription>Pick yourself, write your proposal, and submit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Speaker</Label>
              <Select value={selectedSpeakerId} onValueChange={setSelectedSpeakerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your profile" />
                </SelectTrigger>
                <SelectContent>
                  {speakers.length === 0 && (
                    <SelectItem value="no-speakers" disabled>
                      No speakers yet
                    </SelectItem>
                  )}
                  {speakers.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name} — {s.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <form onSubmit={onSubmitProposal} className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="title">Session title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="How to build your first AI app" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="abstract">Abstract</Label>
                <Textarea id="abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="In this session, you will learn..." rows={6} />
              </div>
              <div className="grid gap-2">
                <Label>Track</Label>
                <Select value={track} onValueChange={setTrack}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a track" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-dev">Web Development</SelectItem>
                    <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                    <SelectItem value="cloud-devops">Cloud & DevOps</SelectItem>
                    <SelectItem value="soft-skills">Soft Skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Submit for review</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <AIProposalBot
          title={title}
          abstract={abstract}
          track={track}
          onTitleSuggestion={setTitle}
          onAbstractImprovement={setAbstract}
        />

        <Card>
          <CardHeader>
            <CardTitle>Your QR code</CardTitle>
            <CardDescription>Use for check-in or sharing</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSpeaker ? (
              <div className="flex flex-col items-center gap-3">
                <QrPreview data={qrData || selectedSpeaker.email} size={200} />
                <div className="text-xs text-muted-foreground break-all text-center">{qrData || selectedSpeaker.email}</div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Select or register a speaker to see QR.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Download certificate</CardTitle>
            <CardDescription>Auto-fills with your latest submission</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSpeaker ? (
              <CertificateCanvas
                speakerName={selectedSpeaker.name}
                sessionTitle={title || "Conference Speaker"}
              />
            ) : (
              <div className="text-sm text-muted-foreground">Select a speaker to generate certificate.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <AIAssistant />
    </main>
  );
}