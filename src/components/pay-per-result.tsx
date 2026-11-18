import { SectionHeading } from '@/components/section-heading';
import { payPerResult } from '@/content/home';
import { site } from '@/content/site';
import { ArrowIcon } from './arrow-icon';
import { PausableRegion } from './motion-pause';
import styles from './pay-per-result.module.css';

const TITLE_ID = 'pay-per-result-title';
const ROW_COUNT = 4;
const LOOP_COPIES = 2;
const { feed } = payPerResult;

type Person = (typeof feed.people)[number];

function splitIntoRows(people: Person[]) {
  return Array.from({ length: ROW_COUNT }, (_, row) => people.filter((_, index) => index % ROW_COUNT === row));
}

function ResultCard({ person }: { person: Person }) {
  return (
    <li className={styles.card} data-found={person.isFound || undefined}>
      <span className={styles.avatar}>
        {person.photo && <img src={person.photo} width={feed.photoSize} height={feed.photoSize} alt="" loading="lazy" />}
        <span className={styles.mark} />
      </span>
      <span className={styles.event}>
        <span className={styles.name}>{person.name}</span> {person.isFound ? feed.foundLabel : feed.missedLabel}
      </span>
      <span className={styles.charge}>{person.isFound ? feed.chargedLabel : feed.refundedLabel}</span>
    </li>
  );
}

function FeedRow({ people }: { people: Person[] }) {
  const loop = Array.from({ length: LOOP_COPIES }, () => people).flat();
  return (
    <ul className={styles.row}>
      {loop.map((person, index) => (
        <ResultCard key={`${person.name}-${index}`} person={person} />
      ))}
    </ul>
  );
}

function ResultFeed() {
  return (
    <PausableRegion className={styles.feed} buttonClassName={styles.pause}>
      <figure>
        <figcaption className={styles.caption}>{feed.caption}</figcaption>
        <div className={styles.rows} aria-hidden="true">
          {splitIntoRows(feed.people).map((people) => (
            <FeedRow key={people[0].name} people={people} />
          ))}
        </div>
      </figure>
    </PausableRegion>
  );
}

export function PayPerResult() {
  return (
    <section className="section" aria-labelledby={TITLE_ID}>
      <div className={`container split split-reverse split-wide`}>
        <div>
          <SectionHeading id={TITLE_ID} title={payPerResult.title} lede={payPerResult.lede} />
          <p className={styles.body}>{payPerResult.body}</p>
          <a href={site.secondaryCta.href} className={`button button-secondary ${styles.cta}`}>
            {site.secondaryCta.label}
            <ArrowIcon />
          </a>
        </div>
        <ResultFeed />
      </div>
    </section>
  );
}
