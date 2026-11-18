'use client';

import { RefObject, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useInView } from '@/hooks/use-in-view';
import { blowWind, createFogBank, FogBank as Bank, FogDensity, Point, renderFogBank, resizeFogBank, stepFogBank } from '@/lib/fog';
import { useMotionPaused } from './motion-pause';
import styles from './fog-bank.module.css';

const MILLISECONDS_PER_SECOND = 1000;
const MAX_FRAME_SECONDS = 0.05;

type BankRef = RefObject<Bank | null>;

function loadSprite(source: string): Promise<HTMLImageElement> {
  const sprite = new Image();
  sprite.src = source;
  return sprite.decode().then(() => sprite);
}

function redraw(bank: Bank) {
  resizeFogBank(bank);
  renderFogBank(bank);
}

async function loadBank(canvas: HTMLCanvasElement, spriteSource: string, density: FogDensity): Promise<Bank> {
  const bank = createFogBank(canvas, await loadSprite(spriteSource), density);
  renderFogBank(bank);
  return bank;
}

function useFogBank(canvasRef: RefObject<HTMLCanvasElement | null>, spriteSource: string, density: FogDensity): BankRef {
  const bankRef = useRef<Bank | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => bankRef.current && redraw(bankRef.current));
    let isMounted = true;
    loadBank(canvas, spriteSource, density)
      .then((bank) => {
        if (!isMounted) return;
        bankRef.current = bank;
        observer.observe(canvas);
      })
      // The fog is decorative: a sprite that fails to load just leaves the sky clear.
      .catch(() => {});
    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [canvasRef, spriteSource, density]);

  return bankRef;
}

function startFogLoop(bankRef: BankRef): () => void {
  let frame = 0;
  let previous = performance.now();
  const tick = (now: number) => {
    const bank = bankRef.current;
    if (bank) {
      stepFogBank(bank, Math.min(MAX_FRAME_SECONDS, (now - previous) / MILLISECONDS_PER_SECOND));
      renderFogBank(bank);
    }
    previous = now;
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

function localPoint(canvas: HTMLCanvasElement, event: MouseEvent): Point | null {
  const bounds = canvas.getBoundingClientRect();
  const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  return point.y >= 0 && point.y <= bounds.height ? point : null;
}

function listenForWind(canvas: HTMLCanvasElement, bankRef: BankRef): () => void {
  const onPointerMove = (event: PointerEvent) => {
    const point = localPoint(canvas, event);
    if (point && bankRef.current) blowWind(bankRef.current, point, Math.hypot(event.movementX, event.movementY));
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  return () => window.removeEventListener('pointermove', onPointerMove);
}

type FogBankProps = { sprite: string; density?: FogDensity };

export function FogBank({ sprite, density = 'light' }: FogBankProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bankRef = useFogBank(canvasRef, sprite, density);
  const isInView = useInView(canvasRef);
  const prefersReducedMotion = useReducedMotion();
  const isPaused = useMotionPaused();
  const isAnimated = isInView && !prefersReducedMotion && !isPaused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!isAnimated || !canvas) return;
    const stopLoop = startFogLoop(bankRef);
    const stopWind = listenForWind(canvas, bankRef);
    return () => {
      stopLoop();
      stopWind();
    };
  }, [isAnimated, bankRef]);

  return <canvas ref={canvasRef} className={styles.layer} />;
}
