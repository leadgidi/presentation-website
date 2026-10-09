'use client';

import { useEffect, useRef } from 'react';

const SPACING = 24;
const DOT_SIZE = 12;
const MOUSE_RADIUS = 160;
const MOUSE_FOLLOW = 0.8;
const IDLE_ALPHA = 0.22;
const MAX_ALPHA = 0.75;
const MAX_DPR = 1.5;
const OFFSCREEN = -9999;
const PULSE_MS = 1600;
const PULSE_RADIUS = 1400;
const PULSE_BAND = 140;

export const JOINED_EVENT = 'waitlist:joined';

type Point = { x: number; y: number };
type Pulse = Point & { start: number };

function pulseLevel(x: number, y: number, pulse: Pulse | null, now: number): number {
  if (!pulse) return 0;
  const age = (now - pulse.start) / PULSE_MS;
  if (age > 1) return 0;
  const ring = age * PULSE_RADIUS;
  const band = Math.max(0, 1 - Math.abs(Math.hypot(pulse.x - x, pulse.y - y) - ring) / PULSE_BAND);
  return band * (1 - age);
}

function readDotColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--dot').trim();
}

function resize(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawDot(context: CanvasRenderingContext2D, x: number, y: number, pointer: Point, lit: number) {
  const near = Math.max(0, 1 - Math.hypot(pointer.x - x, pointer.y - y) / MOUSE_RADIUS);
  const level = Math.max(near, lit);
  const push = near * near * 0.3;
  context.globalAlpha = IDLE_ALPHA + (MAX_ALPHA - IDLE_ALPHA) * level;
  context.beginPath();
  context.arc(x + (x - pointer.x) * push, y + (y - pointer.y) * push, (DOT_SIZE * (0.4 + 0.6 * level)) / 2, 0, Math.PI * 2);
  context.fill();
}

function drawFrame(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, pointer: Point, pulse: Pulse | null) {
  const { offsetWidth: width, offsetHeight: height } = canvas;
  const now = performance.now();
  context.clearRect(0, 0, width, height);
  context.fillStyle = readDotColor();
  for (let x = SPACING / 2; x < width; x += SPACING) {
    for (let y = SPACING / 2; y < height; y += SPACING) drawDot(context, x, y, pointer, pulseLevel(x, y, pulse, now));
  }
  context.globalAlpha = 1;
}

function startField(canvas: HTMLCanvasElement): () => void {
  const context = canvas.getContext('2d');
  if (!context) return () => undefined;
  const target: Point = { x: OFFSCREEN, y: OFFSCREEN };
  const pointer: Point = { x: OFFSCREEN, y: OFFSCREEN };
  const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pulse: Pulse | null = null;
  let request = 0;

  const onMove = (event: PointerEvent) => void ((target.x = event.clientX), (target.y = event.clientY));
  const onLeave = () => void ((target.x = OFFSCREEN), (target.y = OFFSCREEN));
  const onJoined = (event: Event) => void (pulse = { ...(event as CustomEvent<Point>).detail, start: performance.now() });
  const tick = () => {
    pointer.x += (target.x - pointer.x) * MOUSE_FOLLOW;
    pointer.y += (target.y - pointer.y) * MOUSE_FOLLOW;
    drawFrame(canvas, context, pointer, pulse);
    if (animate) request = requestAnimationFrame(tick);
  };
  const observer = new ResizeObserver(() => void (resize(canvas, context), animate || drawFrame(canvas, context, pointer, null)));

  resize(canvas, context);
  observer.observe(canvas);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  window.addEventListener(JOINED_EVENT, onJoined);
  tick();
  return () => {
    cancelAnimationFrame(request);
    observer.disconnect();
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
    window.removeEventListener(JOINED_EVENT, onJoined);
  };
}

export function DotField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => (canvas.current ? startField(canvas.current) : undefined), []);
  return <canvas ref={canvas} className="dot-field" aria-hidden="true" />;
}
