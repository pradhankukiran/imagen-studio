"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Paintbrush, Wand2, Layers, Image as ImageIcon, Users, ShieldCheck } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Paintbrush className="h-6 w-6" />
            <span>Imagen Studio</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
            <Link href="#examples" className="transition-colors hover:text-primary">Examples</Link>
            <Link href="#pricing" className="transition-colors hover:text-primary">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/studio">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-24 md:pt-32 pb-16 container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 pb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                Create, Edit, Transform with AI
              </h1>
              <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
                Unleash your creativity with our AI-powered image generation and editing platform.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/studio">
                <Button size="lg" className="gap-2">
                  <Wand2 className="h-5 w-5" />
                  Start Creating
                </Button>
              </Link>
              <Link href="#examples">
                <Button size="lg" variant="outline" className="gap-2">
                  <ImageIcon className="h-5 w-5" />
                  See Examples
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden mt-8 shadow-xl"
          >
            <Image
              src="https://images.pexels.com/photos/20055559/pexels-photo-20055559/free-photo-of-woman-typing-on-typewriter.jpeg"
              alt="Imagen Studio Platform"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
              <div className="text-white p-8 md:p-12 max-w-lg">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Professional-grade editing with the simplicity of AI
                </h2>
                <p className="text-lg opacity-90">
                  Turn concepts into stunning visuals with natural language prompts and intuitive editing tools.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-2">Key Features</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Advanced capabilities powered by Imagen 3 AI technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Wand2 className="h-10 w-10 mb-4 text-primary" />,
                  title: "AI Image Generation",
                  description: "Create stunning images from text descriptions using Imagen 3 AI technology."
                },
                {
                  icon: <Layers className="h-10 w-10 mb-4 text-primary" />,
                  title: "Region-based Editing",
                  description: "Select specific regions of your image for targeted edits and modifications."
                },
                {
                  icon: <ImageIcon className="h-10 w-10 mb-4 text-primary" />,
                  title: "Content Manipulation",
                  description: "Remove objects, transfer styles, and change backgrounds with AI assistance."
                },
                {
                  icon: <Paintbrush className="h-10 w-10 mb-4 text-primary" />,
                  title: "Natural Language Editing",
                  description: "Describe the changes you want in plain English and let AI do the work."
                },
                {
                  icon: <Users className="h-10 w-10 mb-4 text-primary" />,
                  title: "Collaboration Tools",
                  description: "Share your projects and collaborate with team members in real-time."
                },
                {
                  icon: <ShieldCheck className="h-10 w-10 mb-4 text-primary" />,
                  title: "Secure Storage",
                  description: "Your images are securely stored with enterprise-grade encryption."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card p-6 rounded-lg shadow-sm border"
                >
                  {feature.icon}
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="examples" className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-2">See it in Action</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Examples of what's possible with Imagen Studio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative rounded-lg overflow-hidden aspect-video shadow-lg"
              >
                <Image
                  src="https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg"
                  alt="Example 1"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Landscape Transformation</h3>
                    <p className="opacity-90">From winter landscape to summer paradise in one click</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative rounded-lg overflow-hidden aspect-video shadow-lg"
              >
                <Image
                  src="https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg"
                  alt="Example 2"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Style Transfer</h3>
                    <p className="opacity-90">Apply artistic styles to your photos with AI</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="text-center mt-12">
              <Link href="/studio">
                <Button size="lg">Try It Yourself</Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-2">Simple Pricing</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Choose the plan that works for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Free",
                  price: "$0",
                  description: "Perfect for trying out the platform",
                  features: [
                    "5 AI image generations per month",
                    "Basic editing tools",
                    "720p max resolution",
                    "Community support"
                  ]
                },
                {
                  name: "Pro",
                  price: "$19",
                  period: "/month",
                  description: "For creative professionals",
                  features: [
                    "100 AI image generations per month",
                    "Advanced editing tools",
                    "4K max resolution",
                    "Priority support",
                    "Save editing history"
                  ],
                  highlighted: true
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description: "For teams and businesses",
                  features: [
                    "Unlimited AI image generations",
                    "All editing features",
                    "8K max resolution",
                    "Dedicated support",
                    "API access",
                    "Custom integrations"
                  ]
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-card rounded-lg overflow-hidden shadow-sm border ${plan.highlighted ? 'border-primary shadow-lg relative' : ''}`}
                >
                  {plan.highlighted && (
                    <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider text-center py-1">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      Choose Plan
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-semibold">
              <Paintbrush className="h-5 w-5" />
              <span>Imagen Studio</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Imagen Studio. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}