'use client';

import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const VISIBLE_SHARE = 0.4;

type Phase = 'complete' | 'waiting' | 'asking' | 'searching' | 'found';

const SEQUENCE: { phase: Phase; atMs: number }[] = [
  { phase: 'asking', atMs: 0 },
  { phase: 'searching', atMs: 900 },
  { phase: 'found', atMs: 2600 },
];

function playSequence(setPhase: (phase: Phase) => void) {
  const timers = SEQUENCE.map(({ phase, atMs }) => setTimeout(() => setPhase(phase), atMs));
  return () => timers.forEach(clearTimeout);
}

function playWhenVisible(element: HTMLElement, setPhase: (phase: Phase) => void) {
  let stopSequence = () => {};
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      stopSequence = playSequence(setPhase);
    },
    { threshold: VISIBLE_SHARE },
  );
  observer.observe(element);
  return () => {
    observer.disconnect();
    stopSequence();
  };
}

function usePlaybackPhase(target: RefObject<HTMLDivElement | null>) {
  const [phase, setPhase] = useState<Phase>('complete');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return setPhase('complete');
    if (!target.current) return;
    setPhase('waiting');
    return playWhenVisible(target.current, setPhase);
  }, [target, prefersReducedMotion]);

  return phase;
}

export function RecordPlayback({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const phase = usePlaybackPhase(ref);
  return (
    <div ref={ref} className={className} data-phase={phase}>
      {children}
    </div>
  );
}
