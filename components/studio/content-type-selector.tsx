"use client";

import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Sparkles,
  Megaphone,
  Quote,
  BookOpen,
  Camera,
} from "lucide-react";

const CONTENT_TYPES = [
  {
    id: "product-showcase",
    label: "Product Showcase",
    icon: ShoppingBag,
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    icon: Camera,
  },
  {
    id: "announcement",
    label: "Announcement",
    icon: Megaphone,
  },
  {
    id: "quote",
    label: "Quote / Text",
    icon: Quote,
  },
  {
    id: "tutorial",
    label: "Tutorial / How-to",
    icon: BookOpen,
  },
  {
    id: "seasonal",
    label: "Seasonal / Event",
    icon: Sparkles,
  },
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number]["id"];

const MOODS = [
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
  { id: "playful", label: "Playful" },
  { id: "elegant", label: "Elegant" },
  { id: "warm", label: "Warm" },
  { id: "dark", label: "Dark" },
] as const;

export type Mood = (typeof MOODS)[number]["id"];

interface ContentTypeSelectorProps {
  value: ContentType;
  onChange: (value: ContentType) => void;
}

export function ContentTypeSelector({
  value,
  onChange,
}: ContentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Content Type
      </label>
      <div className="grid grid-cols-2 gap-1.5">
        {CONTENT_TYPES.map((ct) => {
          const Icon = ct.icon;
          const isSelected = value === ct.id;
          return (
            <button
              key={ct.id}
              onClick={() => onChange(ct.id)}
              className={cn(
                "flex items-center gap-2 rounded-md p-2 text-left transition-all duration-150 border",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:bg-muted/60"
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5 flex-shrink-0",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[11px] font-medium truncate",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {ct.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface MoodSelectorProps {
  value: Mood;
  onChange: (value: Mood) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Mood / Aesthetic
      </label>
      <div className="flex flex-wrap gap-1.5">
        {MOODS.map((mood) => {
          const isSelected = value === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => onChange(mood.id)}
              className={cn(
                "px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all duration-150 border",
                isSelected
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {mood.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
