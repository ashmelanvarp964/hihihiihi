import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { HostingBackground } from "@/components/hosting-background";
import { FirebaseClientProvider } from "@/firebase";

export const metadata: Metadata = {
  title: 'AstraCloud Hosting | Premium VPS & Minecraft Hosting',
  description: 'Reliable, high-performance VPS and Minecraft server hosting for developers and gamers with 99.9% uptime.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen relative">
        <FirebaseClientProvider>
          <HostingBackground />
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
