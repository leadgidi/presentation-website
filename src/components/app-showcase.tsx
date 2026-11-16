'use client';

import { useRef } from 'react';
import { ShowcasePerson, appPreview, showcase } from '@/content/showcase';
import { useInView } from '@/hooks/use-in-view';
import { useTimeline } from '@/hooks/use-timeline';
import { ShowcaseFrame, buildFrames, typedValues } from '@/lib/showcase-timeline';
import styles from './app-showcase.module.css';

const FRAMES = buildFrames(showcase.people);
const DURATIONS = FRAMES.map((frame) => frame.durationMs);

type RowState = keyof typeof appPreview.status;
type Row = ShowcasePerson & { state: RowState };

function rowsFor(frame: ShowcaseFrame): Row[] {
  const isListed = frame.stage === 'searching' || frame.stage === 'done';
  const processed = showcase.people.slice(0, frame.personIndex + (isListed ? 1 : 0));
  const live = processed.map((person, index): Row => ({
    ...person,
    state: index === frame.personIndex && frame.stage === 'searching' ? 'searching' : 'found',
  }));
  return [...live.reverse(), ...appPreview.history.map((person): Row => ({ ...person, state: 'found' }))];
}

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <p className={styles.workspace}>
        <span className={styles.mark}>{appPreview.workspaceInitial}</span>
        {appPreview.workspace}
      </p>
      <ul className={styles.items}>
        {appPreview.sidebar.map((item) => (
          <li key={item} className={styles.item} data-active={item === appPreview.activeItem}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EnrichForm({ frame }: { frame: ShowcaseFrame }) {
  const person = showcase.people[frame.personIndex];
  const values = typedValues(person, frame.typed);
  const caretIndex = frame.stage === 'typing' ? (values[1] ? 1 : 0) : -1;
  return (
    <div className={styles.form}>
      {appPreview.placeholders.map((placeholder, index) => (
        <span key={placeholder} className={styles.field} data-filled={Boolean(values[index])} data-caret={index === caretIndex}>
          {values[index] || placeholder}
        </span>
      ))}
      <span className={styles.submit} data-pressed={frame.stage === 'pause'}>
        {appPreview.submit}
      </span>
    </div>
  );
}

function ResultRow({ row }: { row: Row }) {
  return (
    <div className={styles.rowWrap}>
      <div className={styles.row} data-state={row.state}>
        <span className={styles.name}>{row.name}</span>
        <span className={styles.company}>{row.company}</span>
        <span className={styles.emailCell}>
          <span className={styles.skeleton} />
          <span className={styles.email}>{row.email}</span>
        </span>
        <span className={styles.status}>{appPreview.status[row.state]}</span>
      </div>
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

function ResultTable({ frame }: { frame: ShowcaseFrame }) {
  return (
    <>
      <div className={styles.header}>
        {appPreview.columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      {rowsFor(frame).map((row) => (
        <ResultRow key={row.name} row={row} />
      ))}
    </>
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
          <p className={styles.title}>{appPreview.title}</p>
          <EnrichForm frame={frame} />
          <ResultTable frame={frame} />
        </div>
      </div>
    </figure>
  );
}
