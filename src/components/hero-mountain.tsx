'use client';

import { useEffect, useRef } from 'react';
import { MOUNTAIN_SIZES, mountainSrcSet } from '@/lib/mountain-sources';
import styles from './hero-mountain.module.css';

const SUMMIT_ANCHOR = '[data-summit-anchor]';
const SUMMIT_PROPERTY = '--summit-y';
const SUMMIT_GAP_PX = 20;

type Picture = { src: string; width: number; height: number };

function layoutBottom(element: HTMLElement, container: Element): number {
  let top = element.offsetHeight;
  let current: HTMLElement | null = element;
  while (current && current !== container) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
}

export function HeroMountain(picture: Picture) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    const anchor = document.querySelector<HTMLElement>(SUMMIT_ANCHOR);
    const stage = image?.parentElement?.parentElement;
    if (!image || !anchor || !stage) return;
    const place = () => image.style.setProperty(SUMMIT_PROPERTY, `${layoutBottom(anchor, stage) + SUMMIT_GAP_PX}px`);
    const observer = new ResizeObserver(place);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.layer} aria-hidden="true">
      <img
        ref={imageRef}
        className={styles.mountain}
        {...picture}
        srcSet={mountainSrcSet(picture)}
        sizes={MOUNTAIN_SIZES}
        alt=""
        fetchPriority="high"
      />
    </div>
  );
}
