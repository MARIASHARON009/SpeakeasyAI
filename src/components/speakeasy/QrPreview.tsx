"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function QrPreview({ data, size = 200 }: { data: string; size?: number }) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!data) return null;

  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&data=${encodeURIComponent(data)}&margin=20&color=45-37-33&bgcolor=250-248-246`;

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("QR code downloaded");
    } catch (error) {
      toast.error("Failed to download QR code");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-gradient-to-br from-background to-accent/10 p-6 rounded-lg border-2 border-border shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb,120,100,80),0.05),transparent_70%)] rounded-lg" />
        <div className="relative flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          <img
            src={url}
            alt="QR Code"
            width={size}
            height={size}
            className="rounded-md bg-white p-2 shadow-md"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              toast.error("Failed to load QR code");
            }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Data
            </>
          )}
        </Button>
      </div>

      <div className="text-xs text-muted-foreground break-all text-center bg-muted/50 p-3 rounded-md border">
        <span className="font-mono">{data}</span>
      </div>
    </div>
  );
}