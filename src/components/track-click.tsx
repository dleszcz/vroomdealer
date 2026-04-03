"use client";

import React from "react";

interface TrackClickProps {
  eventName: string;
  eventParams?: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
}

export function TrackClick({ eventName, eventParams, children, className }: TrackClickProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", eventName, eventParams);
      console.log(`➡️ Meta Pixel: Custom Event tracked: ${eventName}`, eventParams);
    }
  };

  return (
    <div onClick={handleClick} className={className} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
