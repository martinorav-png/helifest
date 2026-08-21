import React from 'react';
import { createRoot } from 'react-dom/client';
import LogoLoop from './components/LogoLoop.jsx';
import { sponsorLogos } from './sponsors.js';

export function mountSponsorLoop(element) {
  if (!element) return () => {};

  const root = createRoot(element);
  root.render(
    <LogoLoop
      logos={sponsorLogos}
      speed={32}
      direction="left"
      width="100%"
      logoHeight={48}
      gap={48}
      pauseOnHover
      fadeOut={false}
      scaleOnHover
      ariaLabel="HELI venues and partners"
    />
  );

  return () => root.unmount();
}
