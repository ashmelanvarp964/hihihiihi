"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Server, Cpu, MessageSquare, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { useUser, useFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Navbar() {
  const { user } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();
  const logo = PlaceHolderImages.find(img => img.id === "astracloud-logo")!;

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-white border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Image 
              src={logo.imageUrl} 
              alt="AstraCloud" 
              width={32} 
              height={32} 
              className="object-contain"
              data-ai-hint={logo.imageHint}
            />
          </div>
          <span className="text-xl font-black font-headline tracking-tighter text-primary">AstraCloud</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-muted-foreground">
          <Link href="/plans/vps" className="hover:text-primary transition-colors flex items-center gap-1">
            <Cpu className="w-4 h-4" />
            VPS Hosting
          </Link>
          <Link href="/plans/minecraft" className="hover:text-primary transition-colors flex items-center gap-1">
            <Server className="w-4 h-4" />
            Minecraft Servers
          </Link>
          <Link href="/support" className="hover:text-primary transition-colors flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            Support
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 font-bold">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:flex gap-2 text-destructive hover:text-destructive font-bold">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 font-bold">
                  <LogIn className="w-4 h-4" />
                  Log In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 font-bold">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
