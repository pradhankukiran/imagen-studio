"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera,
  Megaphone,
  Share2,
  Video,
  Eraser,
  Scaling,
  Wand2,
  Loader2,
  Terminal,
  ImagePlus,
  Upload,
  Sparkles,
  Film,
  Replace,
  Grid3X3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TextPromptInput } from '@/components/studio/text-prompt-input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function StudioInterface() {
  const [activeTab, setActiveTab] = useState("product-shots");

  return (
    <div className="flex flex-col bg-background h-screen">
      {/* Top Bar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
          <div className="border-b px-4 flex justify-center flex-shrink-0 bg-card">
            <TabsList className="h-12 bg-transparent border-none p-0 gap-1">
              <TabsTrigger value="product-shots" className="flex items-center gap-2 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary h-full -mb-px rounded-none text-sm">
                <Camera className="h-4 w-4" />
                <span>Product Shots</span>
              </TabsTrigger>
              <TabsTrigger value="ad-creatives" className="flex items-center gap-2 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary h-full -mb-px rounded-none text-sm">
                <Megaphone className="h-4 w-4" />
                <span>Ad Creatives</span>
              </TabsTrigger>
              <TabsTrigger value="social-posts" className="flex items-center gap-2 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary h-full -mb-px rounded-none text-sm">
                <Share2 className="h-4 w-4" />
                <span>Social Posts</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary h-full -mb-px rounded-none text-sm">
                <Film className="h-4 w-4" />
                <span>Video</span>
              </TabsTrigger>
              <TabsTrigger value="background-studio" className="flex items-center gap-2 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary h-full -mb-px rounded-none text-sm">
                <Replace className="h-4 w-4" />
                <span>Background Studio</span>
              </TabsTrigger>
              <TabsTrigger value="batch-resize" className="flex items-center gap-2 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary h-full -mb-px rounded-none text-sm">
                <Grid3X3 className="h-4 w-4" />
                <span>Batch Resize</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Product Shots */}
          <TabsContent value="product-shots" className="flex-1 overflow-auto">
            <TabPlaceholder
              icon={<Camera className="h-16 w-16" />}
              title="Product Shots"
              description="Generate professional product images for Shopify listings — hero shots, lifestyle placements, white backgrounds, and model shots."
            />
          </TabsContent>

          {/* Ad Creatives */}
          <TabsContent value="ad-creatives" className="flex-1 overflow-auto">
            <TabPlaceholder
              icon={<Megaphone className="h-16 w-16" />}
              title="Ad Creatives"
              description="Create high-converting ad banners for Meta, Google Display, and TikTok — with text overlays, CTAs, and platform-specific sizing."
            />
          </TabsContent>

          {/* Social Posts */}
          <TabsContent value="social-posts" className="flex-1 overflow-auto">
            <TabPlaceholder
              icon={<Share2 className="h-16 w-16" />}
              title="Social Posts"
              description="Design organic social content for Instagram carousels, Stories, Reels covers, Pinterest pins, and more."
            />
          </TabsContent>

          {/* Video */}
          <TabsContent value="video" className="flex-1 overflow-auto">
            <TabPlaceholder
              icon={<Film className="h-16 w-16" />}
              title="Video"
              description="Generate short-form product videos — demos, unboxing animations, before/after clips for Reels, TikTok, and YouTube Shorts."
            />
          </TabsContent>

          {/* Background Studio */}
          <TabsContent value="background-studio" className="flex-1 overflow-auto">
            <TabPlaceholder
              icon={<Replace className="h-16 w-16" />}
              title="Background Studio"
              description="Remove, replace, or enhance product backgrounds — white background cleanup, lifestyle scene swaps, shadow and reflection adjustments."
            />
          </TabsContent>

          {/* Batch Resize */}
          <TabsContent value="batch-resize" className="flex-1 overflow-auto">
            <TabPlaceholder
              icon={<Grid3X3 className="h-16 w-16" />}
              title="Batch Resize"
              description="Take one asset and export it across all platform sizes — Shopify, Meta, Instagram Story, Google Display, and more in one click."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* Placeholder component for tabs that haven't been built yet */
interface TabPlaceholderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TabPlaceholder({ icon, title, description }: TabPlaceholderProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/30 min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md text-center"
      >
        <div className="mx-auto mb-6 text-muted-foreground">
          {icon}
        </div>
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Coming Soon
        </Button>
      </motion.div>
    </div>
  );
}