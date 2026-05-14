"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdCopyInputsProps {
  headline: string;
  onHeadlineChange: (value: string) => void;
  ctaText: string;
  onCtaChange: (value: string) => void;
  bodyText: string;
  onBodyChange: (value: string) => void;
}

export function AdCopyInputs({
  headline,
  onHeadlineChange,
  ctaText,
  onCtaChange,
  bodyText,
  onBodyChange,
}: AdCopyInputsProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Ad Copy
      </label>

      <div className="space-y-2.5">
        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">Headline</Label>
          <Input
            value={headline}
            onChange={(e) => onHeadlineChange(e.target.value)}
            placeholder="e.g., 50% Off This Weekend Only"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">Body Text</Label>
          <Input
            value={bodyText}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder="e.g., Premium quality at unbeatable prices"
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] text-muted-foreground">CTA Button</Label>
          <Input
            value={ctaText}
            onChange={(e) => onCtaChange(e.target.value)}
            placeholder="e.g., Shop Now"
            className="h-8 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
