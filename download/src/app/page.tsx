import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Zap, Globe, Cpu, Server, HardDrive, IndianRupee } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

const DISCORD_LINK = "https://discord.gg/ACpEqf3Qtn";

const mcPlansHero = [
  { name: "Emerald", ram: "8GB", price: "₹200", players: "10–25 Players", popular: true },
  { name: "Obsidian", ram: "16GB", price: "₹350", players: "25–50 Players" },
  { name: "Bedrock", ram: "32GB", price: "₹650", players: "50+ Players" },
];

const vpsPlansHero = [
  { name: "AMD EPYC Pro", ram: "16GB", cpu: "6 vCore", disk: "150GB NVMe", price: "₹700" },
  { name: "Intel Platinum Pro", ram: "16GB", cpu: "6 vCore", disk: "150GB NVMe", price: "₹750", popular: true },
];

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg")!;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-primary/10 border-b">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image 
            src={heroImg.imageUrl} 
            alt={heroImg.description} 
            fill 
            className="object-cover"
            data-ai-hint={heroImg.imageHint}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <Badge className="bg-accent text-accent-foreground border-none px-4 py-1 animate-pulse font-bold tracking-wider">
            INTEL PLATINUM & AMD EPYC NOW LIVE
          </Badge>
          <h1 className="text-4xl md:text-7xl font-black font-headline max-w-5xl mx-auto leading-tight drop-shadow-sm">
            Elevate Your Experience with <span className="text-primary">AstraCloud</span> Hosting
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Premium VPS and Minecraft servers in India. Experience 99.9% uptime on enterprise hardware with NVMe storage.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 shadow-xl shadow-primary/30 h-14" asChild>
              <Link href="/plans/vps">Browse Plans</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 font-bold text-lg px-8 h-14" asChild>
              <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer">Join Discord</a>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-10 pt-8 opacity-70">
            <div className="flex items-center gap-2 text-sm font-semibold"><Globe className="w-5 h-5 text-primary" /> <span>99.9% Uptime</span></div>
            <div className="flex items-center gap-2 text-sm font-semibold"><Shield className="w-5 h-5 text-primary" /> <span>DDoS Mitigation</span></div>
            <div className="flex items-center gap-2 text-sm font-semibold"><Zap className="w-5 h-5 text-primary" /> <span>Instant Setup</span></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black font-headline">The AstraCloud Difference</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">We deliver raw performance with premium hardware and enterprise-grade security for your digital world.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: "High-Core Performance", desc: "Our servers run on Intel Platinum and AMD EPYC processors for elite computational power." },
              { icon: Shield, title: "DDoS Mitigation", desc: "Built-in enterprise DDoS protection ensures your services stay online even under heavy attacks." },
              { icon: HardDrive, title: "Pure NVMe SSD", desc: "Experience incredible read/write speeds with pure NVMe storage across all server nodes." }
            ].map((f, i) => (
              <Card key={i} className="border-none shadow-2xl bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all hover:-translate-y-2 py-4">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <f.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VPS Selection */}
      <section className="py-24 bg-secondary/5 backdrop-blur-sm border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <Badge variant="outline" className="text-primary border-primary font-bold">ENTERPRISE CLOUD</Badge>
              <h2 className="text-5xl font-black font-headline leading-tight">Elite <span className="text-primary">Cloud VPS</span> <br/>Infrastructure</h2>
              <p className="text-muted-foreground text-xl">
                Deploy scalable, high-performance virtual private servers with full root access. Choose between Intel Platinum and AMD EPYC for peak efficiency.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Full Root Access", "Dedicated IPv4", "Instant Deployment", "24/7 Tech Support", "99.9% Uptime", "NVMe Storage"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm font-bold">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center"><Check className="text-accent w-4 h-4" /></div> {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-primary hover:bg-primary/90 h-14 px-10 text-lg shadow-lg shadow-primary/20" asChild>
                <Link href="/plans/vps">Browse All VPS Plans</Link>
              </Button>
            </div>
            <div className="flex-1 w-full max-w-2xl">
              <div className="grid grid-cols-1 gap-6">
                {vpsPlansHero.map((p, i) => (
                  <Card key={i} className={`relative overflow-hidden transition-all bg-card/80 backdrop-blur-md hover:border-primary border border-white/10 ${p.popular ? 'border-primary border-2 shadow-2xl shadow-primary/10' : ''}`}>
                    {p.popular && <Badge className="absolute top-4 right-4 bg-primary px-3 py-1 font-bold">BEST PERFORMANCE</Badge>}
                    <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div>
                        <h4 className="font-black text-2xl mb-1">{p.name}</h4>
                        <p className="text-sm font-medium text-muted-foreground">{p.ram} RAM • {p.cpu} • {p.disk}</p>
                      </div>
                      <div className="text-center sm:text-right">
                        <div className="text-3xl font-black text-primary flex items-center justify-center sm:justify-end gap-1"><IndianRupee className="w-6 h-6" />{p.price.replace('₹', '')}</div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Per Month</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minecraft Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
            <div className="flex-1 space-y-8">
              <Badge variant="outline" className="text-accent border-accent font-bold">GAME SERVERS</Badge>
              <h2 className="text-5xl font-black font-headline leading-tight">High-Performance <br/><span className="text-primary">Minecraft</span> Hosting</h2>
              <p className="text-muted-foreground text-xl">
                Experience lag-free gaming with AstraCloud. From survival SMPs to massive networks, our hardware handles it all with ease.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Pure NVMe SSD", desc: "Lightning fast world loading and plugin execution." },
                  { title: "DDoS Shield", desc: "Stay online 24/7 with enterprise-grade protection." },
                  { title: "Instant Setup", desc: "Your server is ready to play within 60 seconds." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0"><Zap className="text-accent w-5 h-5" /></div>
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90 h-14 px-10 text-lg" asChild>
                <Link href="/plans/minecraft">View All Game Plans</Link>
              </Button>
            </div>
            <div className="flex-1 w-full relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {mcPlansHero.map((p, i) => (
                  <Card key={i} className={`text-center transition-all bg-card/60 backdrop-blur-md border border-white/5 ${p.popular ? 'border-primary border-2 scale-105 shadow-2xl z-10' : 'hover:scale-105'}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-black">{p.name}</CardTitle>
                      <CardDescription className="font-bold">{p.ram} RAM • {p.players}</CardDescription>
                    </CardHeader>
                    <CardContent className="py-6">
                      <div className="text-4xl font-black text-primary mb-2 flex items-center justify-center gap-1">
                        <IndianRupee className="w-8 h-8" />
                        {p.price.replace('₹', '')}
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Monthly Billing</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant={p.popular ? "default" : "outline"} className="w-full h-12 font-bold" asChild>
                        <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer">Order Plan</a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-primary/10 -z-10" />
        <div className="container mx-auto px-4 space-y-10 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black font-headline">Ready to Launch <br/>with <span className="text-primary">AstraCloud</span>?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xl font-medium">Join our community of developers and gamers. Experience the raw power of Intel Platinum and AMD EPYC today.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 h-16 text-xl font-bold shadow-2xl shadow-primary/40" asChild>
              <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer">Get Started Now</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 h-16 px-12 text-xl font-bold" asChild>
              <Link href="/support">Talk to Support</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
