"use client";

export default function QrPreview({ data, size = 150 }: { data: string; size?: number }) {
  if (!data) return null;
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  return (
    <img
      src={url}
      alt="QR Code"
      width={size}
      height={size}
      className="rounded-md border"
    />
  );
}