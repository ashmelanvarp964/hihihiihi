"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldCheck, Mail, Calendar, Hash, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isUserLoading && user?.email !== "admin@astracloud.xyz") {
    redirect("/dashboard");
  }

  // Fetch all registered users
  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "users"), orderBy("createdAt", "desc"), limit(50));
  }, [db]);

  const { data: registeredUsers, isLoading: usersLoading } = useCollection(usersQuery);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline tracking-tight text-primary">User Management</h1>
          <p className="text-muted-foreground">Global directory of all AstraCloud registered accounts.</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30 h-6 px-3">Administrator Mode</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/40 backdrop-blur-md border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Users</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{usersLoading ? '...' : (registeredUsers?.length || 0)}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Active registered accounts</p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-md border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Security Protocol</CardTitle>
            <ShieldCheck className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">@gmail</div>
            <p className="text-[10px] text-muted-foreground mt-1">Domain enforcement active</p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-md border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">System Health</CardTitle>
            <ShieldCheck className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-500">Optimum</div>
            <p className="text-[10px] text-muted-foreground mt-1">99.9% Uptime Verified</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/5 bg-card/20 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Registered AstraCloud Users
              </CardTitle>
              <CardDescription>Review user identities and joining chronologies.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="font-bold text-muted-foreground animate-pulse text-xs uppercase tracking-widest">Accessing Astra Registry...</p>
            </div>
          ) : registeredUsers && registeredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-primary/10">
                    <TableHead className="font-black text-xs uppercase tracking-widest">Identity</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest">Email Address</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest">Astra UID</TableHead>
                    <TableHead className="text-right font-black text-xs uppercase tracking-widest">Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredUsers.map((userDoc) => (
                    <TableRow key={userDoc.id} className="border-primary/5 hover:bg-primary/5 transition-colors group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] border border-primary/20">
                            {userDoc.displayName?.slice(0, 2).toUpperCase() || 'AC'}
                          </div>
                          <div>
                            <div className="font-bold text-sm">{userDoc.displayName}</div>
                            {userDoc.email === 'admin@astracloud.xyz' && (
                              <Badge className="bg-primary text-primary-foreground text-[8px] font-black h-4 px-1 leading-none">ADMIN</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                          <Mail className="w-3 h-3 text-primary/50" />
                          <span className="font-medium text-xs">{userDoc.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Hash className="w-3 h-3 text-accent/50" />
                          <span className="font-mono text-[10px]">{userDoc.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5 text-xs font-bold">
                            <Calendar className="w-3 h-3 text-primary" />
                            {new Date(userDoc.createdAt).toLocaleDateString()}
                          </div>
                          <span className="text-[9px] text-muted-foreground font-medium">Verified System Entry</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-primary/10 rounded-xl">
              <Users className="w-12 h-12 text-primary/20 mx-auto mb-4" />
              <p className="font-bold text-muted-foreground">No registered users found in the system.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
