"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Server, Plus, Loader2, HardDrive, Cpu, Zap, Globe, Trash2, Power, Gamepad2, LayoutGrid } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, deleteDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VPS_PLANS = [
  { id: "vps-amd-starter", name: "AMD EPYC Starter", price: "₹500", specs: "8GB RAM / 4 vCore / 100GB NVMe" },
  { id: "vps-amd-pro", name: "AMD EPYC Pro", price: "₹700", specs: "16GB RAM / 6 vCore / 150GB NVMe" },
  { id: "vps-intel-starter", name: "Intel Platinum Starter", price: "₹550", specs: "8GB RAM / 4 vCore / 100GB NVMe" },
  { id: "vps-intel-pro", name: "Intel Platinum Pro", price: "₹750", specs: "16GB RAM / 6 vCore / 150GB NVMe" },
];

const MC_PLANS = [
  { id: "mc-diamond", name: "Diamond Plan", price: "₹110", specs: "4GB RAM / 1 vCPU / 15GB NVMe" },
  { id: "mc-emerald", name: "Emerald Plan", price: "₹200", specs: "8GB RAM / 2 vCPU / 40GB NVMe" },
  { id: "mc-netherite", name: "Netherite Plan", price: "₹280", specs: "12GB RAM / 3 vCPU / 60GB NVMe" },
  { id: "mc-obsidian", name: "Obsidian Plan", price: "₹350", specs: "16GB RAM / 4 vCPU / 80GB NVMe" },
  { id: "mc-bedrock", name: "Bedrock Plan", price: "₹650", specs: "32GB RAM / 6 vCPU / 120GB NVMe" },
];

