"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Lock, User, UserCheck, Loader2, AlertCircle } from "lucide-react";
import { useFirebase, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const firebase = useFirebase();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const logo = PlaceHolderImages.find(img => img.id === "astracloud-logo")!;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) => {
    const lowerEmail = email.toLowerCase();
    if (lowerEmail === "admin@astracloud.xyz") return true;
    return lowerEmail.endsWith("@gmail.com");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isLoading || !firebase?.auth || !db) return;

    const lowerEmail = formData.email.toLowerCase();
    const lowerName = formData.displayName.toLowerCase();

    // Domain Validation
    if (!validateEmail(formData.email)) {
      setError("Registration is restricted to @gmail.com addresses only.");
      return;
    }

    // Admin Account Enforcement
    if (lowerEmail === "admin@astracloud.xyz" && lowerName !== "iconic") {
      setError("The admin account must use the username 'iconic'.");
      return;
    }

    // Regular User blocking 'iconic'
    if (lowerEmail !== "admin@astracloud.xyz" && lowerName === "iconic") {
      setError("The username 'iconic' is reserved for administrators.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check if username is taken
      const usernameDocRef = doc(db, "usernames", lowerName);
      const usernameSnap = await getDoc(usernameDocRef);

      if (usernameSnap.exists()) {
        setError("This display name is already in use. Please choose another.");
        setIsLoading(false);
        return;
      }

      // 2. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(firebase.auth, formData.email, formData.password);
      const user = userCredential.user;

      // 3. Update Auth Profile
      await updateProfile(user, { displayName: formData.displayName });

      // 4. Reserve Username in Firestore
      await setDoc(usernameDocRef, {
        id: user.uid,
        displayName: formData.displayName,
        createdAt: serverTimestamp(),
      });

      // 5. Create User Profile
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        externalAuthId: user.uid,
        email: formData.email,
        displayName: formData.displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // 6. Admin Role Assignment
      if (lowerEmail === "admin@astracloud.xyz") {
        await setDoc(doc(db, "roles_admin", user.uid), {
          email: formData.email,
          grantedAt: serverTimestamp()
        });
      }

      toast({
        title: "Account created!",
        description: `Welcome to AstraCloud, ${formData.displayName}!`,
      });

      router.push("/dashboard");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-none bg-card/60 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto overflow-hidden rounded-2xl border border-primary/20 bg-white flex items-center justify-center shadow-lg shadow-white/10">
              <Image 
                src={logo.imageUrl} 
                alt="AstraCloud" 
                width={64} 
                height={64} 
                className="object-contain"
                data-ai-hint={logo.imageHint}
              />
            </div>
            <div>
              <CardTitle className="text-3xl font-black font-headline">Join AstraCloud</CardTitle>
              <CardDescription className="font-medium">Deploy high-performance servers today.</CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-bold">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    required
                    placeholder="VortexMaster" 
                    className="pl-10 h-12 font-medium" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    required
                    type="email"
                    placeholder="name@gmail.com" 
                    className="pl-10 h-12 font-medium" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Only @gmail.com is supported</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    required
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12 font-medium" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 h-14 text-lg font-bold shadow-lg shadow-primary/20">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <UserCheck className="w-5 h-5 mr-2" />
                )}
                Create Account
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex justify-center border-t py-6 bg-secondary/5 rounded-b-lg">
            <p className="text-sm text-muted-foreground font-medium">
              Already have an account? <Link href="/auth/login" className="text-primary font-bold hover:underline">Log In</Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
