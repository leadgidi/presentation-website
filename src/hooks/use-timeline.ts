import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export function useTimeline(durations: number[], isActive: boolean): number {
  const [index, setIndex] = useState(durations.length - 1);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isActive || prefersReducedMotion) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % durations.length), durations[index]);
    return () => clearTimeout(timer);
  }, [index, isActive, durations, prefersReducedMotion]);

  return index;
}
