"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TextPromptInput } from "@/components/studio/text-prompt-input";
import { ImageCanvas, ImageCanvasRef } from "@/components/studio/image-canvas";
import { CanvasToolbar } from "@/components/studio/canvas-toolbar";
import { ProductUpload } from "@/components/studio/product-upload";
import { ShotTypeSelector, ShotType } from "@/components/studio/shot-type-selector";
import { ScenePresets, ScenePreset } from "@/components/studio/scene-presets";
import {
  GenerationHistory,
  HistoryItem,
} from "@/components/studio/generation-history";
import { Wand2 } from "lucide-react";

// Placeholder images until API is wired
const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=800&auto=format&fit=crop",
];

export function ProductShotsWorkspace() {
  // Sidebar state
  const [productImage, setProductImage] = useState<string | null>(null);
  const [shotType, setShotType] = useState<ShotType>("hero");
  const [scenePreset, setScenePreset] = useState<ScenePreset>("studio-white");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [variations, setVariations] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);

  // Canvas & results state
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const canvasRef = useRef<ImageCanvasRef>(null);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setCurrentImage(null);
    setActiveHistoryId(null);

    // Simulate — will be replaced with real API call
    setTimeout(() => {
      const randomImg = DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)];
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        imageUrl: randomImg,
        prompt: prompt || `${shotType} shot, ${scenePreset} scene`,
        timestamp: new Date(),
        shotType,
        scene: scenePreset,
      };

      setCurrentImage(randomImg);
      setHistory((prev) => [newItem, ...prev]);
      setActiveHistoryId(newItem.id);
      setIsGenerating(false);
    }, 2000);
  }, [prompt, shotType, scenePreset]);

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

            <ShotTypeSelector value={shotType} onChange={setShotType} />

            <Separator />

            <ScenePresets value={scenePreset} onChange={setScenePreset} />

            <Separator />

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Additional Instructions
              </label>
              <TextPromptInput
                value={prompt}
                onChange={setPrompt}
                placeholder="Optional: specific details, lighting, angle…"
              />
            </div>

            <Accordion type="single" collapsible>
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 hover:no-underline">
                  Advanced Settings
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Variations</Label>
                      <span className="text-xs tabular-nums font-medium">{variations}</span>
                    </div>
                    <Slider
                      value={[variations]}
                      onValueChange={([v]) => setVariations(v)}
                      min={1}
                      max={4}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Negative Prompt</Label>
                    <TextPromptInput
                      value={negativePrompt}
                      onChange={setNegativePrompt}
                      placeholder="What to avoid: blurry, distorted…"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>

        <div className="p-3 border-t">
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
            {isGenerating ? "Generating…" : "Generate"}
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
