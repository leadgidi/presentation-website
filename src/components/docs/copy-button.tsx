'use client';

import { useEffect, useState } from 'react';
import { docsCopy } from '@/content/docs';
import styles from './doc-content.module.css';

const COPIED_RESET_MS = 1600;

export function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = window.setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
    return () => window.clearTimeout(timer);
  }, [isCopied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  return (
    <button type="button" className={styles.copyButton} onClick={handleCopy}>
      <span aria-live="polite">{isCopied ? docsCopy.copiedLabel : docsCopy.copyLabel}</span>
    </button>
  );
}