export default function ServicesPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);
  const [open, setOpen] = useState(false);
  const [deployType, setDeployType] = useState<"VPS" | "Minecraft">("VPS");

  const [formData, setFormData] = useState({
    name: "",
    planId: "",
  });

  const servicesQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, "users", user.uid, "serviceInstances"), orderBy("createdAt", "desc"));
  }, [db, user?.uid]);

  const { data: services, isLoading } = useCollection(servicesQuery);

  const handleDeploy = async () => {
    if (!formData.name || !formData.planId || !db || !user?.uid) return;

    setIsDeploying(true);
    const plans = deployType === "VPS" ? VPS_PLANS : MC_PLANS;
    const plan = plans.find(p => p.id === formData.planId);

    try {
      await addDoc(collection(db, "users", user.uid, "serviceInstances"), {
        name: formData.name,
        planId: formData.planId,
        planName: plan?.name,
        type: deployType,
        status: "Provisioning",
        ipAddress: deployType === "VPS" ? `103.45.12.${Math.floor(Math.random() * 254) + 1}` : `103.45.12.1:${Math.floor(Math.random() * 9000) + 20000}`,
        createdAt: serverTimestamp(),
        userId: user.uid
      });

      toast({
        title: "Deployment Initiated",
        description: `${formData.name} is now booting on our high-performance nodes.`,
      });
      setOpen(false);
      setFormData({ name: "", planId: "" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deployment Failed",
        description: "Communication error with AstraCloud Core. Please try again.",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const togglePower = async (serviceId: string, currentStatus: string) => {
    if (!db || !user?.uid) return;
    const newStatus = currentStatus === "Running" || currentStatus === "Online" ? "Stopped" : "Running";
    
    try {
      await updateDoc(doc(db, "users", user.uid, "serviceInstances", serviceId), {
        status: newStatus
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Could not toggle power state." });
    }
  };

  const terminateService = async (serviceId: string) => {
    if (!db || !user?.uid) return;
    if (!confirm("CRITICAL: Terminating this instance will permanently erase all data. Continue?")) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "serviceInstances", serviceId));
      toast({ title: "Instance Terminated", description: "Resource has been successfully decommissioned." });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Decommissioning failed." });
    }
  };

  const renderServiceCard = (service: any) => (
    <Card key={service.id} className="overflow-hidden border-primary/10 bg-card/40 backdrop-blur-md hover:border-primary/30 transition-all group">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className={`w-full md:w-1.5 ${service.status === 'Running' || service.status === 'Online' ? 'bg-green-500' : service.status === 'Provisioning' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
          
          <div className="flex-1 p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {service.type === 'VPS' ? <HardDrive className="w-6 h-6" /> : <Server className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight">{service.name}</h3>
                  <Badge variant={service.status === 'Running' || service.status === 'Online' ? 'default' : 'secondary'} className="text-[9px] h-4 uppercase font-black px-1.5">
                    {service.status}
                  </Badge>
                </div>
                <div className="text-[11px] font-bold text-muted-foreground mt-0.5 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-primary" /> {service.ipAddress}</span>
                  <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-primary" /> {service.planName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 rounded-lg hover:text-primary transition-colors border-primary/10"
                onClick={() => togglePower(service.id, service.status)}
                disabled={service.status === 'Provisioning'}
              >
                <Power className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" className="flex-1 md:flex-none font-bold h-9 bg-secondary/50 hover:bg-secondary" asChild>
                <a href="https://cp.astracloud.xyz" target="_blank" rel="noopener noreferrer">Console</a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-lg"
                onClick={() => terminateService(service.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black font-headline tracking-tight text-primary">Astra Panel</h1>
          <p className="text-sm font-medium text-muted-foreground">Professional management for high-performance cloud nodes.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90 font-black h-11 px-6 shadow-xl shadow-primary/20">
              <Plus className="w-5 h-5" />
              New Deployment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-2xl border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-headline">Deploy Node</DialogTitle>
              <DialogDescription className="font-medium">Select your infrastructure category and plan.</DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="VPS" onValueChange={(val) => {
              setDeployType(val as "VPS" | "Minecraft");
              setFormData({ ...formData, planId: "" });
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/30 h-12 mb-6">
                <TabsTrigger value="VPS" className="font-bold gap-2">
                  <HardDrive className="w-4 h-4" /> VPS
                </TabsTrigger>
                <TabsTrigger value="Minecraft" className="font-bold gap-2">
                  <Gamepad2 className="w-4 h-4" /> Minecraft
                </TabsTrigger>
              </TabsList>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Node Label</Label>
                  <Input 
                    placeholder={deployType === "VPS" ? "Production-Worker-01" : "Survival-SMP-Server"} 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-11 font-bold border-primary/10 focus:border-primary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Astra Plan</Label>
                  <Select onValueChange={(val) => setFormData({...formData, planId: val})} value={formData.planId}>
                    <SelectTrigger className="h-11 font-bold border-primary/10">
                      <SelectValue placeholder={`Select a ${deployType} Plan`} />
                    </SelectTrigger>
                    <SelectContent className="bg-card font-bold">
                      {(deployType === "VPS" ? VPS_PLANS : MC_PLANS).map(plan => (
                        <SelectItem key={plan.id} value={plan.id} className="focus:bg-primary/10">
                          <div className="flex flex-col">
                            <span>{plan.name} ({plan.price})</span>
                            <span className="text-[10px] text-muted-foreground">{plan.specs}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button 
                onClick={handleDeploy} 
                disabled={isDeploying || !formData.name || !formData.planId}
                className="w-full bg-primary font-black h-12 text-lg shadow-lg shadow-primary/20"
              >
                {isDeploying ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
                Confirm & Launch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-secondary/30 border-primary/5 p-1 mb-6">
          <TabsTrigger value="all" className="font-bold px-6 gap-2"><LayoutGrid className="w-4 h-4" /> All Nodes</TabsTrigger>
          <TabsTrigger value="vps" className="font-bold px-6 gap-2"><HardDrive className="w-4 h-4" /> Cloud VPS</TabsTrigger>
          <TabsTrigger value="minecraft" className="font-bold px-6 gap-2"><Gamepad2 className="w-4 h-4" /> Game Servers</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
          </div>
        ) : (
          <>
            <TabsContent value="all" className="space-y-4">
              {services && services.length > 0 ? (
                services.map(renderServiceCard)
              ) : (
                <EmptyState onOpen={() => setOpen(true)} />
              )}
            </TabsContent>
            <TabsContent value="vps" className="space-y-4">
              {services?.filter(s => s.type === "VPS").length ? (
                services.filter(s => s.type === "VPS").map(renderServiceCard)
              ) : (
                <EmptyState onOpen={() => { setDeployType("VPS"); setOpen(true); }} type="VPS" />
              )}
            </TabsContent>
            <TabsContent value="minecraft" className="space-y-4">
              {services?.filter(s => s.type === "Minecraft").length ? (
                services.filter(s => s.type === "Minecraft").map(renderServiceCard)
              ) : (
                <EmptyState onOpen={() => { setDeployType("Minecraft"); setOpen(true); }} type="Minecraft Server" />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

function EmptyState({ onOpen, type = "Service" }: { onOpen: () => void, type?: string }) {
  return (
    <div className="text-center py-24 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10">
      <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Zap className="w-8 h-8 text-primary/40" />
      </div>
      <h2 className="text-2xl font-black text-foreground mb-2">No Active {type}s</h2>
      <p className="text-muted-foreground max-w-xs mx-auto text-sm font-medium">
        Deploy elite hardware instances with Intel Platinum and AMD EPYC today.
      </p>
      <Button onClick={onOpen} className="mt-8 font-black bg-primary h-11 px-8 rounded-xl shadow-lg shadow-primary/10">
        Deploy First {type}
      </Button>
    </div>
  );
}
