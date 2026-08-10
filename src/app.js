import { renderPaperHomepage } from './home.js';
import { bindPaperVenueMap } from './home-venue-interactions.js';
import { mountSponsorLoop } from './sponsor-loop.jsx';

const main = document.querySelector('#main-content');
let cleanupPaperVenueMap = () => {};
let cleanupSponsorLoop = () => {};

function render() {
  document.body.classList.add('paper-home-active');
  cleanupPaperVenueMap();
  cleanupSponsorLoop();
  main.innerHTML = renderPaperHomepage({
    marquee: 'GET YOUR TICKET NOW',
    marqueeLabel: 'Festival tickets',
    sponsorsLabel: 'HELI venues and partners',
  });
  cleanupPaperVenueMap = bindPaperVenueMap(main);
  cleanupSponsorLoop = mountSponsorLoop(main.querySelector('[data-sponsor-loop-root]'));
}

render();
