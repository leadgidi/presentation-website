import { SectionHeading } from '@/components/section-heading';
import { whatYouGet } from '@/content/home';
import { RecordPlayback } from './record-playback';
import styles from './what-you-get.module.css';

const { record } = whatYouGet;

function ContactRecord() {
  return (
    <figure className={`showcase-panel ${styles.showcase} text-reveal`}>
      <figcaption className="visually-hidden">{record.caption}</figcaption>
      <RecordPlayback className={styles.thread}>
        <p className={styles.request}>{record.request}</p>
        <div className={styles.status}>
          <p className={styles.searching} aria-hidden="true">
            {record.searchingLabel}
          </p>
          <p className={styles.resultLabel}>{record.resultLabel}</p>
        </div>
        <RecordCard />
      </RecordPlayback>
    </figure>
  );
}

function RecordCard() {
  return (
    <div className={styles.card}>
      <div className={styles.person}>
        <img className={styles.photo} src={record.photo.src} width={record.photo.size} height={record.photo.size} alt="" />
        <div className={styles.identity}>
          <p className={styles.name}>{record.name}</p>
          <p className={styles.role}>{record.role}</p>
        </div>
        <span className={styles.badge}>{record.badge}</span>
      </div>
      <dl className={styles.fields}>
        {record.rows.map((row) => (
          <div key={row.label} className={styles.field} data-wide={row.isWide || undefined}>
            <dt className={styles.label}>{row.label}</dt>
            <dd className={styles.value}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function WhatYouGet() {
  return (
    <section id={whatYouGet.id} className="section" aria-labelledby={`${whatYouGet.id}-title`}>
      <div className={`container split split-wide`}>
        <div>
          <SectionHeading id={`${whatYouGet.id}-title`} title={whatYouGet.title} lede={whatYouGet.lede} />
          <ul className={styles.points}>
            {whatYouGet.points.map((point) => (
              <li key={point} className={`${styles.point} text-reveal`}>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <ContactRecord />
      </div>
    </section>
  );
}
