"use client";

import { cn } from "@/lib/utils";
import {
  Camera,
  Armchair,
  LayoutGrid,
  ZoomIn,
  User,
  Layers,
} from "lucide-react";

const SHOT_TYPES = [
  {
    id: "hero",
    label: "Hero Shot",
    description: "Front-and-center, clean BG",
    icon: Camera,
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    description: "Real-world scene placement",
    icon: Armchair,
  },
  {
    id: "flatlay",
    label: "Flat Lay",
    description: "Top-down arrangement",
    icon: LayoutGrid,
  },
  {
    id: "closeup",
    label: "Close-up",
    description: "Macro texture & detail",
    icon: ZoomIn,
  },
  {
    id: "model",
    label: "Model Shot",
    description: "Worn or held by a person",
    icon: User,
  },
  {
    id: "group",
    label: "Group",
    description: "Multiple products together",
    icon: Layers,
  },
] as const;

export type ShotType = (typeof SHOT_TYPES)[number]["id"];

interface ShotTypeSelectorProps {
  value: ShotType;
  onChange: (value: ShotType) => void;
}

export function ShotTypeSelector({ value, onChange }: ShotTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Shot Type
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {SHOT_TYPES.map((shot) => {
          const Icon = shot.icon;
          const isSelected = value === shot.id;
          return (
            <button
              key={shot.id}
              onClick={() => onChange(shot.id)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg p-2.5 text-left transition-all duration-150 border",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-transparent hover:bg-muted/60"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 flex-shrink-0",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium truncate",
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {shot.label}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/70 leading-tight pl-[22px]">
                {shot.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
