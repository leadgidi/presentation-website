import { hero } from '@/content/home';
import { site } from '@/content/site';
import { AppShowcase } from './app-showcase';
import { ArrowIcon } from './arrow-icon';
import { FogBackdrop } from './fog-backdrop';
import { HeroMountain } from './hero-mountain';
import { HeroScroll } from './hero-scroll';
import styles from './hero.module.css';

const WORD_SEPARATOR = ' ';

function HeroTitle({ text }: { text: string }) {
  const words = text.split(WORD_SEPARATOR);
  return (
    <h1 className={styles.title}>
      {words.map((word, index) => (
        <span key={index}>
          <span className={styles.word}>{word}</span>
          {index < words.length - 1 && WORD_SEPARATOR}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  return (
    <HeroScroll
      backdrop={<FogBackdrop smoke={hero.backdrop.smoke} />}
      mountain={<HeroMountain {...hero.backdrop.mountain} />}
      copy={
        <>
          <HeroTitle text={hero.title} />
          <p className={styles.lede}>{hero.lede}</p>
          <div className={`button-row ${styles.cta}`} data-summit-anchor>
            <a href={site.signupUrl} className="button button-primary">
              {site.primaryCta}
            </a>
            <a href={site.secondaryCta.href} className="button button-secondary">
              {site.secondaryCta.label}
              <ArrowIcon />
            </a>
          </div>
        </>
      }
      showcase={<AppShowcase />}
    />
  );
}
