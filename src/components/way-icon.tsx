const ICON_PATHS = {
  web: 'M3 5.5A1.5 1.5 0 0 1 4.5 4h11A1.5 1.5 0 0 1 17 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 14.5v-9ZM3 8h14',
  file: 'M6 3h5.5L15 6.5V16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm5 0v4h4M8 11h4M8 14h4',
  api: 'M7.5 6 3.5 10l4 4M12.5 6l4 4-4 4',
};

export type WayIconName = keyof typeof ICON_PATHS;

export function WayIcon({ name, className }: { name: WayIconName; className: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
        <path d={ICON_PATHS[name]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
