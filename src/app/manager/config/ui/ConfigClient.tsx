"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  getManagerPin,
  setManagerPin,
  isManagerAuthed,
  setManagerAuthed,
  getShows,
  saveShow,
  deleteShow,
  getBookedSeats,
  getAvailableSeats,
  type Show,
} from "@/lib/storage";

export const ConfigClient = () => {
  const [authed, setAuthed] = useState(false);
  const [pinExists, setPinExists] = useState<boolean>(false);

  // Auth forms
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  // Shows
  const [shows, setShows] = useState<Show[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [totalSeats, setTotalSeats] = useState<string>("");

  useEffect(() => {
    setAuthed(isManagerAuthed());
    setPinExists(Boolean(getManagerPin()));
    setShows(getShows());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = getManagerPin();
    if (!saved) {
      toast.error("No PIN set yet. Please create one below.");
      return;
    }
    if (pin === saved) {
      setManagerAuthed(true);
      setAuthed(true);
      toast.success("Authorized as Event Manager");
      setPin("");
    } else {
      toast.error("Incorrect PIN");
    }
  };

  const handleCreatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    setManagerPin(newPin);
    setPinExists(true);
    toast.success("PIN created. You can now log in.");
    setNewPin("");
    setConfirmPin("");
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    setManagerPin(newPin);
    toast.success("PIN updated");
    setNewPin("");
    setConfirmPin("");
  };

  const handleLogout = () => {
    setManagerAuthed(false);
    setAuthed(false);
    toast.message("Signed out of Manager mode");
  };

  const handleAddShow = (e: React.FormEvent) => {
    e.preventDefault();
    const seats = parseInt(totalSeats || "0", 10);
    if (!title || !date || !seats || seats <= 0) {
      toast.error("Provide title, date/time and a positive seat count");
      return;
    }
    const next = saveShow({ title, date, totalSeats: seats });
    setShows(getShows());
    setTitle("");
    setDate("");
    setTotalSeats("");
    toast.success(`Show added: ${next.title}`);
  };

  const removeShow = (id: number) => {
    deleteShow(id);
    setShows(getShows());
  };

  if (!authed) {
    return (
      <main className="container mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="logo-font text-3xl font-bold">Manager Configuration</h1>
          <p className="text-muted-foreground">Only event managers can access this page.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Authorize with PIN</CardTitle>
              <CardDescription>Enter the manager PIN to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="pin">PIN</Label>
                  <Input id="pin" type="password" inputMode="numeric" autoComplete="off" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" />
                </div>
                <Button type="submit" className="w-full">Unlock</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{pinExists ? "Reset PIN" : "Create PIN"}</CardTitle>
              <CardDescription>
                {pinExists ? "Change the existing manager PIN." : "No PIN set yet. Create one to enable manager access."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={pinExists ? handleChangePin : handleCreatePin} className="space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="newPin">New PIN</Label>
                  <Input id="newPin" type="password" inputMode="numeric" autoComplete="off" value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="At least 4 digits" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPin">Confirm PIN</Label>
                  <Input id="confirmPin" type="password" inputMode="numeric" autoComplete="off" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} placeholder="Repeat PIN" />
                </div>
                <Button type="submit" className="w-full">{pinExists ? "Update PIN" : "Create PIN"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="logo-font text-3xl font-bold">Manager Configuration</h1>
          <p className="text-muted-foreground">Manage ticketed shows and access controls.</p>
        </div>
        <Button variant="ghost" onClick={handleLogout}>Sign out</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticketed Shows</CardTitle>
            <CardDescription>Create and manage shows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddShow} className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Opening Keynote" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seats">Total seats</Label>
                <Input id="seats" type="number" min={1} value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} placeholder="100" />
              </div>
              <Button type="submit" className="w-full">Add Show</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Shows</CardTitle>
            <CardDescription>Overview with capacity & bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shows.length === 0 && (
                <div className="text-sm text-muted-foreground">No shows yet. Add one on the left.</div>
              )}
              {shows.map((s) => (
                <div key={s.id} className="rounded-md border p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(s.date).toLocaleString()} • Seats: {s.totalSeats} • Booked: {getBookedSeats(s.id)} • Available: {getAvailableSeats(s.id)}</div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => removeShow(s.id)}>Delete</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your manager PIN anytime.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePin} className="grid gap-3 md:grid-cols-3">
            <div className="grid gap-2 md:col-span-1">
              <Label htmlFor="newPin2">New PIN</Label>
              <Input id="newPin2" type="password" inputMode="numeric" autoComplete="off" value={newPin} onChange={(e) => setNewPin(e.target.value)} />
            </div>
            <div className="grid gap-2 md:col-span-1">
              <Label htmlFor="confirmPin2">Confirm PIN</Label>
              <Input id="confirmPin2" type="password" inputMode="numeric" autoComplete="off" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button type="submit" className="w-full">Update PIN</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ConfigClient;