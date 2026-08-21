import { festivalData } from '../data.js';
import { filterEvents } from '../programme.js';
import { renderProgrammeRow } from '../components/programme-row.js';
import { siteCopy } from '../content.js';

const dateLabels = { '2026-10-16': 'R 16.10', '2026-10-17': 'L 17.10' };
const dateTitles = { '2026-10-16': 'REDE, 16. OKTOOBER', '2026-10-17': 'LAUPÄEV, 17. OKTOOBER' };
const categoryLabels = { Live: 'Live', 'DJ set': 'DJ-set', Listening: 'Kuulamine' };

function check(value, active) {
  return value === active ? ' checked' : '';
}

export function renderProgrammeView(state = {}) {
  const filters = {
    date: state.date || '2026-10-16',
    venueId: state.venueId || 'All',
    category: state.category || 'All',
  };
  const entries = filterEvents(festivalData.events, filters);
  const dateTitle = dateTitles[filters.date] || dateTitles['2026-10-16'];
  const venues = festivalData.venues.map((venue) => `<label><input type="radio" name="venue" value="${venue.id}"${check(venue.id, filters.venueId)}> ${venue.name}</label>`).join('');
  const categories = Object.entries(categoryLabels).map(([category, label]) => `<label><input type="radio" name="category" value="${category}"${check(category, filters.category)}> ${label}</label>`).join('');

  return `<section class="programme-view utility-page" data-view="programme">
    <div class="utility-masthead utility-masthead--programme">
      <h1 id="page-title">AJAKAVA</h1>
      <p>${siteCopy.programmeIntro}</p>
      <div class="masthead-mark" aria-hidden="true">HE<br>LI</div>
    </div>
    <div class="programme-toolbar">
      <div class="date-switcher" role="group" aria-label="Vali festivali päev">${Object.entries(dateLabels).map(([date, label]) => `<button type="button" data-date="${date}" aria-pressed="${date === filters.date}">${label}</button>`).join('')}</div>
      <button class="filter-toggle" type="button" aria-expanded="false" aria-controls="programme-filters">Filtrid <span aria-hidden="true">+</span></button>
    </div>
    <div class="programme-layout">
      <aside id="programme-filters" class="programme-filters" data-filter-panel>
        <div class="filter-heading"><strong>Filtrid</strong><button type="button" data-filter-close aria-label="Sulge filtrid">×</button></div>
        <fieldset><legend>PAIK</legend><label><input type="radio" name="venue" value="All"${check('All', filters.venueId)}> Kõik</label>${venues}</fieldset>
        <fieldset><legend>VORM</legend><label><input type="radio" name="category" value="All"${check('All', filters.category)}> Kõik</label>${categories}</fieldset>
        <button class="text-action" type="button" data-clear-filters>Tühjenda filtrid</button>
      </aside>
      <section class="programme-results" aria-live="polite">
        <header class="programme-day"><p>${entries.length} näidisrida</p><h2>${dateTitle}</h2></header>
        <div class="programme-table">${entries.length ? entries.map((entry) => renderProgrammeRow(entry, filters)).join('') : `<div class="programme-empty"><h2>Ükski valik ei sobi.</h2><p>Proovi teist kuupäeva või tühjenda filtrid.</p><button type="button" data-clear-filters>Tühjenda filtrid</button></div>`}</div>
      </section>
    </div>
  </section>`;
}
