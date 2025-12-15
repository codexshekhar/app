import React from 'react';

export const EcoFlowLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Defs for gradients */}
    <defs>
      <linearGradient id="leafGradient" x1="0" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4ade80" />
        <stop offset="1" stopColor="#16a34a" />
      </linearGradient>
      <linearGradient id="waterGradient" x1="50" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
    </defs>

    {/* Left Side: Leaf (Nature) */}
    <path 
      d="M50 10 C 20 10, 5 45, 5 65 A 45 45 0 0 0 50 95" 
      fill="url(#leafGradient)" 
    />
    
    {/* Right Side: Water Drop (Hydration) */}
    <path 
      d="M50 10 C 80 10, 95 45, 95 65 A 45 45 0 0 1 50 95" 
      fill="url(#waterGradient)" 
    />

    {/* Center Divider */}
    <path d="M50 10 L 50 95" stroke="white" strokeWidth="3" strokeLinecap="round" />

    {/* Left Details: Leaf Veins */}
    <path d="M50 40 L 25 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
    <path d="M50 60 L 20 50" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
    <path d="M50 80 L 30 75" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>

    {/* Right Details: Circuit/Tech Nodes */}
    <circle cx="75" cy="40" r="3.5" fill="white" opacity="0.9" />
    <circle cx="85" cy="60" r="3.5" fill="white" opacity="0.9" />
    <circle cx="70" cy="75" r="3.5" fill="white" opacity="0.9" />
    
    {/* Circuit Lines connecting dots */}
    <path d="M75 40 L 85 60 L 70 75" stroke="white" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" />
    <path d="M50 40 L 75 40" stroke="white" strokeWidth="1.5" opacity="0.4" />
  </svg>
);