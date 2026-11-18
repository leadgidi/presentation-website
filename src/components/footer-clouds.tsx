'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { FogBank } from './fog-bank';

const NO_HOVER_QUERY = '(hover: none)';

export function FooterClouds({ sprite }: { sprite: string }) {
  const hasNoPointerHover = useMediaQuery(NO_HOVER_QUERY);
  return <FogBank sprite={sprite} density={hasNoPointerHover ? 'light' : 'dense'} />;
}
