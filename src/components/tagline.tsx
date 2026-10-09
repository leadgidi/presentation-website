'use client';

import { useEffect, useState } from 'react';

const SHOW_MS = 3800;
const FADE_MS = 400;

export function Tagline({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const show = setInterval(() => setFading(true), SHOW_MS);
    return () => clearInterval(show);
  }, []);

  useEffect(() => {
    if (!fading) return;
    const swap = setTimeout(() => {
      setIndex((current) => (current + 1) % lines.length);
      setFading(false);
    }, FADE_MS);
    return () => clearTimeout(swap);
  }, [fading, lines.length]);

  return <p className={fading ? 'lede is-fading' : 'lede'}>{lines[index]}</p>;
}
