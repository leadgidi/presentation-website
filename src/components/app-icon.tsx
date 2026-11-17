const ICON_PATHS = {
  fileUp:
    'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2zM14 2v5a1 1 0 0 0 1 1h5M12 12v6m3-3-3-3-3 3',
  userSearch: 'M6 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0M10.3 15H7a4 4 0 0 0-4 4v2M14 17a3 3 0 1 0 6 0 3 3 0 1 0-6 0m7 4-1.9-1.9',
  loader: 'M12 2v4m4.2 1.8 2.9-2.9M18 12h4m-5.8 4.2 2.9 2.9M12 18v4m-7.1-2.9 2.9-2.9M2 12h4M4.9 4.9l2.9 2.9',
  history: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5m4-1v5l4 2',
  keyRound:
    'M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4zM16 7.5a.5.5 0 1 0 1 0 .5.5 0 1 0-1 0',
  bookOpen:
    'M12 5v16m8.001-2A2 2 0 0 0 22 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z',
  plug: 'M12 22v-5M15 8V2m2 6a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1zM9 8V2',
  panelLeft: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4 0v18',
  lifeBuoy:
    'M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0m2.93-7.07 4.24 4.24m5.66 0 4.24-4.24m-4.24 9.9 4.24 4.24m-9.9-4.24-4.24 4.24M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0',
  circleCheck: 'M21.801 10A10 10 0 1 1 17 3.335M9 11l3 3L22 4',
  plus: 'M5 12h14M12 5v14',
  chevronsUpDown: 'm7 15 5 5 5-5M7 9l5-5 5 5',
};

export type AppIconName = keyof typeof ICON_PATHS;

export function AppIcon({ name, className }: { name: AppIconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d={ICON_PATHS[name]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
