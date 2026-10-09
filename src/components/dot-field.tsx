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

type Point = { x: number; y: number };

function readDotColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--dot').trim();
}

function resize(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawDot(context: CanvasRenderingContext2D, x: number, y: number, pointer: Point) {
  const near = Math.max(0, 1 - Math.hypot(pointer.x - x, pointer.y - y) / MOUSE_RADIUS);
  const push = near * near * 0.3;
  context.globalAlpha = IDLE_ALPHA + (MAX_ALPHA - IDLE_ALPHA) * near;
  context.beginPath();
  context.arc(x + (x - pointer.x) * push, y + (y - pointer.y) * push, (DOT_SIZE * (0.4 + 0.6 * near)) / 2, 0, Math.PI * 2);
  context.fill();
}

function drawFrame(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, pointer: Point) {
  const { offsetWidth: width, offsetHeight: height } = canvas;
  context.clearRect(0, 0, width, height);
  context.fillStyle = readDotColor();
  for (let x = SPACING / 2; x < width; x += SPACING) {
    for (let y = SPACING / 2; y < height; y += SPACING) drawDot(context, x, y, pointer);
  }
  context.globalAlpha = 1;
}

function startField(canvas: HTMLCanvasElement): () => void {
  const context = canvas.getContext('2d');
  if (!context) return () => undefined;
  const target: Point = { x: OFFSCREEN, y: OFFSCREEN };
  const pointer: Point = { x: OFFSCREEN, y: OFFSCREEN };
  const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let request = 0;

  const onMove = (event: PointerEvent) => void ((target.x = event.clientX), (target.y = event.clientY));
  const onLeave = () => void ((target.x = OFFSCREEN), (target.y = OFFSCREEN));
  const tick = () => {
    pointer.x += (target.x - pointer.x) * MOUSE_FOLLOW;
    pointer.y += (target.y - pointer.y) * MOUSE_FOLLOW;
    drawFrame(canvas, context, pointer);
    if (animate) request = requestAnimationFrame(tick);
  };
  const observer = new ResizeObserver(() => void (resize(canvas, context), animate || drawFrame(canvas, context, pointer)));

  resize(canvas, context);
  observer.observe(canvas);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  tick();
  return () => {
    cancelAnimationFrame(request);
    observer.disconnect();
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
  };
}

export function DotField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => (canvas.current ? startField(canvas.current) : undefined), []);
  return <canvas ref={canvas} className="dot-field" aria-hidden="true" />;
}
