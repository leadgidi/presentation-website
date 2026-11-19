import { CopyButton } from './copy-button';
import styles from './doc-content.module.css';

type CodeBlockProps = { code: string; language: string; label?: string };

export function CodeBlock({ code, language, label }: CodeBlockProps) {
  return (
    <figure className={styles.codeBlock}>
      <figcaption className={styles.codeHead}>
        <span>{label ?? language}</span>
        <CopyButton text={code} />
      </figcaption>
      <pre className={styles.code} tabIndex={0}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
