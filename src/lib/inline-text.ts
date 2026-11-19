export type InlineSegment =
  | { kind: 'text'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'link'; text: string; href: string };

const INLINE_PATTERN = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInline(source: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let cursor = 0;
  for (const match of source.matchAll(INLINE_PATTERN)) {
    if (match.index > cursor) segments.push({ kind: 'text', text: source.slice(cursor, match.index) });
    segments.push(match[1] ? { kind: 'code', text: match[1] } : { kind: 'link', text: match[2], href: match[3] });
    cursor = match.index + match[0].length;
  }
  if (cursor < source.length) segments.push({ kind: 'text', text: source.slice(cursor) });
  return segments;
}

export function toAnchorId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
