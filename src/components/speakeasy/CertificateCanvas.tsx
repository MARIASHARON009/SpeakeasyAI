"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function CertificateCanvas({ speakerName, sessionTitle }: { speakerName: string; sessionTitle: string; }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = 800, h = 600;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--card");
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // Title
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--foreground") || "#111";
    ctx.textAlign = "center";
    ctx.font = "bold 36px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText("Certificate of Appreciation", w/2, 120);

    // Subtitle
    ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText("Presented to", w/2, 170);

    // Name
    ctx.font = "bold 28px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText(speakerName, w/2, 215);

    // Session
    ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto";
    const text = `For the session: ${sessionTitle}`;
    wrapText(ctx, text, w/2, 260, 700, 22);

    // Footer
    ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto";
    const date = new Date().toLocaleDateString();
    ctx.fillText(`Issued by SpeakeasyAI on ${date}`, w/2, h - 80);
  }, [speakerName, sessionTitle]);

  function download() {
    const canvas = ref.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `certificate-${speakerName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="space-y-3">
      <canvas ref={ref} className="w-full rounded-md border bg-card" />
      <Button onClick={download} className="w-full">Download PNG</Button>
    </div>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}