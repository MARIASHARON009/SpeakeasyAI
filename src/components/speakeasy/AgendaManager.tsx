"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addAgendaItem, getAgenda, getSpeakers, getSubmissions, AgendaItem } from "@/lib/storage";
import { toast } from "sonner";

export default function AgendaManager() {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const submissions = useMemo(() => getSubmissions().filter(s => s.status === "approved"), []);
  const speakers = useMemo(() => getSpeakers(), []);

  const [selectedSubmission, setSelectedSubmission] = useState<string>("");
  const [room, setRoom] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    setAgenda(getAgenda());
  }, []);

  function displayTitle(subId: number) {
    const s = submissions.find(x => x.id === subId);
    const sp = speakers.find(p => p.id === s?.speakerId);
    return s ? `${s.title} — ${sp?.name || "Unknown"}` : "Unknown";
  }

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSubmission || !room || !start || !end) {
      toast.error("Please fill all fields");
      return;
    }
    const item = addAgendaItem({ submissionId: Number(selectedSubmission), room, start, end });
    setAgenda(getAgenda());
    setSelectedSubmission("");
    setRoom("");
    setStart("");
    setEnd("");
    toast.success("Agenda item added");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agenda Management</CardTitle>
        <CardDescription>Schedule approved talks with rooms and times</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={onAdd} className="grid md:grid-cols-5 gap-3">
          <div className="grid gap-2 md:col-span-2">
            <Label>Approved submission</Label>
            <Select value={selectedSubmission} onValueChange={setSelectedSubmission}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a talk" />
              </SelectTrigger>
              <SelectContent>
                {submissions.length === 0 && (
                  <SelectItem value="no-approved" disabled>No approved talks</SelectItem>
                )}
                {submissions.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="room">Room</Label>
            <Input id="room" value={room} onChange={(e)=>setRoom(e.target.value)} placeholder="Auditorium A" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="start">Start</Label>
            <Input id="start" type="datetime-local" value={start} onChange={(e)=>setStart(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end">End</Label>
            <Input id="end" type="datetime-local" value={end} onChange={(e)=>setEnd(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">Add</Button>
          </div>
        </form>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Talk</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agenda.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">No agenda items yet</TableCell>
                </TableRow>
              ) : (
                agenda.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{displayTitle(a.submissionId)}</TableCell>
                    <TableCell>{a.room}</TableCell>
                    <TableCell>{new Date(a.start).toLocaleString()}</TableCell>
                    <TableCell>{new Date(a.end).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}