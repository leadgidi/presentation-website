'use client';

import { ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useMediaQuery } from '@/hooks/use-media-query';
import styles from './hero.module.css';

const LARGE_SCREEN = '(min-width: 900px)';
const SMOOTHING = { stiffness: 400, damping: 60, restDelta: 0.0005 };
const COPY_SINK_END = 0.45;
const COPY_SINK_PX = 420;
const COPY_FADE_START = 0.32;
const WINDOW_RISE_START = 0.35;
const WINDOW_REST_PX = 120;
const WINDOW_RISE_PX = -400;
const WINDOW_START_SCALE = 0.82;

function useHeroMotion(target: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, SMOOTHING);
  return {
    copy: {
      y: useTransform(progress, [0, COPY_SINK_END], [0, COPY_SINK_PX]),
      opacity: useTransform(progress, [COPY_FADE_START, COPY_SINK_END], [1, 0]),
    },
    window: {
      y: useTransform(progress, [WINDOW_RISE_START, 1], [WINDOW_REST_PX, WINDOW_RISE_PX]),
      scale: useTransform(progress, [WINDOW_RISE_START, 1], [WINDOW_START_SCALE, 1]),
    },
  };
}

type HeroScrollProps = { backdrop: ReactNode; copy: ReactNode; mountain: ReactNode; showcase: ReactNode };

export function HeroScroll({ backdrop, copy, mountain, showcase }: HeroScrollProps) {
  const stageRef = useRef<HTMLElement>(null);
  const motionStyles = useHeroMotion(stageRef);
  const isLargeScreen = useMediaQuery(LARGE_SCREEN);
  const prefersReducedMotion = useReducedMotion();
  const isAnimated = isLargeScreen && !prefersReducedMotion;

  return (
    <section ref={stageRef} className={styles.hero}>
      <div className={styles.sticky}>
        {backdrop}
        <motion.div className={`container ${styles.copy}`} style={isAnimated ? motionStyles.copy : undefined} data-hero-copy>
          {copy}
        </motion.div>
        {mountain}
        <motion.div className={styles.window} style={isAnimated ? motionStyles.window : undefined}>
          {showcase}
        </motion.div>
      </div>
    </section>
  );
}
