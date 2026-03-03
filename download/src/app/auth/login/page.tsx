"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const firebase = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const logo = PlaceHolderImages.find(img => img.id === "astracloud-logo")!;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !firebase?.auth) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(firebase.auth, email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to AstraCloud.",
      });
      router.push("/dashboard");
    } catch (err: any) {
      let message = "Invalid email or password.";
      if (err.code === 'auth/user-not-found') {
        message = "Account not found. Please register first.";
      } else if (err.code === 'auth/wrong-password') {
        message = "Incorrect password.";
      }
      setError(message);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: message,
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
            <div className="relative w-16 h-16 mx-auto overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-center">
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
              <CardTitle className="text-3xl font-black font-headline">Welcome Back</CardTitle>
              <CardDescription className="font-medium">Access your AstraCloud dashboard.</CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-bold">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    required
                    type="email"
                    placeholder="name@gmail.com" 
                    className="pl-10 h-12 font-medium" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 h-14 text-lg font-bold shadow-lg shadow-primary/20">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5 mr-2" />
                )}
                Log In
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col gap-4 justify-center border-t py-6 bg-secondary/5 rounded-b-lg">
            <p className="text-sm text-muted-foreground font-medium text-center">
              New to AstraCloud? <Link href="/auth/register" className="text-primary font-bold hover:underline">Register Now</Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
