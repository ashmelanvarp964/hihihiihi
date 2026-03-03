
"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Cpu, Server, Shield, Zap, HardDrive, IndianRupee, Users } from "lucide-react";

const DISCORD_LINK = "https://discord.gg/ACpEqf3Qtn";

const plansData = {
  vps: {
    title: "AstraCloud VPS Hosting Plans",
    plans: [
      { name: "AMD EPYC Starter", price: "₹500", features: ["8GB RAM", "4 vCore (EPYC Performance)", "100GB NVMe SSD", "99.9% Network Uptime"] },
      { name: "AMD EPYC Pro", price: "₹700", features: ["16GB RAM", "6 vCore (EPYC Performance)", "150GB NVMe SSD", "99.9% Network Uptime"] },
      { name: "Intel Platinum Starter", price: "₹550", features: ["8GB RAM", "4 vCore (High Performance)", "100GB NVMe SSD", "99.9% Network Uptime"] },
      { name: "Intel Platinum Pro", price: "₹750", features: ["16GB RAM", "6 vCore (High Performance)", "150GB NVMe SSD", "99.9% Network Uptime"] }
    ]
  },
  minecraft: {
    title: "AstraCloud Minecraft Plans",
    plans: [
      { name: "Diamond Plan", price: "₹110", features: ["4GB RAM", "1 vCPU Core", "15GB NVMe SSD", "1–8 Players"] },
      { name: "Emerald Plan", price: "₹200", features: ["8GB RAM", "2 vCPU Core", "40GB NVMe SSD", "10–25 Players"] },
      { name: "Netherite Plan", price: "₹280", features: ["12GB RAM", "3 vCPU Core", "60GB NVMe SSD", "15–35 Players"] },
      { name: "Obsidian Plan", price: "₹350", features: ["16GB RAM", "4 vCPU Core", "80GB NVMe SSD", "25–50 Players"] },
      { name: "Bedrock Plan", price: "₹650", features: ["32GB RAM", "6 vCPU Core", "120GB NVMe SSD", "50+ Players"] }
    ]
  }
};

export default function PlanTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const data = type === 'vps' ? plansData.vps : plansData.minecraft;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-primary/10 text-foreground relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-4 bg-accent text-accent-foreground font-bold">99.9% UPTIME GUARANTEED</Badge>
          <h1 className="text-4xl md:text-5xl font-black font-headline mb-4">{data.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            High-performance hosting solutions running on Intel Platinum and AMD EPYC hardware.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.plans.map((plan, i) => (
              <Card key={i} className="shadow-xl overflow-hidden border-none flex flex-col bg-card/50 backdrop-blur-md hover:bg-card/80 transition-all">
                <CardHeader className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-primary border-primary uppercase font-bold">{type}</Badge>
                    <div className="text-right">
                      <div className="text-3xl font-black text-primary flex items-center justify-end gap-1">
                        <IndianRupee className="w-6 h-6" />
                        {plan.price.replace('₹', '')}
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Monthly</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black font-headline">{plan.name}</h3>
                </CardHeader>
                <CardContent className="p-8 flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-medium">
                        {f.includes("Players") ? <Users className="w-5 h-5 text-accent" /> : <Check className="w-5 h-5 text-accent" />} 
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" asChild>
                    <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer">Order Now</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-white/5 pt-12">
            <div className="text-center group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider">DDoS Protected</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider">Instant Setup</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider">Latest CPUs</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                <HardDrive className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider">NVMe SSDs</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
