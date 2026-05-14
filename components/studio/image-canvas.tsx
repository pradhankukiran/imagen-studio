"use client";

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, Upload, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type CanvasState = "empty" | "loading" | "result";

interface ImageCanvasProps {
  imageSrc: string | null;
  isLoading?: boolean;
  onRequestUpload?: () => void;
}

export interface ImageCanvasRef {
  resetView: () => void;
}

export const ImageCanvas = forwardRef<ImageCanvasRef, ImageCanvasProps>(
  function ImageCanvas({ imageSrc, isLoading = false, onRequestUpload }, ref) {
    const [zoom, setZoom] = useState(1);
    const [panning, setPanning] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const state: CanvasState = isLoading
      ? "loading"
      : imageSrc
      ? "result"
      : "empty";

    const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 3));
    const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.3));

    const resetView = () => {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };

    useImperativeHandle(ref, () => ({ resetView }));

    // Reset view when new image loads
    useEffect(() => {
      if (imageSrc) resetView();
    }, [imageSrc]);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (state !== "result") return;
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        setPanning(true);
      }
    };

    const handleMouseUp = () => setPanning(false);

    const handleMouseMove = (e: React.MouseEvent) => {
      if (panning) {
        setPosition((p) => ({
          x: p.x + e.movementX,
          y: p.y + e.movementY,
        }));
      }
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const delta = e.deltaY * -0.005;
          setZoom((z) => Math.max(0.3, Math.min(3, z + delta)));
        }
      };

      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => canvas.removeEventListener("wheel", handleWheel);
    }, []);

    return (
      <div
        ref={canvasRef}
        className="relative h-full w-full overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        <AnimatePresence mode="wait">
          {/* Empty State */}
          {state === "empty" && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4 max-w-xs text-center">
                <div className="relative">
                  <div className="rounded-2xl bg-muted/60 p-6 border border-dashed border-muted-foreground/20">
                    <ImagePlus className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-primary/10 p-1.5">
                    <Upload className="h-3 w-3 text-primary" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">
                    No image yet
                  </p>
                  <p className="text-xs text-muted-foreground/60 leading-relaxed">
                    Upload a product photo and configure your shot settings, then
                    hit Generate.
                  </p>
                </div>
                {onRequestUpload && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 mt-1"
                    onClick={onRequestUpload}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Product
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {state === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="flex flex-col items-center gap-5">
                <div className="relative w-64 h-64 rounded-xl overflow-hidden border">
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/40 to-transparent animate-shimmer" />
                </div>
                <div className="flex items-center gap-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground font-medium">
                    Generating your product shot…
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Result State */}
          {state === "result" && imageSrc && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                x: position.x,
                y: position.y,
                scale: zoom,
              }}
              className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <div className="relative rounded-lg shadow-2xl shadow-black/20 overflow-hidden border border-border/50">
                <img
                  src={imageSrc}
                  alt="Generated product shot"
                  className="max-w-full object-contain select-none pointer-events-none"
                  style={{ maxHeight: "70vh", maxWidth: "70vw" }}
                  draggable={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom controls — only shown when there's an image */}
        {state === "result" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background/90 backdrop-blur-md px-2 py-1 rounded-full shadow-lg border"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <button
              onClick={resetView}
              className="min-w-[44px] text-center text-xs tabular-nums text-muted-foreground hover:text-foreground transition-colors px-1"
            >
              {Math.round(zoom * 100)}%
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        )}
      </div>
    );
  }
);