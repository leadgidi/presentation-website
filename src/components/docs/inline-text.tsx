import { parseInline } from '@/lib/inline-text';
import styles from './doc-content.module.css';

export function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((segment, index) => {
        if (segment.kind === 'code') {
          return (
            <code key={index} className={styles.inlineCode}>
              {segment.text}
            </code>
          );
        }
        if (segment.kind === 'link') {
          return (
            <a key={index} href={segment.href} className={styles.link}>
              {segment.text}
            </a>
          );
        }
        return segment.text;
      })}
    </>
  );
}
