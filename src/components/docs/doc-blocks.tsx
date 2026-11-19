import type { DocBlock } from '@/content/docs';
import { toAnchorId } from '@/lib/inline-text';
import { CodeBlock } from './code-block';
import { DocTable } from './doc-table';
import { InlineText } from './inline-text';
import styles from './doc-content.module.css';

function DocList({ items, isOrdered }: { items: string[]; isOrdered?: boolean }) {
  const List = isOrdered ? 'ol' : 'ul';
  return (
    <List className={isOrdered ? styles.orderedList : styles.list}>
      {items.map((item) => (
        <li key={item}>
          <InlineText text={item} />
        </li>
      ))}
    </List>
  );
}

function renderBlock(block: DocBlock) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 id={toAnchorId(block.text)} className={styles.heading}>
          {block.text}
        </h2>
      );
    case 'list':
      return <DocList items={block.items} isOrdered={block.isOrdered} />;
    case 'code':
      return <CodeBlock code={block.code} language={block.language} />;
    case 'table':
      return <DocTable columns={block.columns} rows={block.rows} />;
    case 'note':
      return (
        <p className={styles.note}>
          <InlineText text={block.text} />
        </p>
      );
    case 'paragraph':
      return (
        <p className={styles.paragraph}>
          <InlineText text={block.text} />
        </p>
      );
  }
}

export function DocBlocks({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className={styles.prose}>
      {blocks.map((block, index) => (
        <div key={index} className={styles.block}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
}
