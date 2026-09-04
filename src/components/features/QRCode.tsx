import { useEffect, useRef } from "react";
import QRCodeLib from "qrcode";

interface Props {
  value: string;
  size?: number;
}

export default function QRCode({ value, size = 128 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: "#1a365d",
          light: "#ffffff",
        },
      });
    }
  }, [value, size]);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <canvas ref={canvasRef} className="rounded-md border border-border" />
      <span className="text-[10px] text-muted-foreground font-mono">{value}</span>
    </div>
  );
}
