import { faqItems, siteCopy } from '../content.js';

export function renderAboutView() {
  return `<section class="about-view utility-page" data-view="about">
    <div class="about-layout">
      <section class="about-story"><h1 id="page-title">Üks linn.<br>Ühes rütmis.</h1><p>${siteCopy.aboutBody}</p><p>${siteCopy.story}</p><img src="/assets/paavli-night.png" alt="Inimesed Paavli Kultuurivabriku terrassil"></section>
      <section class="about-practical">
        <div class="info-row"><span>MIS ON HELI</span><p>${siteCopy.aboutLead}</p></div>
        <div class="info-row"><span>TURVALISUS</span><p>Iga koha reeglid avaldatakse koos täisprogrammiga.</p></div>
        <div class="info-row"><span>LIGIPÄÄS</span><p>Ligipääsetavuse info ilmub iga koha lehel.</p></div>
        <div class="info-row" id="contact"><span>KONTAKT</span><p>Korraldaja lisab siia kontakt- ja partnerinfo.</p></div>
      </section>
    </div>
    <section class="faq-band" id="faq">
      <h2>Korduma kippuvad küsimused</h2>
      <div>${faqItems.map((item) => `<details><summary>${item.question}<span aria-hidden="true">+</span></summary><p>${item.answer}</p></details>`).join('')}</div>
    </section>
    <section class="about-sponsors" aria-label="Paigad ja partnerid"><div data-sponsor-loop-root></div></section>
  </section>`;
}
