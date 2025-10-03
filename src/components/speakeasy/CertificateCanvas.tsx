"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

export default function CertificateCanvas({ 
  speakerName, 
  sessionTitle 
}: { 
  speakerName: string; 
  sessionTitle: string; 
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const w = 1200, h = 900;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Vintage background with gradient
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#faf8f6");
    gradient.addColorStop(1, "#f5f1ed");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Decorative border - outer
    ctx.strokeStyle = "#8b7355";
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Decorative border - inner
    ctx.strokeStyle = "#b8a088";
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, w - 120, h - 120);

    // Corner decorations
    drawCornerDecoration(ctx, 80, 80, 1);
    drawCornerDecoration(ctx, w - 80, 80, -1);
    drawCornerDecoration(ctx, 80, h - 80, 1, true);
    drawCornerDecoration(ctx, w - 80, h - 80, -1, true);

    // Header ornament
    ctx.fillStyle = "#8b7355";
    ctx.beginPath();
    ctx.arc(w / 2, 150, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Title
    ctx.fillStyle = "#2d2521";
    ctx.textAlign = "center";
    ctx.font = "bold 56px 'Playfair Display', serif";
    ctx.fillText("Certificate of Appreciation", w / 2, 260);

    // Decorative line
    ctx.strokeStyle = "#b8a088";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 250, 290);
    ctx.lineTo(w / 2 + 250, 290);
    ctx.stroke();

    // "Presented to" text
    ctx.font = "italic 24px 'Playfair Display', serif";
    ctx.fillStyle = "#6b5d52";
    ctx.fillText("This certificate is proudly presented to", w / 2, 360);

    // Speaker name with underline
    ctx.font = "bold 48px 'Playfair Display', serif";
    ctx.fillStyle = "#2d2521";
    ctx.fillText(speakerName, w / 2, 440);
    
    // Underline for name
    const nameWidth = ctx.measureText(speakerName).width;
    ctx.strokeStyle = "#8b7355";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w / 2 - nameWidth / 2, 460);
    ctx.lineTo(w / 2 + nameWidth / 2, 460);
    ctx.stroke();

    // Session details
    ctx.font = "italic 22px 'Playfair Display', serif";
    ctx.fillStyle = "#6b5d52";
    ctx.fillText("for delivering an outstanding session on", w / 2, 530);

    // Session title
    ctx.font = "28px 'Playfair Display', serif";
    ctx.fillStyle = "#2d2521";
    wrapText(ctx, sessionTitle, w / 2, 580, 900, 40);

    // Date and signature section
    const date = new Date().toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });

    // Signature lines
    const leftX = w / 2 - 250;
    const rightX = w / 2 + 250;
    const sigY = h - 200;
    
    ctx.strokeStyle = "#8b7355";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftX - 80, sigY);
    ctx.lineTo(leftX + 80, sigY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightX - 80, sigY);
    ctx.lineTo(rightX + 80, sigY);
    ctx.stroke();

    // Signature labels
    ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillStyle = "#6b5d52";
    ctx.fillText("Event Organizer", leftX, sigY + 30);
    ctx.fillText("Program Director", rightX, sigY + 30);

    // Date at bottom
    ctx.font = "18px 'Playfair Display', serif";
    ctx.fillText(`Issued on ${date}`, w / 2, h - 120);

    // SpeakeasyAI branding
    ctx.font = "bold 20px 'Playfair Display', serif";
    ctx.fillStyle = "#8b7355";
    ctx.fillText("SpeakeasyAI Conference Platform", w / 2, h - 80);

  }, [speakerName, sessionTitle]);

  function drawCornerDecoration(
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    flipX: number, 
    flipY: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);
    if (flipX < 0) ctx.scale(-1, 1);
    if (flipY) ctx.scale(1, -1);
    
    ctx.strokeStyle = "#b8a088";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI / 2);
    ctx.stroke();
    
    ctx.restore();
  }

  function download() {
    const canvas = ref.current;
    if (!canvas) return;
    
    setIsGenerating(true);
    
    try {
      const link = document.createElement("a");
      const fileName = `certificate-${speakerName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      toast.success("Certificate downloaded successfully");
    } catch (error) {
      toast.error("Failed to download certificate");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-gradient-to-br from-background to-accent/10 p-4 rounded-lg border-2 border-border shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb,120,100,80),0.03),transparent_70%)]" />
        <canvas 
          ref={ref} 
          className="relative w-full rounded-md border-2 border-muted shadow-md" 
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={download} 
          disabled={isGenerating}
          className="flex-1"
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Certificate
            </>
          )}
        </Button>
      </div>

      <div className="text-xs text-muted-foreground text-center bg-muted/50 p-3 rounded-md border">
        <FileText className="h-4 w-4 inline mr-2" />
        High-resolution PNG (1200×900px) • Ready for printing
      </div>
    </div>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D, 
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number, 
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}