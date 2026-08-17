import { faqItems, siteCopy } from '../content.js';

export function renderAboutView() {
  return `<section class="about-view utility-page" data-view="about">
    <div class="about-layout">
      <section class="about-story"><h1 id="page-title">LOREM IPSUM,<br>DOLOR SIT AMET.</h1><p>${siteCopy.aboutBody}</p><p>${siteCopy.story}</p><img src="/assets/paavli-night.png" alt="Lorem ipsum dolor sit amet"></section>
      <section class="about-practical">
        <div class="info-row"><span>LOREM</span><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></div>
        <div class="info-row"><span>IPSUM</span><p>Lorem ipsum dolor sit amet.</p></div>
        <div class="info-row"><span>DOLOR</span><p>Consectetur adipiscing elit, sed do eiusmod tempor.</p></div>
        <div class="info-row" id="contact"><span>SIT</span><p>Lorem ipsum dolor sit amet.</p></div>
      </section>
    </div>
    <section class="faq-band" id="faq">
      <h2>Lorem ipsum dolor sit</h2>
      <div>${faqItems.map((item) => `<details><summary>${item.question}<span aria-hidden="true">+</span></summary><p>${item.answer}</p></details>`).join('')}</div>
    </section>
    <section class="about-sponsors" aria-label="Lorem ipsum dolor sit amet"><div data-sponsor-loop-root></div></section>
  </section>`;
}
