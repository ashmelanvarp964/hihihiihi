"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, User, Bot, Loader2, LifeBuoy, Hash } from "lucide-react";
import { supportChatbot } from "@/ai/flows/support-chatbot";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1478352738357215355/LhZkRtbNCOsTj1WEz7vDigfC9EzwXMhPnQPKtl9peC31UllAKGeCn5clrD1cjNJJ84Ns";

export default function SupportPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm the AstraCloud support assistant. How can I help you today with our VPS or Minecraft hosting services?" }
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);

  // Ticket Form State
  const [ticketData, setTicketData] = useState({
    discordUsername: "",
    subject: "",
    service: "",
    message: ""
  });

  async function handleSendMessage() {
    if (!input.trim() || chatLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const { answer } = await supportChatbot({ question: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later or contact our team on Discord." }]);
    } finally {
      setChatLoading(false);
    }
  }

  async function handleSubmitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (ticketLoading || !db) return;

    setTicketLoading(true);

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, "contactMessages"), {
        ...ticketData,
        userId: user?.uid || "anonymous",
        userEmail: user?.email || "anonymous",
        status: "New",
        submittedAt: new Date().toISOString()
      });

      // 2. Send to Discord Webhook
      const discordEmbed = {
        username: "AstraCloud Support",
        embeds: [{
          title: `New Support Ticket: ${ticketData.subject}`,
          color: 0x2b6cb0,
          fields: [
            { name: "Discord Username", value: ticketData.discordUsername || "Not provided", inline: true },
            { name: "Service", value: ticketData.service || "General", inline: true },
            { name: "User Email", value: user?.email || "Anonymous", inline: false },
            { name: "Message", value: ticketData.message }
          ],
          footer: { text: "AstraCloud Hosting • Support" },
          timestamp: new Date().toISOString()
        }]
      };

      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordEmbed)
      });

      toast({
        title: "Ticket Submitted!",
        description: "Your message has been sent to our team. We'll get back to you shortly.",
      });

      setTicketData({ discordUsername: "", subject: "", service: "", message: "" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit ticket. Please join our Discord for immediate help.",
      });
    } finally {
      setTicketLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-4">
          <LifeBuoy className="w-12 h-12 mx-auto text-accent" />
          <h1 className="text-4xl font-bold font-headline">AstraCloud Support</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Get instant answers from our technical assistant or open a support ticket.
          </p>
        </div>
      </section>

      <section className="py-12 -mt-12">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-none bg-card/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Open a Ticket</CardTitle>
                <CardDescription>Expect a response within 2-4 hours.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmitTicket}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discord Username</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input 
                        required
                        placeholder="user#0000" 
                        className="pl-10"
                        value={ticketData.discordUsername}
                        onChange={(e) => setTicketData({...ticketData, discordUsername: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input 
                      required
                      placeholder="Issue with my server..." 
                      value={ticketData.subject}
                      onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service</label>
                    <Input 
                      placeholder="e.g. Diamond MC, AMD EPYC VPS" 
                      value={ticketData.service}
                      onChange={(e) => setTicketData({...ticketData, service: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea 
                      required
                      placeholder="Describe your request in detail..." 
                      className="min-h-[150px]" 
                      value={ticketData.message}
                      onChange={(e) => setTicketData({...ticketData, message: e.target.value})}
                    />
                  </div>
                  <Button type="submit" disabled={ticketLoading} className="w-full bg-primary hover:bg-primary/90 font-bold">
                    {ticketLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Submit Ticket
                  </Button>
                </CardContent>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg border-none bg-card/80 backdrop-blur-xl flex flex-col h-[650px]">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Astra Support</CardTitle>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-muted-foreground">Always Online</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden relative">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-6">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                          {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'assistant' ? 'bg-muted rounded-tl-none' : 'bg-primary text-primary-foreground rounded-tr-none'}`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-muted p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-sm text-muted-foreground italic">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          Typing...
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <div className="p-4 border-t bg-card/50">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Ask about our services..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={chatLoading} className="bg-primary hover:bg-primary/90">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
