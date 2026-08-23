import events from "./events.json";

export default events;

export function getEventBySlug(slug) {
  return events.find((e) => e.slug === slug) ?? null;
}
