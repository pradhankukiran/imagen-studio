"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TextPromptInput } from "@/components/studio/text-prompt-input";
import { ImageCanvas, ImageCanvasRef } from "@/components/studio/image-canvas";
import { CanvasToolbar } from "@/components/studio/canvas-toolbar";
import { ProductUpload } from "@/components/studio/product-upload";
import {
  GenerationHistory,
  HistoryItem,
} from "@/components/studio/generation-history";
import {
  Clapperboard,
  RotateCw,
  Layers,
  Play,
  SlidersHorizontal,
  Wand2,
} from "lucide-react";

// --- Video Types ---
const VIDEO_TYPES = [
  { id: "demo", label: "Product Demo", icon: Play },
  { id: "spin", label: "360° Spin", icon: RotateCw },
  { id: "slideshow", label: "Slideshow", icon: Layers },
  { id: "before-after", label: "Before / After", icon: SlidersHorizontal },
  { id: "unboxing", label: "Unboxing", icon: Clapperboard },
] as const;

type VideoType = (typeof VIDEO_TYPES)[number]["id"];

// --- Platforms ---
const VIDEO_PLATFORMS = [
  { id: "reels", label: "Reels", width: 1080, height: 1920, tag: "9:16" },
  { id: "tiktok", label: "TikTok", width: 1080, height: 1920, tag: "9:16" },
  { id: "shorts", label: "YT Shorts", width: 1080, height: 1920, tag: "9:16" },
  { id: "stories", label: "Stories", width: 1080, height: 1920, tag: "9:16" },
  { id: "feed-sq", label: "Feed (1:1)", width: 1080, height: 1080, tag: "1:1" },
  { id: "feed-ls", label: "Feed (16:9)", width: 1920, height: 1080, tag: "16:9" },
] as const;

type VideoPlatform = (typeof VIDEO_PLATFORMS)[number]["id"];

// --- Durations ---
const DURATIONS = [
  { id: "5", label: "5s" },
  { id: "10", label: "10s" },
  { id: "15", label: "15s" },
  { id: "30", label: "30s" },
] as const;

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
];

export function VideoWorkspace() {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<VideoType>("demo");
  const [platform, setPlatform] = useState<VideoPlatform>("reels");
  const [duration, setDuration] = useState("5");
  const [overlayText, setOverlayText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const canvasRef = useRef<ImageCanvasRef>(null);

  const selectedPlatform = VIDEO_PLATFORMS.find((p) => p.id === platform)!;

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setCurrentImage(null);
    setActiveHistoryId(null);

    setTimeout(() => {
      const randomImg = DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)];
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        imageUrl: randomImg,
        prompt: `${videoType} · ${platform} · ${duration}s`,
        timestamp: new Date(),
        shotType: videoType,
        scene: platform,
      };
      setCurrentImage(randomImg);
      setHistory((prev) => [newItem, ...prev]);
      setActiveHistoryId(newItem.id);
      setIsGenerating(false);
    }, 2500);
  }, [videoType, platform, duration]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setCurrentImage(item.imageUrl);
    setActiveHistoryId(item.id);
  }, []);

  const handleRemoveHistory = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((i) => i.id !== id));
      if (activeHistoryId === id) {
        setActiveHistoryId(null);
        setCurrentImage(null);
      }
    },
    [activeHistoryId]
  );

  const canGenerate = !!productImage && !isGenerating;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-[300px] flex flex-col border-r bg-background flex-shrink-0">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            <ProductUpload image={productImage} onImageChange={setProductImage} />

            <Separator />

            {/* Video Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Video Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {VIDEO_TYPES.map((vt) => {
                  const Icon = vt.icon;
                  const isSelected = videoType === vt.id;
                  return (
                    <button
                      key={vt.id}
                      onClick={() => setVideoType(vt.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-md p-2 text-left transition-all duration-150 border",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-muted/60"
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-[11px] font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                        {vt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Platform / Format */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Platform
              </label>
              <div className="flex flex-wrap gap-1.5">
                {VIDEO_PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150",
                      platform === p.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Duration
              </label>
              <div className="flex gap-1.5">
                {DURATIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDuration(d.id)}
                    className={cn(
                      "flex-1 py-1.5 rounded-md text-xs font-medium transition-all duration-150 border",
                      duration === d.id
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted/60"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Text Overlay
              </Label>
              <Input
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                placeholder="Optional text on video…"
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Additional Instructions
              </label>
              <TextPromptInput
                value={prompt}
                onChange={setPrompt}
                placeholder="Optional: transitions, pacing, effects…"
              />
            </div>
          </div>
        </ScrollArea>

        <div className="p-3 border-t">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] text-muted-foreground">Output</span>
            <span className="text-[10px] font-medium tabular-nums">
              {selectedPlatform.width}×{selectedPlatform.height} · {duration}s
            </span>
          </div>
          <Button
            className="w-full gap-2 h-10"
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            {isGenerating ? (
              <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            {isGenerating ? "Generating…" : "Generate Video"}
          </Button>
          {!productImage && (
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Upload a product image to start
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-dot-pattern relative">
        <CanvasToolbar
          hasImage={!!currentImage}
          imageSrc={currentImage}
          onFitToScreen={() => canvasRef.current?.resetView()}
        />
        <div className="flex-1 overflow-hidden relative">
          <ImageCanvas ref={canvasRef} imageSrc={currentImage} isLoading={isGenerating} />
        </div>
      </div>

      <GenerationHistory
        items={history}
        activeId={activeHistoryId}
        onSelect={handleSelectHistory}
        onRemove={handleRemoveHistory}
      />
    </div>
  );
}
