
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { User, Mail, Shield, Calendar, Key, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  const { user } = useUser();
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile } = useDoc(userDocRef);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black font-headline text-primary tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your AstraCloud profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 border-primary/5 bg-card/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Your registered identity on AstraCloud Hosting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-primary" />
                  <Input disabled value={user?.displayName || 'N/A'} className="pl-10 h-12 font-bold bg-secondary/20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-primary" />
                  <Input disabled value={user?.email || 'N/A'} className="pl-10 h-12 font-bold bg-secondary/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Joined On</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-primary" />
                    <Input disabled value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Loading...'} className="pl-10 h-12 font-bold bg-secondary/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">User ID</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 w-4 h-4 text-primary" />
                    <Input disabled value={user?.uid ? user.uid.slice(0, 12) + '...' : '...'} className="pl-10 h-12 font-bold bg-secondary/20" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-primary/5 py-6">
            <p className="text-xs text-muted-foreground font-bold italic">Registration restricted to @gmail.com (AstraCloud Security Policy v1.2)</p>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="border-primary/5 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
                <Key className="w-4 h-4" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500">
                <div className="text-xs font-black uppercase tracking-widest mb-1">Status</div>
                <div className="font-bold">Account Secured</div>
              </div>
              <Button variant="outline" className="w-full font-bold h-10 border-primary/20">Change Password</Button>
              <Button variant="destructive" className="w-full font-bold h-10">Delete Account</Button>
            </CardContent>
          </Card>

          <Alert className="bg-accent/10 border-accent/20">
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertTitle className="text-xs font-black uppercase tracking-tight">System Notice</AlertTitle>
            <AlertDescription className="text-[10px] font-medium leading-tight mt-1">
              For security reasons, changing your primary email address requires a manual support ticket via Discord.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
