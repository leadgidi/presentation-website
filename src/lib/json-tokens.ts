export type JsonTokenKind = 'key' | 'string' | 'number' | 'literal' | 'plain';
export type JsonToken = { text: string; kind: JsonTokenKind };

const TOKEN_PATTERN = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|\b(true|false|null)\b/g;

function classify(match: RegExpExecArray): JsonToken[] {
  const [, quoted, colon, number, literal] = match;
  if (quoted && colon) return [{ text: quoted, kind: 'key' }, { text: colon, kind: 'plain' }];
  if (quoted) return [{ text: quoted, kind: 'string' }];
  if (number) return [{ text: number, kind: 'number' }];
  return [{ text: literal, kind: 'literal' }];
}

export function tokenizeJson(source: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  let cursor = 0;
  for (const match of source.matchAll(TOKEN_PATTERN)) {
    const start = match.index ?? 0;
    if (start > cursor) tokens.push({ text: source.slice(cursor, start), kind: 'plain' });
    tokens.push(...classify(match as RegExpExecArray));
    cursor = start + match[0].length;
  }
  if (cursor < source.length) tokens.push({ text: source.slice(cursor), kind: 'plain' });
  return tokens;
}
