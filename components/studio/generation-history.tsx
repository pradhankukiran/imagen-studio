"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Clock, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: Date;
  shotType: string;
  scene: string;
}

interface GenerationHistoryProps {
  items: HistoryItem[];
  activeId: string | null;
  onSelect: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
}

export function GenerationHistory({
  items,
  activeId,
  onSelect,
  onRemove,
}: GenerationHistoryProps) {
  return (
    <div className="w-56 flex flex-col border-l bg-background/60 backdrop-blur-xl flex-shrink-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          History
        </span>
        <span className="text-[10px] text-muted-foreground/60 ml-auto tabular-nums">
          {items.length}
        </span>
      </div>

      {/* Items */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1.5">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="rounded-full bg-muted p-3 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Generated images
                  <br />
                  will appear here
                </p>
              </motion.div>
            ) : (
              items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <div
                    className={cn(
                      "group relative rounded-lg overflow-hidden cursor-pointer border transition-all duration-150",
                      activeId === item.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-muted-foreground/30"
                    )}
                    onClick={() => onSelect(item)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full aspect-square object-cover"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[10px] text-white/90 line-clamp-2 leading-tight">
                          {item.prompt}
                        </p>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                      }}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/50 text-white/80 hover:bg-destructive hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
