"use client";

import React, { useEffect } from 'react';

// Declare standard AdSense array on window
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdUnitProps {
  adSlot: string;
  adClient?: string;
  className?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
}

export function AdUnit({ 
  adSlot, 
  adClient = "ca-pub-0000000000000000", 
  className,
  format = "auto",
  responsive = true
}: AdUnitProps) {
  useEffect(() => {
    try {
      // Avoid pushing multiple times in React Strict Mode or on route changes 
      // where the DOM might still hold an initialized ad slot
      const insElements = document.querySelectorAll(`ins.adsbygoogle[data-ad-slot="${adSlot}"]`);
      const isAlreadyFilled = Array.from(insElements).some(el => el.getAttribute('data-adsbygoogle-status') === 'done');

      if (!isAlreadyFilled) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense push error:', err);
    }
  }, [adSlot, adClient]);

  return (
    <div className={`mt-2 mb-4 flex justify-center w-full overflow-hidden ${className || ''}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', minWidth: '300px', width: '100%', textAlign: 'center' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
