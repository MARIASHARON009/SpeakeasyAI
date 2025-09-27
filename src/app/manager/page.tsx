"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSubmissions, setSubmissionStatus, getSpeakers, Submission } from "@/lib/storage";
import { toast } from "sonner";
import AgendaManager from "@/components/speakeasy/AgendaManager";

export default function ManagerPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const speakers = useMemo(() => getSpeakers(), []);

  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);

  function speakerName(id: number) {
    return speakers.find((s) => s.id === id)?.name || "Unknown";
  }

  function handleAction(id: number, status: "approved" | "rejected") {
    setSubmissionStatus(id, status);
    setSubmissions(getSubmissions());
    // Simulated email notification
    const sub = getSubmissions().find((x) => x.id === id);
    const sp = speakers.find((s) => s.id === sub?.speakerId);
    const emailText = `Email to ${sp?.email}: Your submission "${sub?.title}" was ${status}.`;
    toast.success("Notification sent", { description: emailText });
  }

  const list = submissions.filter((s) => (filter === "all" ? true : s.status === filter));

  return (
    <main className="container mx-auto px-6 py-12 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">Manager</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
          Event Manager Dashboard
        </h1>
        <p className="max-w-2xl text-muted-foreground">Review speaker submissions, approve/reject, and manage the agenda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>Filter, review, and take action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Button variant={filter === "all" ? "default" : "secondary"} onClick={() => setFilter("all")}>All</Button>
              <Button variant={filter === "pending" ? "default" : "secondary"} onClick={() => setFilter("pending")}>Pending</Button>
              <Button variant={filter === "approved" ? "default" : "secondary"} onClick={() => setFilter("approved")}>Approved</Button>
              <Button variant={filter === "rejected" ? "default" : "secondary"} onClick={() => setFilter("rejected")}>Rejected</Button>
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Speaker</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No submissions</TableCell>
                    </TableRow>
                  ) : (
                    list.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{speakerName(s.speakerId)}</TableCell>
                        <TableCell>{s.title}</TableCell>
                        <TableCell>{s.track}</TableCell>
                        <TableCell>
                          <Badge variant={s.status === "approved" ? "default" : s.status === "rejected" ? "destructive" : "secondary"}>
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" onClick={() => handleAction(s.id, "approved")}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleAction(s.id, "rejected")}>Reject</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Quick numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between"><span>Total</span><span>{submissions.length}</span></div>
            <div className="flex justify-between"><span>Pending</span><span>{submissions.filter(s=>s.status==="pending").length}</span></div>
            <div className="flex justify-between"><span>Approved</span><span>{submissions.filter(s=>s.status==="approved").length}</span></div>
            <div className="flex justify-between"><span>Rejected</span><span>{submissions.filter(s=>s.status==="rejected").length}</span></div>
          </CardContent>
        </Card>
      </div>

      <AgendaManager />
    </main>
  );
}