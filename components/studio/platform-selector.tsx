"use client";

import { cn } from "@/lib/utils";

const PLATFORMS = [
  {
    id: "meta",
    label: "Meta",
    description: "Facebook & Instagram",
    formats: [
      { id: "meta-feed", label: "Feed Post", width: 1080, height: 1080, tag: "1:1" },
      { id: "meta-story", label: "Story / Reel", width: 1080, height: 1920, tag: "9:16" },
      { id: "meta-link", label: "Link Ad", width: 1200, height: 628, tag: "1.91:1" },
      { id: "meta-carousel", label: "Carousel", width: 1080, height: 1080, tag: "1:1" },
    ],
  },
  {
    id: "google",
    label: "Google",
    description: "Display Network",
    formats: [
      { id: "google-medium", label: "Medium Rectangle", width: 300, height: 250, tag: "300×250" },
      { id: "google-leaderboard", label: "Leaderboard", width: 728, height: 90, tag: "728×90" },
      { id: "google-skyscraper", label: "Wide Skyscraper", width: 160, height: 600, tag: "160×600" },
      { id: "google-large", label: "Large Rectangle", width: 336, height: 280, tag: "336×280" },
    ],
  },
  {
    id: "tiktok",
    label: "TikTok",
    description: "In-Feed & TopView",
    formats: [
      { id: "tiktok-infeed", label: "In-Feed Ad", width: 1080, height: 1920, tag: "9:16" },
      { id: "tiktok-topview", label: "TopView", width: 1080, height: 1920, tag: "9:16" },
    ],
  },
  {
    id: "pinterest",
    label: "Pinterest",
    description: "Pins & Ideas",
    formats: [
      { id: "pin-standard", label: "Standard Pin", width: 1000, height: 1500, tag: "2:3" },
      { id: "pin-square", label: "Square Pin", width: 1000, height: 1000, tag: "1:1" },
      { id: "pin-long", label: "Long Pin", width: 1000, height: 2100, tag: "1:2.1" },
    ],
  },
  {
    id: "youtube",
    label: "YouTube",
    description: "Display & Bumper",
    formats: [
      { id: "yt-display", label: "Display Ad", width: 300, height: 250, tag: "300×250" },
      { id: "yt-overlay", label: "Overlay", width: 480, height: 70, tag: "480×70" },
      { id: "yt-thumbnail", label: "Thumbnail", width: 1280, height: 720, tag: "16:9" },
    ],
  },
] as const;

export type PlatformId = (typeof PLATFORMS)[number]["id"];
export type FormatId = (typeof PLATFORMS)[number]["formats"][number]["id"];

export interface AdFormat {
  id: string;
  label: string;
  width: number;
  height: number;
  tag: string;
}

interface PlatformSelectorProps {
  selectedPlatform: PlatformId;
  selectedFormat: string;
  onPlatformChange: (platform: PlatformId) => void;
  onFormatChange: (format: string) => void;
}

export function PlatformSelector({
  selectedPlatform,
  selectedFormat,
  onPlatformChange,
  onFormatChange,
}: PlatformSelectorProps) {
  const platform = PLATFORMS.find((p) => p.id === selectedPlatform)!;

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Platform
      </label>

      {/* Platform tabs */}
      <div className="flex gap-1 flex-wrap">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              onPlatformChange(p.id);
              // Auto-select first format of new platform
              onFormatChange(p.formats[0].id);
            }}
            className={cn(
              "px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150",
              selectedPlatform === p.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Format grid for selected platform */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          {platform.description} — Sizes
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {platform.formats.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            // Scale dimensions for preview thumbnail
            const maxDim = 28;
            const ratio = Math.min(maxDim / fmt.width, maxDim / fmt.height);
            const previewW = Math.round(fmt.width * ratio);
            const previewH = Math.round(fmt.height * ratio);

            return (
              <button
                key={fmt.id}
                onClick={() => onFormatChange(fmt.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md p-2 text-left transition-all duration-150 border",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-muted/60"
                )}
              >
                {/* Size preview */}
                <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                  <div
                    className={cn(
                      "border rounded-[2px]",
                      isSelected ? "border-primary bg-primary/10" : "border-muted-foreground/30 bg-muted/40"
                    )}
                    style={{ width: previewW, height: previewH }}
                  />
                </div>
                <div className="min-w-0">
                  <div className={cn(
                    "text-[11px] font-medium truncate",
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {fmt.label}
                  </div>
                  <div className="text-[9px] text-muted-foreground/60">{fmt.tag}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper to get format details by ID
export function getFormatById(formatId: string): AdFormat | undefined {
  for (const p of PLATFORMS) {
    const fmt = p.formats.find((f) => f.id === formatId);
    if (fmt) return fmt as AdFormat;
  }
  return undefined;
}
