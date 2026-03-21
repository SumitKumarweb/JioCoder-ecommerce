import type { CodeTrack } from '@/lib/code/codeTracks';

const MAX_DESC = 158;

function trimForSERP(text: string, max = MAX_DESC): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

/** HTML meta description (≈150–160 chars). */
export function codeTrackMetaDescription(track: CodeTrack): string {
  return trimForSERP(
    `Free ${track.title} playground — ${track.tagline}. ${track.description}`
  );
}

/** Richer OG / social snippet (can be slightly longer). */
export function codeTrackOgDescription(track: CodeTrack): string {
  return trimForSERP(
    `Write and run ${track.title} on JioCoder: ${track.tagline}. ${track.description}`,
    200
  );
}

export function codeTrackMetaKeywords(track: CodeTrack): string[] {
  const t = track.title.toLowerCase();
  return [
    `learn ${track.title}`,
    `${track.title} tutorial`,
    `${t} India`,
    `${track.title} online`,
    `${track.title} playground`,
    `${track.title} compiler online`,
    `${track.title} exercises`,
    'JioCoder',
    'learn to code free',
    'online coding practice',
  ];
}

/** JSON-LD `keywords` field (comma-separated). */
export function codeTrackSchemaKeywords(track: CodeTrack): string {
  return [
    track.title,
    `learn ${track.title}`,
    track.tagline,
    'JioCoder',
    'code playground',
    'India',
  ].join(', ');
}
