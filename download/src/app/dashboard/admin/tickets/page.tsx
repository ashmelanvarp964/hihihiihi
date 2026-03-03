
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Trash2, CheckCircle2, Clock, Filter, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AdminTicketsPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  if (!isUserLoading && user?.email !== "admin@astracloud.xyz") {
    redirect("/dashboard");
  }

  const ticketsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "contactMessages"), orderBy("submittedAt", "desc"));
  }, [db]);

  const { data: tickets, isLoading: ticketsLoading } = useCollection(ticketsQuery);

  const updateStatus = async (ticketId: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, "contactMessages", ticketId), {
        status: newStatus
      });
      toast({ title: "Status Updated", description: `Ticket marked as ${newStatus}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update ticket status." });
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!db || !confirm("Are you sure you want to delete this ticket record?")) return;
    try {
      await deleteDoc(doc(db, "contactMessages", ticketId));
      toast({ title: "Ticket Deleted", description: "Record removed from AstraCloud database." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete ticket." });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-headline tracking-tight text-primary">Support Management</h1>
          <p className="text-muted-foreground">Review and respond to AstraCloud user inquiries.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="font-bold border-primary/10">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <Card className="border-primary/5 bg-card/20 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="w-5 h-5 text-primary" />
            Global Ticket Queue
          </CardTitle>
          <CardDescription>Direct bridge from AstraCloud Support Portal & Discord.</CardDescription>
        </CardHeader>
        <CardContent>
          {ticketsLoading ? (
            <div className="py-20 text-center animate-pulse">Loading tickets...</div>
          ) : tickets && tickets.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-primary/10">
                    <TableHead className="font-black text-xs uppercase tracking-widest">Status</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest">User Info</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest">Service & Subject</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-widest">Message</TableHead>
                    <TableHead className="text-right font-black text-xs uppercase tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="border-primary/5 hover:bg-primary/5 transition-colors group">
                      <TableCell>
                        <Badge className={`
                          text-[10px] font-black uppercase border-none px-2
                          ${ticket.status === 'Resolved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}
                        `}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <User className="w-3 h-3 text-primary" /> {ticket.userEmail}
                        </div>
                        <div className="text-[10px] font-bold text-accent">@{ticket.discordUsername}</div>
                      </TableCell>
                      <TableCell className="space-y-1">
                        <div className="text-xs font-black text-primary uppercase tracking-tight">{ticket.service || "General"}</div>
                        <div className="font-bold text-sm">{ticket.subject}</div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground line-clamp-2 max-w-[250px] italic">
                          "{ticket.message}"
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {ticket.status !== 'Resolved' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-green-500 hover:bg-green-500/10"
                              onClick={() => updateStatus(ticket.id, 'Resolved')}
                              title="Mark as Resolved"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => deleteTicket(ticket.id)}
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-primary/10 rounded-xl">
              <MessageSquare className="w-12 h-12 text-primary/20 mx-auto mb-4" />
              <p className="font-bold text-muted-foreground">No active support tickets found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
