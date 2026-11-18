type Picture = { src: string; width: number };

const VARIANT_WIDTHS = [1600, 2560];
const WEBP_EXTENSION = /\.webp$/;

// The mountain is never narrower than 1260 CSS px (it is cropped on phones), so phones still need a wide variant.
export const MOUNTAIN_SIZES = '(max-width: 1260px) 1260px, 100vw';

export function mountainSrcSet({ src, width }: Picture): string {
  const variants = VARIANT_WIDTHS.map((variantWidth) => `${src.replace(WEBP_EXTENSION, `-${variantWidth}.webp`)} ${variantWidth}w`);
  return [...variants, `${src} ${width}w`].join(', ');
}
