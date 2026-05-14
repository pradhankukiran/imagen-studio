"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera,
  Megaphone,
  Share2,
  Film,
  Replace,
  Grid3X3,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductShotsWorkspace } from '@/components/studio/product-shots-workspace';

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
          
          <TabsContent value="ad-creatives" className="flex-1 overflow-auto m-0 p-0 h-full data-[state=active]:flex">
            <TabPlaceholder icon={<Megaphone className="h-16 w-16" />} title="Ad Creatives" description="Coming Soon" />
          </TabsContent>
          <TabsContent value="social-posts" className="flex-1 overflow-auto m-0 p-0 h-full data-[state=active]:flex">
            <TabPlaceholder icon={<Share2 className="h-16 w-16" />} title="Social Posts" description="Coming Soon" />
          </TabsContent>
          <TabsContent value="video" className="flex-1 overflow-auto m-0 p-0 h-full data-[state=active]:flex">
            <TabPlaceholder icon={<Film className="h-16 w-16" />} title="Video" description="Coming Soon" />
          </TabsContent>
          <TabsContent value="background-studio" className="flex-1 overflow-auto m-0 p-0 h-full data-[state=active]:flex">
            <TabPlaceholder icon={<Replace className="h-16 w-16" />} title="Background Studio" description="Coming Soon" />
          </TabsContent>
          <TabsContent value="batch-resize" className="flex-1 overflow-auto m-0 p-0 h-full data-[state=active]:flex">
            <TabPlaceholder icon={<Grid3X3 className="h-16 w-16" />} title="Batch Resize" description="Coming Soon" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TabPlaceholder({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/30 min-h-full w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md text-center">
        <div className="mx-auto mb-6 text-muted-foreground flex justify-center">{icon}</div>
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Button variant="outline" className="gap-2"><Sparkles className="h-4 w-4" />Coming Soon</Button>
      </motion.div>
    </div>
  );
}