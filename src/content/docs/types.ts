export type DocBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[]; isOrdered?: boolean }
  | { type: 'code'; language: string; code: string }
  | { type: 'table'; columns: string[]; rows: string[][] }
  | { type: 'note'; text: string };

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  blocks: DocBlock[];
};

export type DocSection = { title: string; pages: DocPage[] };
