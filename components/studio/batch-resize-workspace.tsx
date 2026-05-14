"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductUpload } from "@/components/studio/product-upload";
import { Download, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ALL_SIZES = [
  { id: "shopify-main", group: "Shopify", label: "Main Image", width: 2048, height: 2048 },
  { id: "shopify-thumb", group: "Shopify", label: "Thumbnail", width: 100, height: 100 },
  { id: "meta-feed", group: "Meta", label: "Feed Post", width: 1080, height: 1080 },
  { id: "meta-story", group: "Meta", label: "Story", width: 1080, height: 1920 },
  { id: "meta-link", group: "Meta", label: "Link Ad", width: 1200, height: 628 },
  { id: "ig-carousel", group: "Instagram", label: "Carousel", width: 1080, height: 1350 },
  { id: "ig-reel", group: "Instagram", label: "Reel Cover", width: 1080, height: 1920 },
  { id: "google-medium", group: "Google Display", label: "Medium Rect", width: 300, height: 250 },
  { id: "google-leader", group: "Google Display", label: "Leaderboard", width: 728, height: 90 },
  { id: "google-sky", group: "Google Display", label: "Skyscraper", width: 160, height: 600 },
  { id: "tiktok", group: "TikTok", label: "In-Feed", width: 1080, height: 1920 },
  { id: "pinterest", group: "Pinterest", label: "Standard Pin", width: 1000, height: 1500 },
  { id: "twitter", group: "X / Twitter", label: "Post Image", width: 1600, height: 900 },
  { id: "linkedin", group: "LinkedIn", label: "Post", width: 1200, height: 1200 },
  { id: "yt-thumb", group: "YouTube", label: "Thumbnail", width: 1280, height: 720 },
];

// Group sizes by their group field
function groupSizes() {
  const groups: Record<string, typeof ALL_SIZES> = {};
  for (const s of ALL_SIZES) {
    if (!groups[s.group]) groups[s.group] = [];
    groups[s.group].push(s);
  }
  return groups;
}

export function BatchResizeWorkspace() {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set(["shopify-main", "meta-feed", "ig-carousel"]));
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const groups = groupSizes();

  const toggleSize = useCallback((id: string) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectAllInGroup = useCallback((groupSizes: typeof ALL_SIZES) => {
    setSelectedSizes((prev) => {
      const next = new Set(prev);
      const allSelected = groupSizes.every((s) => next.has(s.id));
      groupSizes.forEach((s) => { if (allSelected) next.delete(s.id); else next.add(s.id); });
      return next;
    });
  }, []);

  const handleExport = useCallback(() => {
    if (!productImage || selectedSizes.size === 0) return;
    setIsExporting(true);
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      toast({ description: `Exported ${selectedSizes.size} sizes.` });
    }, 1500);
  }, [productImage, selectedSizes, toast]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left: Upload + Size Selection */}
      <div className="w-[300px] flex flex-col border-r bg-background flex-shrink-0">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            <ProductUpload image={productImage} onImageChange={setProductImage} />
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Export Sizes
                </label>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {selectedSizes.size} selected
                </span>
              </div>
              {Object.entries(groups).map(([group, sizes]) => {
                const allSelected = sizes.every((s) => selectedSizes.has(s.id));
                return (
                  <div key={group} className="space-y-1">
                    <button
                      onClick={() => selectAllInGroup(sizes)}
                      className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors w-full text-left flex items-center gap-1.5"
                    >
                      <div className={cn(
                        "h-3 w-3 rounded-sm border flex items-center justify-center transition-colors",
                        allSelected ? "bg-primary border-primary" : "border-muted-foreground/40"
                      )}>
                        {allSelected && <Check className="h-2 w-2 text-primary-foreground" />}
                      </div>
                      {group}
                    </button>
                    <div className="pl-5 space-y-0.5">
                      {sizes.map((s) => {
                        const checked = selectedSizes.has(s.id);
                        return (
                          <label
                            key={s.id}
                            className="flex items-center gap-2 py-1 cursor-pointer group"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleSize(s.id)}
                              className="h-3.5 w-3.5"
                            />
                            <span className={cn(
                              "text-[11px] flex-1",
                              checked ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                              {s.label}
                            </span>
                            <span className="text-[9px] text-muted-foreground/60 tabular-nums">
                              {s.width}×{s.height}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
        <div className="p-3 border-t">
          <Button
            className="w-full gap-2 h-10"
            onClick={handleExport}
            disabled={!productImage || selectedSizes.size === 0 || isExporting}
          >
            {isExporting ? (
              <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? "Exporting…" : `Export ${selectedSizes.size} Sizes`}
          </Button>
          {!productImage && <p className="text-[10px] text-muted-foreground text-center mt-2">Upload an image to start</p>}
        </div>
      </div>

      {/* Right: Preview Grid */}
      <div className="flex-1 overflow-auto bg-dot-pattern">
        <div className="p-6">
          {!productImage ? (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <p className="text-sm text-muted-foreground">Upload an image to preview sizes</p>
            </div>
          ) : selectedSizes.size === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <p className="text-sm text-muted-foreground">Select at least one size to preview</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ALL_SIZES.filter((s) => selectedSizes.has(s.id)).map((s) => {
                const maxPreview = 200;
                const ratio = Math.min(maxPreview / s.width, maxPreview / s.height);
                const pw = Math.round(s.width * ratio);
                const ph = Math.round(s.height * ratio);
                return (
                  <div key={s.id} className="flex flex-col items-center gap-2 p-3 rounded-lg border bg-background">
                    <div
                      className="border rounded overflow-hidden flex-shrink-0 bg-muted/30"
                      style={{ width: pw, height: ph }}
                    >
                      <img
                        src={productImage}
                        alt={s.label}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium">{s.group} — {s.label}</div>
                      <div className="text-[10px] text-muted-foreground tabular-nums">{s.width} × {s.height}px</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
