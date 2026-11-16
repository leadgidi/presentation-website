'use client';

import { ReactNode, useEffect, useState } from 'react';

const TOP_THRESHOLD_PX = 8;
const HERO_COPY_SELECTOR = '[data-hero-copy]';
const HERO_CTA_SELECTOR = '[data-summit-anchor]';
const VISIBLE_OPACITY = 0.3;
const SETTLE_DELAY_MS = 450;

function isShowing(cta: HTMLElement | null, copy: HTMLElement | null): boolean {
  if (!cta || !copy) return false;
  const bounds = cta.getBoundingClientRect();
  const isInViewport = bounds.bottom > 0 && bounds.top < window.innerHeight;
  return isInViewport && Number(getComputedStyle(copy).opacity) > VISIBLE_OPACITY;
}

function listenForScroll(read: () => void): () => void {
  let frame = 0;
  let settleTimer = 0;
  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(read);
    window.clearTimeout(settleTimer);
    // Hero copy fades through a spring, so its final opacity lands after scrolling stops.
    settleTimer = window.setTimeout(read, SETTLE_DELAY_MS);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(frame);
    window.clearTimeout(settleTimer);
  };
}

function useScrollState() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHeroCtaVisible, setIsHeroCtaVisible] = useState(true);

  useEffect(() => {
    const cta = document.querySelector<HTMLElement>(HERO_CTA_SELECTOR);
    const copy = document.querySelector<HTMLElement>(HERO_COPY_SELECTOR);
    const read = () => {
      setIsAtTop(window.scrollY <= TOP_THRESHOLD_PX);
      setIsHeroCtaVisible(isShowing(cta, copy));
    };
    read();
    return listenForScroll(read);
  }, []);

  return { isAtTop, isHeroCtaVisible };
}

export function HeaderShell({ className, children }: { className: string; children: ReactNode }) {
  const { isAtTop, isHeroCtaVisible } = useScrollState();

  return (
    <header className={className} data-at-top={isAtTop || undefined} data-hero-cta-visible={isHeroCtaVisible || undefined}>
      {children}
    </header>
  );
}
