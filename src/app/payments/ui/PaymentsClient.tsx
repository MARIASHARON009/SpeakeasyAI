"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  getShows,
  getBookingsByShow,
  getBookedSeats,
  getAvailableSeats,
  bookSeats,
  refundSeats,
  type Show,
  type Booking,
} from "@/lib/storage";

export const PaymentsClient = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShowId, setSelectedShowId] = useState<string>("");
  const [qty, setQty] = useState<string>("1");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const list = getShows();
    setShows(list);
    if (list.length > 0) {
      setSelectedShowId(String(list[0].id));
    }
  }, []);

  const selectedShow = useMemo(
    () => shows.find((s) => s.id === Number(selectedShowId)),
    [shows, selectedShowId]
  );

  useEffect(() => {
    if (!selectedShow) {
      setBookings([]);
      return;
    }
    setBookings(getBookingsByShow(selectedShow.id));
  }, [selectedShow]);

  const booked = selectedShow ? getBookedSeats(selectedShow.id) : 0;
  const available = selectedShow ? getAvailableSeats(selectedShow.id) : 0;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShow) {
      toast.error("Select a show first");
      return;
    }
    const n = parseInt(qty || "0", 10);
    const res = bookSeats(selectedShow.id, n);
    if (!res.ok) {
      toast.error(res.error || "Booking failed");
      return;
    }
    toast.success(`Booked ${n} seat${n > 1 ? "s" : ""}`);
    setBookings(getBookingsByShow(selectedShow.id));
    setQty("1");
  };

  const handleRefund = (id: number) => {
    const r = refundSeats(id);
    if (!r.ok) {
      toast.error(r.error || "Refund failed");
      return;
    }
    if (selectedShow) setBookings(getBookingsByShow(selectedShow.id));
    toast.message("Booking refunded");
  };

  if (shows.length === 0) {
    return (
      <main className="container mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="logo-font text-3xl font-bold">Tickets & Payments</h1>
          <p className="text-muted-foreground">No shows available yet. Ask the event manager to add one.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Manage Shows</CardTitle>
            <CardDescription>Event managers can create shows and capacities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/manager/config">
              <Button>Go to Manager Config</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="logo-font text-3xl font-bold">Tickets & Payments</h1>
        <p className="text-muted-foreground">Book seats for a show and view current bookings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Show</CardTitle>
            <CardDescription>Pick a show and reserve seats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Show</Label>
              <Select value={selectedShowId} onValueChange={setSelectedShowId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a show" />
                </SelectTrigger>
                <SelectContent>
                  {shows.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.title} — {new Date(s.date).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedShow && (
              <div className="rounded-md border p-3 text-sm">
                <div className="font-medium">{selectedShow.title}</div>
                <div className="text-muted-foreground text-xs">
                  {new Date(selectedShow.date).toLocaleString()}
                </div>
                <div className="mt-2 flex gap-4">
                  <div>Total: {selectedShow.totalSeats}</div>
                  <div>Booked: {booked}</div>
                  <div>Available: {available}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="qty">Quantity</Label>
                <Input id="qty" type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Book Seats</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>All bookings for the selected show.</CardDescription>
          </CardHeader>
          <CardContent>
            {(!selectedShow || bookings.length === 0) && (
              <div className="text-sm text-muted-foreground">No bookings yet.</div>
            )}
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-md border p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.qty} seat{b.qty > 1 ? "s" : ""}</div>
                    <div className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => handleRefund(b.id)}>Refund</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Need to add or edit shows?</CardTitle>
          <CardDescription>Go to the manager configuration page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/manager/config">
            <Button variant="ghost">Open Manager Config</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
};

export default PaymentsClient;