"use client";

import { cn } from "@/lib/utils";

const SCENE_PRESETS = [
  {
    id: "studio-white",
    label: "Studio White",
    gradient: "bg-gradient-to-br from-gray-100 to-white",
    darkGradient: "dark:from-gray-300 dark:to-gray-100",
  },
  {
    id: "marble",
    label: "Marble",
    gradient: "bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300",
    darkGradient: "dark:from-gray-400 dark:via-gray-200 dark:to-gray-400",
  },
  {
    id: "wooden",
    label: "Wood Table",
    gradient: "bg-gradient-to-br from-amber-800 to-amber-950",
    darkGradient: "",
  },
  {
    id: "nature",
    label: "Outdoor",
    gradient: "bg-gradient-to-br from-emerald-400 to-green-700",
    darkGradient: "",
  },
  {
    id: "minimal-dark",
    label: "Dark Minimal",
    gradient: "bg-gradient-to-br from-gray-800 to-gray-950",
    darkGradient: "",
  },
  {
    id: "pastel",
    label: "Soft Pastel",
    gradient: "bg-gradient-to-br from-pink-200 via-purple-100 to-blue-200",
    darkGradient: "",
  },
  {
    id: "concrete",
    label: "Concrete",
    gradient: "bg-gradient-to-br from-stone-400 to-stone-600",
    darkGradient: "",
  },
  {
    id: "custom",
    label: "Custom",
    gradient: "bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20",
    darkGradient: "",
    isCustom: true,
  },
] as const;

export type ScenePreset = (typeof SCENE_PRESETS)[number]["id"];

interface ScenePresetsProps {
  value: ScenePreset;
  onChange: (value: ScenePreset) => void;
}

export function ScenePresets({ value, onChange }: ScenePresetsProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Scene / Background
      </label>
      <div className="grid grid-cols-4 gap-1.5">
        {SCENE_PRESETS.map((scene) => {
          const isSelected = value === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => onChange(scene.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition-all duration-150"
              )}
            >
              <div
                className={cn(
                  "w-full aspect-square rounded-md border-2 transition-all duration-150",
                  scene.gradient,
                  scene.darkGradient,
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 scale-105"
                    : "border-transparent hover:border-muted-foreground/30 hover:scale-105"
                )}
              >
                {"isCustom" in scene && scene.isCustom && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+</span>
                  </div>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] leading-tight text-center truncate w-full",
                  isSelected
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {scene.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
