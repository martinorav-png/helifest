import { faqItems, ticketFacts } from '../content.js';

export function renderTicketsView() {
  return `<section class="tickets-view utility-page utility-page--dark" data-view="tickets">
    <div class="ticket-stage">
      <article class="pass-ticket">
        <div class="pass-ticket__body">
          <p class="pass-ticket__brand"><img src="/assets/helihorizontal.svg" alt="HELI"></p>
          <h1 id="page-title">${ticketFacts.price}</h1>
          <p class="pass-ticket__when">16–17 oktoober 2026</p>
          <ul class="pass-ticket__facts">
            <li>${ticketFacts.nights} ööd</li>
            <li>8 paika</li>
            <li>${ticketFacts.transport}</li>
          </ul>
          <p class="pass-ticket__note">${ticketFacts.purchase}</p>
          <button class="pass-ticket__buy" type="button" disabled>Osta pilet</button>
        </div>
        <div class="pass-ticket__perforation" aria-hidden="true"></div>
        <aside class="pass-ticket__stub">
          <span>PILET</span>
          <div class="pass-ticket__barcode" aria-hidden="true"></div>
          <time datetime="2026-10-16">16 17 10 26</time>
        </aside>
      </article>
      <figure class="tickets-kaepael">
        <img src="/assets/KÄEPAEL.png" alt="" width="4000" height="304">
      </figure>
    </div>
    <section class="faq-section"><h2>Korduma kippuvad küsimused</h2>${faqItems.slice(0, 3).map((item) => `<details><summary>${item.question}<span aria-hidden="true">+</span></summary><p>${item.answer}</p></details>`).join('')}</section>
  </section>`;
}
