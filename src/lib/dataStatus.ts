export const DATASET = {
  mode: 'DEMO' as const,
  // TODO: replace with real ingest timestamp once the RSS/Supabase pipeline is live.
  updatedAt: '2026-08-11T12:00:00-04:00',
  source: 'The Maple Pitch demonstration dataset',
  disclaimer: 'Demonstration values only. Connect verified providers before publishing live statistics.',
};

export function formatUpdatedAt(iso: string) {
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime())) return 'UNKNOWN';
  return new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Toronto' }).format(parsed);
}
