'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { WayIcon, WayIconName } from './way-icon';
import styles from './ways-in.module.css';

const VIEWPORT_CENTER = '-45% 0px -45% 0px';

type Way = { icon: WayIconName; name: string; title: string; body: string; windowTitle: string };
type WaysInScrollProps = { ways: Way[]; panes: ReactNode[] };

function useActiveStep(list: React.RefObject<HTMLOListElement | null>) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const steps = Array.from(list.current?.children ?? []);
    const observer = new IntersectionObserver(
      (entries) => entries.filter((entry) => entry.isIntersecting).forEach((entry) => setActiveIndex(steps.indexOf(entry.target))),
      { rootMargin: VIEWPORT_CENTER },
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [list]);

  return [activeIndex, setActiveIndex] as const;
}

function Preview({ titles, panes, activeIndex }: { titles: string[]; panes: ReactNode[]; activeIndex: number }) {
  return (
    <div className={styles.visual}>
      <div className={styles.sticky}>
        <figure className={styles.card}>
          <figcaption className="visually-hidden">{titles[activeIndex]}</figcaption>
          <div className={styles.screen}>
            {panes.map((pane, index) => (
              <div key={titles[index]} className={styles.pane} data-active={index === activeIndex || undefined} inert={index !== activeIndex}>
                {pane}
              </div>
            ))}
          </div>
        </figure>
      </div>
    </div>
  );
}

type WayStepProps = { way: Way; isActive: boolean; onSelect: () => void };

function WayStep({ way, isActive, onSelect }: WayStepProps) {
  return (
    <li className={styles.way} data-active={isActive || undefined} onClick={onSelect}>
      <p className={styles.wayLabel}>
        <WayIcon name={way.icon} className={styles.wayIcon} />
        {way.name}
      </p>
      <h3 className={styles.wayTitle}>
        <button type="button" className={styles.wayButton} aria-pressed={isActive}>
          {way.title}
        </button>
      </h3>
      <p className={styles.wayBody}>{way.body}</p>
    </li>
  );
}

export function WaysInScroll({ ways, panes }: WaysInScrollProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useActiveStep(listRef);

  return (
    <div className={styles.stage}>
      <Preview titles={ways.map((way) => way.windowTitle)} panes={panes} activeIndex={activeIndex} />
      <ol ref={listRef} className={styles.ways}>
        {ways.map((way, index) => (
          <WayStep key={way.name} way={way} isActive={index === activeIndex} onSelect={() => setActiveIndex(index)} />
        ))}
      </ol>
    </div>
  );
}
