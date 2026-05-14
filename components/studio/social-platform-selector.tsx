"use client";

import { cn } from "@/lib/utils";

const SOCIAL_PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    formats: [
      { id: "ig-post", label: "Post", width: 1080, height: 1080, tag: "1:1" },
      { id: "ig-story", label: "Story", width: 1080, height: 1920, tag: "9:16" },
      { id: "ig-reel-cover", label: "Reel Cover", width: 1080, height: 1920, tag: "9:16" },
      { id: "ig-carousel", label: "Carousel Slide", width: 1080, height: 1350, tag: "4:5" },
    ],
  },
  {
    id: "tiktok",
    label: "TikTok",
    formats: [
      { id: "tt-post", label: "Post", width: 1080, height: 1920, tag: "9:16" },
      { id: "tt-cover", label: "Video Cover", width: 1080, height: 1920, tag: "9:16" },
    ],
  },
  {
    id: "pinterest",
    label: "Pinterest",
    formats: [
      { id: "pin-standard", label: "Standard Pin", width: 1000, height: 1500, tag: "2:3" },
      { id: "pin-idea", label: "Idea Pin", width: 1080, height: 1920, tag: "9:16" },
      { id: "pin-square", label: "Square Pin", width: 1000, height: 1000, tag: "1:1" },
    ],
  },
  {
    id: "twitter",
    label: "X / Twitter",
    formats: [
      { id: "x-post", label: "Post Image", width: 1600, height: 900, tag: "16:9" },
      { id: "x-header", label: "Header", width: 1500, height: 500, tag: "3:1" },
    ],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    formats: [
      { id: "li-post", label: "Post", width: 1200, height: 1200, tag: "1:1" },
      { id: "li-article", label: "Article Cover", width: 1200, height: 628, tag: "1.91:1" },
    ],
  },
] as const;

export type SocialPlatformId = (typeof SOCIAL_PLATFORMS)[number]["id"];

export interface SocialFormat {
  id: string;
  label: string;
  width: number;
  height: number;
  tag: string;
}

interface SocialPlatformSelectorProps {
  selectedPlatform: SocialPlatformId;
  selectedFormat: string;
  onPlatformChange: (platform: SocialPlatformId) => void;
  onFormatChange: (format: string) => void;
}

export function SocialPlatformSelector({
  selectedPlatform,
  selectedFormat,
  onPlatformChange,
  onFormatChange,
}: SocialPlatformSelectorProps) {
  const platform = SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatform)!;

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Platform
      </label>

      <div className="flex gap-1 flex-wrap">
        {SOCIAL_PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              onPlatformChange(p.id);
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

      <div className="space-y-1.5">
        <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          Format
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {platform.formats.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
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
                <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                  <div
                    className={cn(
                      "border rounded-[2px]",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-muted-foreground/30 bg-muted/40"
                    )}
                    style={{ width: previewW, height: previewH }}
                  />
                </div>
                <div className="min-w-0">
                  <div
                    className={cn(
                      "text-[11px] font-medium truncate",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {fmt.label}
                  </div>
                  <div className="text-[9px] text-muted-foreground/60">
                    {fmt.tag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function getSocialFormatById(
  formatId: string
): SocialFormat | undefined {
  for (const p of SOCIAL_PLATFORMS) {
    const fmt = p.formats.find((f) => f.id === formatId);
    if (fmt) return fmt as SocialFormat;
  }
  return undefined;
}
