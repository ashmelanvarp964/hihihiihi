
"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Footer() {
  const logo = PlaceHolderImages.find(img => img.id === "astracloud-logo")!;

  return (
    <footer className="w-full border-t bg-card py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 overflow-hidden rounded">
              <Image 
                src={logo.imageUrl} 
                alt="AstraCloud" 
                width={32} 
                height={32} 
                className="object-cover"
                data-ai-hint={logo.imageHint}
              />
            </div>
            <span className="text-xl font-black font-headline text-primary">AstraCloud</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            High-performance cloud solutions and game server hosting built for the next generation of digital experiences. AstraCloud Hosting - Reliable and Fast.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="w-5 h-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Github className="w-5 h-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="w-5 h-5" /></Link>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-muted-foreground">Hosting</h4>
          <ul className="space-y-3 text-sm font-bold">
            <li><Link href="/plans/vps" className="hover:text-primary">Intel Platinum VPS</Link></li>
            <li><Link href="/plans/vps" className="hover:text-primary">AMD EPYC VPS</Link></li>
            <li><Link href="/plans/minecraft" className="hover:text-primary">Minecraft Hosting</Link></li>
            <li><Link href="/plans/minecraft" className="hover:text-primary">Game Servers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-muted-foreground">Company</h4>
          <ul className="space-y-3 text-sm font-bold">
            <li><Link href="#" className="hover:text-primary">About Us</Link></li>
            <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/support" className="hover:text-primary">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-muted-foreground">Support</h4>
          <ul className="space-y-3 text-sm font-bold">
            <li><Link href="/support" className="hover:text-primary">Knowledge Base</Link></li>
            <li><Link href="/support" className="hover:text-primary">Submit a Ticket</Link></li>
            <li><Link href="#" className="hover:text-primary">Network Status</Link></li>
            <li><Link href="#" className="hover:text-primary">API Documentation</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
        © {new Date().getFullYear()} AstraCloud Hosting. All rights reserved.
      </div>
    </footer>
  );
}
