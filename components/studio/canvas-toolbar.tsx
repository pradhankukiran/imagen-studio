"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Copy, Maximize } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CanvasToolbarProps {
  hasImage: boolean;
  imageSrc: string | null;
  onFitToScreen?: () => void;
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClick}
            disabled={disabled}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

async function downloadImage(src: string) {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `product-shot-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

async function copyImageToClipboard(src: string) {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    // Convert to PNG for clipboard compatibility
    const pngBlob = blob.type === "image/png" ? blob : await convertToPng(blob);
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": pngBlob }),
    ]);
    return true;
  } catch {
    return false;
  }
}

function convertToPng(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No canvas context"));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error("Failed to convert to PNG"));
      }, "image/png");
    };
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = URL.createObjectURL(blob);
  });
}

export function CanvasToolbar({
  hasImage,
  imageSrc,
  onFitToScreen,
}: CanvasToolbarProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!imageSrc) return;
    const ok = await downloadImage(imageSrc);
    if (ok) {
      toast({ description: "Image downloaded." });
    } else {
      toast({ description: "Download failed.", variant: "destructive" });
    }
  };

  const handleCopy = async () => {
    if (!imageSrc) return;
    const ok = await copyImageToClipboard(imageSrc);
    if (ok) {
      toast({ description: "Copied to clipboard." });
    } else {
      toast({ description: "Copy failed.", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center justify-end px-3 py-1.5 border-b bg-background/80 backdrop-blur-sm flex-shrink-0 z-10">
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={Maximize}
          label="Fit to screen"
          onClick={onFitToScreen}
          disabled={!hasImage}
        />
        <Separator orientation="vertical" className="h-4 mx-1" />
        <ToolbarButton
          icon={Copy}
          label="Copy to clipboard"
          onClick={handleCopy}
          disabled={!hasImage}
        />
        <ToolbarButton
          icon={Download}
          label="Download"
          onClick={handleDownload}
          disabled={!hasImage}
        />
      </div>
    </div>
  );
}
