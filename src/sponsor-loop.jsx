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
      speed={62}
      direction="left"
      width="100%"
      logoHeight={54}
      gap={34}
      pauseOnHover={false}
      fadeOut={false}
      scaleOnHover
      ariaLabel="HELI venues and partners"
    />
  );

  return () => root.unmount();
}
