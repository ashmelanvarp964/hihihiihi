"use client";

import React from "react";

export function HostingBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Base background color */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 bg-mesh opacity-50" />
      
      {/* Moving Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" 
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      >
        <div className="absolute inset-0 animate-grid" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Floating Blobs for "Cloud" feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Subtle Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.01),rgba(0,0,255,0.01))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
    </div>
  );
}
