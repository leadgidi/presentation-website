export type Point = { x: number; y: number };

type Band = { top: number; spread: number; count: number; minSize: number; maxSize: number; opacity: number };

type Puff = {
  homeX: number;
  homeY: number;
  offsetX: number;
  offsetY: number;
  velocityX: number;
  velocityY: number;
  size: number;
  rotation: number;
  spin: number;
  opacity: number;
  phase: number;
};

export type FogBank = {
  context: CanvasRenderingContext2D;
  sprite: HTMLImageElement;
  puffs: Puff[];
  width: number;
  height: number;
  time: number;
};

export type FogDensity = 'light' | 'dense';

const RESOLUTION = 0.5;
const LIGHT_BANDS: Band[] = [
  { top: 0.12, spread: 0.12, count: 18, minSize: 260, maxSize: 460, opacity: 0.6 },
  { top: 0.42, spread: 0.1, count: 30, minSize: 220, maxSize: 420, opacity: 0.9 },
  { top: 0.64, spread: 0.14, count: 30, minSize: 260, maxSize: 520, opacity: 0.95 },
];
const DENSE_BANDS: Band[] = [
  { top: 0.22, spread: 0.14, count: 40, minSize: 240, maxSize: 440, opacity: 1 },
  { top: 0.46, spread: 0.14, count: 46, minSize: 240, maxSize: 460, opacity: 1 },
  { top: 0.72, spread: 0.12, count: 32, minSize: 260, maxSize: 520, opacity: 0.95 },
];
const BANDS_BY_DENSITY: Record<FogDensity, Band[]> = { light: LIGHT_BANDS, dense: DENSE_BANDS };
const FLOW_PER_SECOND = 24;
const SWAY_DISTANCE = 30;
const SWAY_SPEED = 0.35;
const MAX_SPIN = 0.08;
const RETURN_STIFFNESS = 0.5;
const DAMPING = 1.3;
const MAX_VELOCITY = 140;
const WIND_STRENGTH = 1.1;
const WIND_RANGE = 300;
const VERTICAL_SHARE = 0.3;

function between(minimum: number, maximum: number): number {
  return minimum + Math.random() * (maximum - minimum);
}

function createPuff(band: Band, width: number, height: number): Puff {
  return {
    homeX: Math.random() * width,
    homeY: (band.top + between(-band.spread, band.spread)) * height,
    offsetX: 0,
    offsetY: 0,
    velocityX: 0,
    velocityY: 0,
    size: between(band.minSize, band.maxSize),
    rotation: Math.random() * Math.PI * 2,
    spin: between(-MAX_SPIN, MAX_SPIN),
    opacity: band.opacity * between(0.6, 1),
    phase: Math.random() * Math.PI * 2,
  };
}

function sizeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = Math.ceil(canvas.clientWidth * RESOLUTION);
  canvas.height = Math.ceil(canvas.clientHeight * RESOLUTION);
}

export function createFogBank(canvas: HTMLCanvasElement, sprite: HTMLImageElement, density: FogDensity): FogBank {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  sizeCanvas(canvas);
  const puffs = BANDS_BY_DENSITY[density].flatMap((band) => Array.from({ length: band.count }, () => createPuff(band, width, height)));
  return { context: canvas.getContext('2d') as CanvasRenderingContext2D, sprite, puffs, width, height, time: 0 };
}

export function resizeFogBank(bank: FogBank) {
  const canvas = bank.context.canvas;
  const scaleX = canvas.clientWidth / bank.width;
  const scaleY = canvas.clientHeight / bank.height;
  for (const puff of bank.puffs) {
    puff.homeX *= scaleX;
    puff.homeY *= scaleY;
  }
  bank.width = canvas.clientWidth;
  bank.height = canvas.clientHeight;
  sizeCanvas(canvas);
}

function clampVelocity(value: number): number {
  return Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, value));
}

function stepPuff(puff: Puff, seconds: number, width: number) {
  puff.velocityX += (-RETURN_STIFFNESS * puff.offsetX - DAMPING * puff.velocityX) * seconds;
  puff.velocityY += (-RETURN_STIFFNESS * puff.offsetY - DAMPING * puff.velocityY) * seconds;
  puff.offsetX += puff.velocityX * seconds;
  puff.offsetY += puff.velocityY * seconds;
  puff.rotation += puff.spin * seconds;
  puff.homeX += FLOW_PER_SECOND * seconds;
  if (puff.homeX - puff.size > width) puff.homeX = -puff.size;
}

export function stepFogBank(bank: FogBank, seconds: number) {
  bank.time += seconds;
  for (const puff of bank.puffs) stepPuff(puff, seconds, bank.width);
}

function puffCenter(puff: Puff, time: number): Point {
  const sway = Math.sin(time * SWAY_SPEED + puff.phase) * SWAY_DISTANCE;
  return { x: puff.homeX + puff.offsetX + sway, y: puff.homeY + puff.offsetY };
}

export function renderFogBank({ context, sprite, puffs, time }: FogBank) {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  for (const puff of puffs) {
    const center = puffCenter(puff, time);
    const cosine = Math.cos(puff.rotation) * RESOLUTION;
    const sine = Math.sin(puff.rotation) * RESOLUTION;
    context.globalAlpha = puff.opacity;
    context.setTransform(cosine, sine, -sine, cosine, center.x * RESOLUTION, center.y * RESOLUTION);
    context.drawImage(sprite, -puff.size / 2, -puff.size / 2, puff.size, puff.size);
  }
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.globalAlpha = 1;
}

function pushAway(bank: FogBank, origin: Point, strength: number, range: number) {
  for (const puff of bank.puffs) {
    const center = puffCenter(puff, bank.time);
    const deltaX = center.x - origin.x;
    const deltaY = (center.y - origin.y) * VERTICAL_SHARE;
    const distance = Math.max(1, Math.hypot(deltaX, deltaY));
    const force = strength * Math.exp(-distance / range);
    puff.velocityX = clampVelocity(puff.velocityX + (deltaX / distance) * force);
    puff.velocityY = clampVelocity(puff.velocityY + (deltaY / distance) * force);
  }
}

export function blowWind(bank: FogBank, pointer: Point, speed: number) {
  pushAway(bank, pointer, speed * WIND_STRENGTH, WIND_RANGE);
}
