'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import { site } from '@/content/site';
import styles from './motion-pause.module.css';

const ICON_VIEW_BOX = '0 0 24 24';
const PAUSE_ICON = 'M6 4h4v16H6zM14 4h4v16h-4z';
const PLAY_ICON = 'M7 4l13 8-13 8z';

const MotionPausedContext = createContext(false);

export function useMotionPaused(): boolean {
  return useContext(MotionPausedContext);
}

type PauseButtonProps = { isPaused: boolean; onToggle: () => void; className?: string };

export function PauseButton({ isPaused, onToggle, className = '' }: PauseButtonProps) {
  return (
    <button type="button" className={`${styles.button} ${className}`} aria-label={isPaused ? site.playAnimation : site.pauseAnimation} onClick={onToggle}>
      <svg viewBox={ICON_VIEW_BOX} aria-hidden="true">
        <path d={isPaused ? PLAY_ICON : PAUSE_ICON} />
      </svg>
    </button>
  );
}

type PausableRegionProps = { className?: string; buttonClassName?: string; children: ReactNode };

export function PausableRegion({ className, buttonClassName, children }: PausableRegionProps) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className={className} data-paused={isPaused || undefined}>
      <MotionPausedContext value={isPaused}>{children}</MotionPausedContext>
      <PauseButton isPaused={isPaused} onToggle={() => setIsPaused((current) => !current)} className={buttonClassName} />
    </div>
  );
}
