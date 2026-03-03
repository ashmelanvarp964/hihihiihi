"use client";

import Image from "next/image";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Server, CreditCard, HelpCircle, LogOut, Settings, ExternalLink, ShieldAlert, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useUser, useFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const logo = PlaceHolderImages.find(img => img.id === "astracloud-logo")!;
  const { user } = useUser();
  const { auth } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/");
  };

  const isAdmin = user?.email === "admin@astracloud.xyz";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-secondary/30">
        <Sidebar className="border-r shadow-sm">
          <SidebarHeader className="p-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8 overflow-hidden rounded bg-white flex items-center justify-center border border-primary/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                <Image 
                  src={logo.imageUrl} 
                  alt="AstraCloud" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                  data-ai-hint={logo.imageHint}
                />
              </div>
              <span className="text-xl font-black font-headline text-primary">AstraCloud</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === "/dashboard"} className="font-bold">
                  <Link href="/dashboard" className="flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Services" isActive={pathname === "/dashboard/services"} className="font-bold">
                  <Link href="/dashboard/services" className="flex items-center gap-3">
                    <Server className="w-5 h-5" />
                    <span>Active Services</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === "/dashboard/settings"} className="font-bold">
                  <Link href="/dashboard/settings" className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {isAdmin && (
              <div className="mt-8 space-y-2">
                <h4 className="text-[10px] font-black text-primary uppercase px-2 tracking-widest flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3" /> Admin Control
                </h4>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/dashboard/admin"} className="font-bold text-primary">
                      <Link href="/dashboard/admin" className="flex items-center gap-3">
                        <Users className="w-5 h-5" />
                        <span>User Management</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/dashboard/admin/tickets"} className="font-bold text-primary">
                      <Link href="/dashboard/admin/tickets" className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5" />
                        <span>Support Tickets</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase px-2 tracking-widest">Control Panels</h4>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="text-accent hover:text-accent font-bold">
                    <a href="https://cp.astracloud.xyz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5" />
                      <span>Minecraft Panel</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="text-accent hover:text-accent font-bold">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5" />
                      <span>VPS Manager</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Help" className="font-bold">
                  <Link href="/support" className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5" />
                    <span>Support Portal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} className="text-destructive hover:text-destructive font-bold">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="h-16 border-b bg-background/50 backdrop-blur-md flex items-center px-6 justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h2 className="font-bold text-lg hidden sm:block">Welcome, {user?.displayName || 'User'}</h2>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && <Badge className="bg-primary text-primary-foreground font-black">ADMIN MODE</Badge>}
              <Badge variant="outline" className="text-green-600 bg-green-50/5 border-green-200/20 font-bold">Online</Badge>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] border border-primary/20">
                {user?.displayName?.slice(0, 2).toUpperCase() || 'AC'}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
