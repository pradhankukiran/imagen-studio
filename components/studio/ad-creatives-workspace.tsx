"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextPromptInput } from "@/components/studio/text-prompt-input";
import { ImageCanvas, ImageCanvasRef } from "@/components/studio/image-canvas";
import { CanvasToolbar } from "@/components/studio/canvas-toolbar";
import { ProductUpload } from "@/components/studio/product-upload";
import { PlatformSelector, PlatformId, getFormatById } from "@/components/studio/platform-selector";
import { AdCopyInputs } from "@/components/studio/ad-copy-inputs";
import { GenerationHistory, HistoryItem } from "@/components/studio/generation-history";
import { Wand2 } from "lucide-react";

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=800&auto=format&fit=crop",
];

export function AdCreativesWorkspace() {
  // Sidebar state
  const [productImage, setProductImage] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>("meta");
  const [selectedFormat, setSelectedFormat] = useState("meta-feed");
  const [headline, setHeadline] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Canvas & results
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const canvasRef = useRef<ImageCanvasRef>(null);

  const format = getFormatById(selectedFormat);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setCurrentImage(null);
    setActiveHistoryId(null);

    setTimeout(() => {
      const randomImg = DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)];
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        imageUrl: randomImg,
        prompt: headline
          ? `${headline} — ${selectedPlatform} ${format?.label || ""}`
          : `${selectedPlatform} ${format?.label || ""} ad`,
        timestamp: new Date(),
        shotType: selectedPlatform,
        scene: selectedFormat,
      };

      setCurrentImage(randomImg);
      setHistory((prev) => [newItem, ...prev]);
      setActiveHistoryId(newItem.id);
      setIsGenerating(false);
    }, 2000);
  }, [headline, selectedPlatform, selectedFormat, format]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setCurrentImage(item.imageUrl);
    setActiveHistoryId(item.id);
  }, []);

  const handleRemoveHistory = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (activeHistoryId === id) {
        setActiveHistoryId(null);
        setCurrentImage(null);
      }
    },
    [activeHistoryId]
  );

  const handleFitToScreen = useCallback(() => {
    canvasRef.current?.resetView();
  }, []);

  const canGenerate = !!productImage && !isGenerating;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* ─── Left Sidebar ─── */}
      <div className="w-[300px] flex flex-col border-r bg-background flex-shrink-0">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            <ProductUpload image={productImage} onImageChange={setProductImage} />

            <Separator />

            <PlatformSelector
              selectedPlatform={selectedPlatform}
              selectedFormat={selectedFormat}
              onPlatformChange={setSelectedPlatform}
              onFormatChange={setSelectedFormat}
            />

            <Separator />

            <AdCopyInputs
              headline={headline}
              onHeadlineChange={setHeadline}
              ctaText={ctaText}
              onCtaChange={setCtaText}
              bodyText={bodyText}
              onBodyChange={setBodyText}
            />

            <Separator />

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Additional Instructions
              </label>
              <TextPromptInput
                value={prompt}
                onChange={setPrompt}
                placeholder="Optional: style, mood, color scheme…"
              />
            </div>
          </div>
        </ScrollArea>

        <div className="p-3 border-t">
          {/* Format indicator */}
          {format && (
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] text-muted-foreground">Output size</span>
              <span className="text-[10px] font-medium tabular-nums">
                {format.width} × {format.height}px
              </span>
            </div>
          )}
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
            {isGenerating ? "Generating…" : "Generate Ad"}
          </Button>
          {!productImage && (
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Upload a product image to start
            </p>
          )}
        </div>
      </div>

      {/* ─── Center Canvas ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-dot-pattern relative">
        <CanvasToolbar
          hasImage={!!currentImage}
          imageSrc={currentImage}
          onFitToScreen={handleFitToScreen}
        />
        <div className="flex-1 overflow-hidden relative">
          <ImageCanvas
            ref={canvasRef}
            imageSrc={currentImage}
            isLoading={isGenerating}
          />
        </div>
      </div>

      {/* ─── Right History Panel ─── */}
      <GenerationHistory
        items={history}
        activeId={activeHistoryId}
        onSelect={handleSelectHistory}
        onRemove={handleRemoveHistory}
      />
    </div>
  );
}
