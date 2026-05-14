"use client";

import { useState } from 'react';
import { 
  Camera,
  Megaphone,
  Share2,
  Film,
  Replace,
  Grid3X3,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductShotsWorkspace } from '@/components/studio/product-shots-workspace';
import { AdCreativesWorkspace } from '@/components/studio/ad-creatives-workspace';
import { SocialPostsWorkspace } from '@/components/studio/social-posts-workspace';
import { VideoWorkspace } from '@/components/studio/video-workspace';
import { BackgroundStudioWorkspace } from '@/components/studio/background-studio-workspace';
import { BatchResizeWorkspace } from '@/components/studio/batch-resize-workspace';

const TAB_TRIGGER_CLASS = "flex items-center gap-2 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary h-full -mb-px rounded-none text-sm";
const TAB_CONTENT_CLASS = "flex-1 overflow-hidden m-0 p-0 h-full data-[state=active]:flex";

export function StudioInterface() {
  const [activeTab, setActiveTab] = useState("product-shots");

  return (
    <div className="flex flex-col bg-background h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
          <div className="border-b px-4 flex justify-center flex-shrink-0 bg-card">
            <TabsList className="h-12 bg-transparent border-none p-0 gap-1">
              <TabsTrigger value="product-shots" className={TAB_TRIGGER_CLASS}>
                <Camera className="h-4 w-4" /><span>Product Shots</span>
              </TabsTrigger>
              <TabsTrigger value="ad-creatives" className={TAB_TRIGGER_CLASS}>
                <Megaphone className="h-4 w-4" /><span>Ad Creatives</span>
              </TabsTrigger>
              <TabsTrigger value="social-posts" className={TAB_TRIGGER_CLASS}>
                <Share2 className="h-4 w-4" /><span>Social Posts</span>
              </TabsTrigger>
              <TabsTrigger value="video" className={TAB_TRIGGER_CLASS}>
                <Film className="h-4 w-4" /><span>Video</span>
              </TabsTrigger>
              <TabsTrigger value="background-studio" className={TAB_TRIGGER_CLASS}>
                <Replace className="h-4 w-4" /><span>Background Studio</span>
              </TabsTrigger>
              <TabsTrigger value="batch-resize" className={TAB_TRIGGER_CLASS}>
                <Grid3X3 className="h-4 w-4" /><span>Batch Resize</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="product-shots" className={TAB_CONTENT_CLASS}>
            <ProductShotsWorkspace />
          </TabsContent>
          <TabsContent value="ad-creatives" className={TAB_CONTENT_CLASS}>
            <AdCreativesWorkspace />
          </TabsContent>
          <TabsContent value="social-posts" className={TAB_CONTENT_CLASS}>
            <SocialPostsWorkspace />
          </TabsContent>
          <TabsContent value="video" className={TAB_CONTENT_CLASS}>
            <VideoWorkspace />
          </TabsContent>
          <TabsContent value="background-studio" className={TAB_CONTENT_CLASS}>
            <BackgroundStudioWorkspace />
          </TabsContent>
          <TabsContent value="batch-resize" className={TAB_CONTENT_CLASS}>
            <BatchResizeWorkspace />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}