export function filterEvents(events, filters) {
  return events.filter((event) => (
    (!filters.date || event.date === filters.date)
    && (!filters.venueId || filters.venueId === 'All' || event.venueId === filters.venueId)
    && (!filters.category || filters.category === 'All' || event.category === filters.category)
  ));
}
