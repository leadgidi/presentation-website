'use client';

import { useRef } from 'react';
import { ShowcasePerson, appPreview, showcase } from '@/content/showcase';
import { useInView } from '@/hooks/use-in-view';
import { useTimeline } from '@/hooks/use-timeline';
import { ShowcaseFrame, buildFrames, typedValues } from '@/lib/showcase-timeline';
import { AppIcon } from './app-icon';
import styles from './app-showcase.module.css';

const FRAMES = buildFrames(showcase.people);
const DURATIONS = FRAMES.map((frame) => frame.durationMs);
const MARK_VIEW_BOX = '43 30 154 154';
const MARK_OFFSET = 'translate(-11 -16)';
const MARK_STEM = 'M70 72 A26 26 0 0 1 122 72 V138 C122 158 134 168 158 168 L178 168 C178 190 152 200 124 200 C92 200 70 180 70 150 Z';
const MARK_DOT = { cx: 170, cy: 118, r: 22 };

type RowState = keyof typeof appPreview.status;
type Row = { name: string; company: string; email: string; state: RowState };

function toRow(person: ShowcasePerson, state: RowState): Row {
  return { name: `${person.firstName} ${person.lastName}`, company: person.company, email: person.email, state };
}

function rowsFor(frame: ShowcaseFrame): Row[] {
  const isListed = frame.stage === 'searching' || frame.stage === 'done';
  const processed = showcase.people.slice(0, frame.personIndex + (isListed ? 1 : 0));
  const live = processed.map((person, index) =>
    toRow(person, index === frame.personIndex && frame.stage === 'searching' ? 'searching' : 'found'),
  );
  return [...live.reverse(), ...appPreview.history.map((person) => toRow(person, 'found'))];
}

function Brand() {
  return (
    <p className={styles.brand}>
      <span className={styles.mark}>
        <svg viewBox={MARK_VIEW_BOX} fill="currentColor">
          <g transform={MARK_OFFSET}>
            <path d={MARK_STEM} />
            <circle {...MARK_DOT} />
          </g>
        </svg>
      </span>
      {appPreview.workspace}
    </p>
  );
}

function SidebarNav() {
  return (
    <div className={styles.nav}>
      {appPreview.navigation.map((group) => (
        <div key={group.title}>
          <p className={styles.groupLabel}>{group.title}</p>
          <ul className={styles.items}>
            {group.items.map((item) => (
              <li key={item.label} className={styles.item} data-active={item.label === appPreview.activeItem}>
                <AppIcon name={item.icon} />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SidebarFooter() {
  const { credits, user } = appPreview;
  return (
    <div className={styles.sidebarFooter}>
      <div className={styles.credits}>
        <p className={styles.creditsLabel}>{credits.label}</p>
        <p className={styles.creditsValue}>{credits.value}</p>
        <p className={styles.creditsLabel}>{credits.unit}</p>
        <span className={styles.creditsAction}>{credits.action}</span>
      </div>
      <p className={styles.user}>
        <span className={styles.avatar}>{user.initials}</span>
        <span className={styles.userText}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userEmail}>{user.email}</span>
        </span>
        <AppIcon name="chevronsUpDown" className={styles.muted} />
      </p>
    </div>
  );
}

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Brand />
      <SidebarNav />
      <SidebarFooter />
    </div>
  );
}

function PageHeader() {
  return (
    <div className={styles.pageHeader}>
      <AppIcon name="panelLeft" className={styles.muted} />
      <span className={styles.divider} />
      <span className={styles.breadcrumb}>{appPreview.breadcrumb}</span>
      <span className={styles.headerLinks}>
        {appPreview.headerLinks.map((link) => (
          <span key={link.label} className={styles.headerLink}>
            <AppIcon name={link.icon} />
            {link.label}
          </span>
        ))}
      </span>
    </div>
  );
}

function PageHeading({ frame }: { frame: ShowcaseFrame }) {
  return (
    <div className={styles.heading}>
      <div>
        <p className={styles.title}>{appPreview.title}</p>
        <p className={styles.description}>{appPreview.description}</p>
      </div>
      <span className={styles.submit} data-ready={frame.typed > 0} data-pressed={frame.stage === 'pause'}>
        {appPreview.submit}
      </span>
    </div>
  );
}

function DraftRow({ frame }: { frame: ShowcaseFrame }) {
  const values = typedValues(showcase.people[frame.personIndex], frame.typed);
  const caretIndex = frame.stage === 'typing' ? values.filter(Boolean).length - 1 : -1;
  return (
    <div className={styles.draftRow}>
      <span className={styles.rowNumber}>{appPreview.rowNumber}</span>
      <div className={styles.draft}>
        {appPreview.placeholders.map((placeholder, index) => (
          <span key={placeholder} className={styles.field} data-filled={Boolean(values[index])} data-caret={index === caretIndex}>
            {values[index] || placeholder}
          </span>
        ))}
      </div>
    </div>
  );
}

function EnrichForm({ frame }: { frame: ShowcaseFrame }) {
  return (
    <div className={styles.panel}>
      <div className={styles.formBody}>
        <DraftRow frame={frame} />
        <p className={styles.addRow}>
          <AppIcon name="plus" />
          {appPreview.addPerson}
        </p>
      </div>
      <p className={styles.formFooter}>{appPreview.limit}</p>
    </div>
  );
}

function ResultRow({ row }: { row: Row }) {
  return (
    <div className={styles.rowWrap}>
      <div className={styles.row} data-state={row.state}>
        <span>{row.name}</span>
        <span className={styles.company}>{row.company}</span>
        <span className={styles.emailCell}>
          <span className={styles.skeleton} />
          <span className={styles.email}>{row.email}</span>
        </span>
        <span className={styles.status}>
          <AppIcon name="circleCheck" className={styles.statusIcon} />
          {appPreview.status[row.state]}
        </span>
      </div>
    </div>
  );
}

function RecentPanel({ frame }: { frame: ShowcaseFrame }) {
  return (
    <div className={styles.panel}>
      <div className={styles.recentHead}>
        <span className={styles.recentTitle}>{appPreview.recent}</span>
        <span className={styles.viewAll}>{appPreview.viewAll}</span>
      </div>
      <div className={styles.columns}>
        {appPreview.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {rowsFor(frame).map((row) => (
        <ResultRow key={row.name} row={row} />
      ))}
    </div>
  );
}

function TitleBar() {
  return (
    <div className={styles.titleBar} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export function AppShowcase() {
  const windowRef = useRef<HTMLElement>(null);
  const frame = FRAMES[useTimeline(DURATIONS, useInView(windowRef))];

  return (
    <figure ref={windowRef} className={styles.window} aria-label={showcase.caption}>
      <TitleBar />
      <div className={styles.body} aria-hidden="true">
        <Sidebar />
        <div className={styles.main}>
          <PageHeader />
          <div className={styles.content}>
            <PageHeading frame={frame} />
            <EnrichForm frame={frame} />
            <RecentPanel frame={frame} />
          </div>
        </div>
      </div>
    </figure>
  );
}
