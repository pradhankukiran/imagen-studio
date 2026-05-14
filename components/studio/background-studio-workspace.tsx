"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { TextPromptInput } from "@/components/studio/text-prompt-input";
import { ImageCanvas, ImageCanvasRef } from "@/components/studio/image-canvas";
import { CanvasToolbar } from "@/components/studio/canvas-toolbar";
import { ProductUpload } from "@/components/studio/product-upload";
import { ScenePresets, ScenePreset } from "@/components/studio/scene-presets";
import { GenerationHistory, HistoryItem } from "@/components/studio/generation-history";
import { Wand2, Eraser, Replace, Paintbrush } from "lucide-react";

const BG_ACTIONS = [
  { id: "remove", label: "Remove Background", description: "Transparent or white BG", icon: Eraser },
  { id: "replace", label: "Replace Background", description: "Swap to a new scene", icon: Replace },
  { id: "enhance", label: "Enhance Background", description: "Clean up & improve existing", icon: Paintbrush },
] as const;

type BgAction = (typeof BG_ACTIONS)[number]["id"];

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1587334274328-64186a80eed2?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop",
];

export function BackgroundStudioWorkspace() {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [action, setAction] = useState<BgAction>("remove");
  const [scenePreset, setScenePreset] = useState<ScenePreset>("studio-white");
  const [addShadow, setAddShadow] = useState(true);
  const [addReflection, setAddReflection] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const canvasRef = useRef<ImageCanvasRef>(null);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setCurrentImage(null);
    setActiveHistoryId(null);
    setTimeout(() => {
      const img = DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)];
      const item: HistoryItem = {
        id: crypto.randomUUID(), imageUrl: img,
        prompt: `${action} BG${action === "replace" ? ` → ${scenePreset}` : ""}`,
        timestamp: new Date(), shotType: action, scene: scenePreset,
      };
      setCurrentImage(img);
      setHistory((prev) => [item, ...prev]);
      setActiveHistoryId(item.id);
      setIsGenerating(false);
    }, 2000);
  }, [action, scenePreset]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setCurrentImage(item.imageUrl); setActiveHistoryId(item.id);
  }, []);

  const handleRemoveHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((i) => i.id !== id));
    if (activeHistoryId === id) { setActiveHistoryId(null); setCurrentImage(null); }
  }, [activeHistoryId]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-[300px] flex flex-col border-r bg-background flex-shrink-0">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            <ProductUpload image={productImage} onImageChange={setProductImage} />
            <Separator />
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</label>
              <div className="space-y-1.5">
                {BG_ACTIONS.map((a) => {
                  const Icon = a.icon;
                  const sel = action === a.id;
                  return (
                    <button key={a.id} onClick={() => setAction(a.id)}
                      className={cn("w-full flex items-center gap-3 rounded-lg p-2.5 text-left transition-all duration-150 border",
                        sel ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/60")}>
                      <Icon className={cn("h-4 w-4 flex-shrink-0", sel ? "text-primary" : "text-muted-foreground")} />
                      <div>
                        <div className={cn("text-xs font-medium", sel ? "text-foreground" : "text-muted-foreground")}>{a.label}</div>
                        <div className="text-[10px] text-muted-foreground/60">{a.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            {action === "replace" && (<><Separator /><ScenePresets value={scenePreset} onChange={setScenePreset} /></>)}
            <Separator />
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Adjustments</label>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Add Shadow</Label>
                  <Switch checked={addShadow} onCheckedChange={setAddShadow} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Add Reflection</Label>
                  <Switch checked={addReflection} onCheckedChange={setAddReflection} />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Additional Instructions</label>
              <TextPromptInput value={prompt} onChange={setPrompt} placeholder="Optional: lighting, color adjustments…" />
            </div>
          </div>
        </ScrollArea>
        <div className="p-3 border-t">
          <Button className="w-full gap-2 h-10" onClick={handleGenerate} disabled={!productImage || isGenerating}>
            {isGenerating ? <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {isGenerating ? "Processing…" : "Process Background"}
          </Button>
          {!productImage && <p className="text-[10px] text-muted-foreground text-center mt-2">Upload a product image to start</p>}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0 bg-dot-pattern relative">
        <CanvasToolbar hasImage={!!currentImage} imageSrc={currentImage} onFitToScreen={() => canvasRef.current?.resetView()} />
        <div className="flex-1 overflow-hidden relative">
          <ImageCanvas ref={canvasRef} imageSrc={currentImage} isLoading={isGenerating} />
        </div>
      </div>
      <GenerationHistory items={history} activeId={activeHistoryId} onSelect={handleSelectHistory} onRemove={handleRemoveHistory} />
    </div>
  );
}
