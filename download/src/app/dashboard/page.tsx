
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Server, Activity, ChevronRight, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverview() {
  const { user } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user's services
  const servicesQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, "users", user.uid, "serviceInstances"));
  }, [db, user?.uid]);

  const { data: services, isLoading } = useCollection(servicesQuery);

  const activeCount = services?.filter(s => s.status === 'Running' || s.status === 'Online').length || 0;

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-headline tracking-tight">System Overview</h1>
          <p className="text-muted-foreground">Manage your AstraCloud infrastructure and account details.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 font-bold" asChild>
          <Link href="/dashboard/services">Deploy New Instance</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/40 backdrop-blur-md border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Nodes</CardTitle>
            <Server className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{isLoading ? '...' : activeCount}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Across all regions</p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-md border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Network Load</CardTitle>
            <Activity className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">12%</div>
            <Progress value={12} className="h-1.5 mt-2 bg-accent/10" />
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-md border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Status</CardTitle>
            <ShieldCheck className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-500">Verified</div>
            <p className="text-[10px] text-muted-foreground mt-1">Secured Account</p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-md border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Services</CardTitle>
            <Badge variant="outline" className="text-[10px] font-bold border-primary/20">AstraCloud</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{services?.length || 0}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Registered resources</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Details Card */}
        <Card className="lg:col-span-1 border-none shadow-2xl bg-primary/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Registered Details
            </CardTitle>
            <CardDescription>Your AstraCloud profile identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Username</span>
              <span className="font-bold text-lg text-primary">{user?.displayName || 'N/A'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</span>
              <span className="font-medium text-sm truncate">{user?.email}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Astra UID</span>
              <span className="font-mono text-[10px] text-muted-foreground break-all">{user?.uid}</span>
            </div>
            <div className="pt-4 border-t border-primary/10">
              <Button variant="outline" size="sm" className="w-full font-bold" asChild>
                <Link href="/dashboard/settings">Edit Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services List Card */}
        <Card className="lg:col-span-2 shadow-sm border-primary/5 bg-card/20 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Instances</CardTitle>
              <CardDescription>Recently managed servers.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="font-bold" asChild>
              <Link href="/dashboard/services">View All <ChevronRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {services && services.length > 0 ? (
              services.slice(0, 3).map((service, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card/40 hover:border-primary transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${service.status === 'Running' || service.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-yellow-500 animate-pulse'}`} />
                    <div>
                      <div className="font-bold group-hover:text-primary transition-colors">{service.name}</div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{service.planName} • {service.ipAddress || 'Allocating...'}</div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="font-bold h-8" asChild>
                    <Link href="/dashboard/services">Manage</Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-muted/20 rounded-xl">
                <Server className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No active services found.</p>
                <Button variant="link" className="text-primary font-bold mt-2" asChild>
                  <Link href="/dashboard/services">Deploy your first server</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
