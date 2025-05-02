"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wand2, 
  Image as ImageIcon, 
  Layers,
  Type,
  Box,
  Palette,
  Eraser,
  Crop,
  RotateCw,
  Undo,
  Redo,
  Zap,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudioSidebar } from '@/components/studio/studio-sidebar';
import { ImageCanvas } from '@/components/studio/image-canvas';
import { TextPromptInput } from '@/components/studio/text-prompt-input';
import { RegionToolbar } from '@/components/studio/region-toolbar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export function StudioInterface() {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedTool, setSelectedTool] = useState("select");
  const [showRegionToolbar, setShowRegionToolbar] = useState(false);
  
  // State for image generation
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [aspectRatio, setAspectRatio] = useState("1:1 (Square)");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageData, setGeneratedImageData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sample state for the current editing image
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    setShowRegionToolbar(tool === "region");
  };

  const handleGenerate = async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImageData(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, style, aspectRatio }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate image');
      }

      if (result.imageData) {
        const mimeType = result.mimeType || 'image/png';
        setGeneratedImageData(`data:${mimeType};base64,${result.imageData}`);
        // Optionally set this as the current image for editing
        // setCurrentImage(`data:image/png;base64,${result.imageData}`);
        // setActiveTab("edit"); // Optionally switch to edit tab
      } else {
        throw new Error('Image data not found in response');
      }

    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "An unknown error occurred during generation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-background">
      {/* Sidebar */}
      <StudioSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
          <div className="border-b px-4 flex-shrink-0 bg-card">
            <TabsList className="h-12 bg-transparent border-none p-0">
              <TabsTrigger value="create" className="flex items-center gap-2 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-t-md border-b-2 border-transparent data-[state=active]:border-primary h-full -mb-px">
                <Wand2 className="h-4 w-4" />
                <span>Create</span>
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center gap-2 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-t-md border-b-2 border-transparent data-[state=active]:border-primary h-full -mb-px">
                <ImageIcon className="h-4 w-4" />
                <span>Edit</span>
              </TabsTrigger>
              <TabsTrigger value="layers" className="flex items-center gap-2 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-t-md border-b-2 border-transparent data-[state=active]:border-primary h-full -mb-px">
                <Layers className="h-4 w-4" />
                <span>Layers</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Create Tab */}
          <TabsContent value="create" className="flex-1 overflow-auto">
            <div className="flex flex-col items-center justify-start p-6 pb-24 lg:p-12 lg:pb-32 bg-muted/30">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl bg-card rounded-lg shadow-lg overflow-hidden flex flex-col p-6 space-y-6 mb-12"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Create New Image</h2>
                  <p className="text-muted-foreground mb-4">
                    Describe the image you want to generate using natural language.
                  </p>
                  
                  {/* --- Text Prompt Input --- */}
                  <TextPromptInput 
                    value={prompt}
                    onChange={setPrompt}
                    disabled={isLoading}
                    placeholder="A futuristic cityscape at sunset, photorealistic style..."
                  />
                  
                  {/* --- Options (Placeholder) --- */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Style</label>
                      <select 
                        className="w-full h-10 px-3 rounded-md border bg-input text-foreground" 
                        disabled={isLoading}
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                      >
                        <option>Photorealistic</option>
                        <option>Cartoon</option>
                        <option>Oil Painting</option>
                        <option>Watercolor</option>
                        <option>Digital Art</option>
                        <option>Sketch</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Aspect Ratio</label>
                      <select 
                        className="w-full h-10 px-3 rounded-md border bg-input text-foreground" 
                        disabled={isLoading}
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                      >
                        <option>1:1 (Square)</option>
                        <option>16:9 (Landscape)</option>
                        <option>9:16 (Portrait)</option>
                        <option>4:3 (Standard)</option>
                        <option>3:2 (Classic)</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* --- Generate Button --- */}
                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={handleGenerate}
                      disabled={isLoading || !prompt}
                      className="gap-2 w-full sm:w-auto"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      {isLoading ? 'Generating...' : 'Generate Image'}
                    </Button>
                  </div>
                </div>

                {/* --- Output Area --- */}
                <div className="mt-4 space-y-4">
                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex justify-center items-center p-8 rounded-md border border-dashed">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Generating your image...</span>
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <Alert variant="destructive">
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Generation Failed</AlertTitle>
                      <AlertDescription>
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Success State - Display Image */}
                  {generatedImageData && !isLoading && (
                    <div className="border rounded-md overflow-hidden shadow-md">
                      <img 
                        src={generatedImageData}
                        alt={prompt || "Generated image"} 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </TabsContent>
          
          {/* Edit Tab */}
          <TabsContent value="edit">
            {currentImage ? (
              <div className="flex-1 flex flex-col h-full">
                {/* Toolbar */}
                <div className="bg-muted/30 border-b p-2 flex items-center justify-between flex-shrink-0">
                  <div className="flex gap-1">
                    <Button 
                      variant={selectedTool === "select" ? "secondary" : "ghost"} 
                      size="icon" 
                      onClick={() => handleToolSelect("select")}
                      title="Select"
                    >
                      <Box className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={selectedTool === "region" ? "secondary" : "ghost"} 
                      size="icon" 
                      onClick={() => handleToolSelect("region")}
                      title="Region Select"
                    >
                      <Layers className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={selectedTool === "text" ? "secondary" : "ghost"} 
                      size="icon" 
                      onClick={() => handleToolSelect("text")}
                      title="Text"
                    >
                      <Type className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={selectedTool === "eraser" ? "secondary" : "ghost"} 
                      size="icon" 
                      onClick={() => handleToolSelect("eraser")}
                      title="Eraser"
                    >
                      <Eraser className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={selectedTool === "crop" ? "secondary" : "ghost"} 
                      size="icon" 
                      onClick={() => handleToolSelect("crop")}
                      title="Crop"
                    >
                      <Crop className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={selectedTool === "rotate" ? "secondary" : "ghost"} 
                      size="icon" 
                      onClick={() => handleToolSelect("rotate")}
                      title="Rotate"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Undo">
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Redo">
                      <Redo className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Region Toolbar - Appears when region tool is selected */}
                {showRegionToolbar && <RegionToolbar />}
                
                {/* Canvas Area */}
                <div className="flex-1 bg-muted/50 flex items-center justify-center overflow-auto relative min-h-0">
                   {/* Pass currentImage to ImageCanvas if it expects it */}
                  <ImageCanvas imageSrc={currentImage} />
                </div>
                
                {/* AI Prompt for Editing */}
                <div className="p-4 border-t bg-background flex-shrink-0">
                  <div className="flex gap-2">
                    <TextPromptInput
                      value="" // Need state for edit prompt
                      onChange={() => {}} // Need handler for edit prompt
                      placeholder="Describe the changes you want to make to the selected region..."
                    />
                    <Button className="gap-2">
                       <Zap className="h-4 w-4" />
                       Apply Changes
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Placeholder when no image is being edited
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/30">
                <div className="max-w-md text-center">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Image Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload an image or create a new one to start editing
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline">Upload Image</Button>
                    <Button onClick={() => setActiveTab("create")}>Create New</Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Layers Tab */}
          <TabsContent value="layers">
            <div className="flex-1 grid grid-cols-[300px_1fr] divide-x h-full">
              <div className="p-4 space-y-4 overflow-y-auto bg-card">
                <h3 className="font-semibold text-lg">Layers</h3>
                <div className="space-y-2">
                  {['Background', 'Subject', 'Foreground', 'Effects'].map((layer, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                      <div className="w-4 h-4 rounded-sm bg-primary/20 border border-primary/30"></div>
                      <span>{layer}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 overflow-y-auto bg-muted/30">
                <h3 className="font-semibold text-lg mb-4">Layer Properties</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Opacity</label>
                    <input type="range" className="w-full" min="0" max="100" defaultValue="100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Blend Mode</label>
                    <select className="w-full h-10 px-3 rounded-md border bg-input text-foreground">
                      <option>Normal</option>
                      <option>Multiply</option>
                      <option>Screen</option>
                      <option>Overlay</option>
                    </select>
                  </div>
                  {/* Add more layer properties as needed */}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}