import { site } from '@/content/site';
import styles from './logo.module.css';

const LOCKUP_WIDTH = 394;
const LOCKUP_HEIGHT = 100;

export function Logo() {
  return (
    <img
      src={site.brand.lockup}
      alt={site.company}
      width={LOCKUP_WIDTH}
      height={LOCKUP_HEIGHT}
      className={styles.image}
    />
  );
}
